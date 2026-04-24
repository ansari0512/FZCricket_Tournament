import { useState, useEffect } from 'react'
import { adminLogin, getAdminUsers, deleteAdminUser, resetUserCredentials, getAllTeams, updateTeam, deleteTeam, getTeamPlayers, deletePlayer, getMatches, updateMatchStatus, updateMatchScore, generateSchedule } from '../services/api'
import toast from 'react-hot-toast'

const ROLE_LABELS = { batsman: '🏏 Batsman', bowler: '🎯 Bowler', 'all-rounder': '⭐ All-Rounder', 'wicket-keeper': '🧤 Wicket Keeper' }

function PlayerModal({ player, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="relative bg-gray-900">
          {player.photo ? (
            <img src={player.photo} className="w-full h-72 object-contain" alt={player.name} />
          ) : (
            <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-6xl font-bold text-gray-400">{player.name?.charAt(0)}</div>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">✕</button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white font-bold text-xl">{player.name}</p>
            <p className="text-gray-300 text-sm">#{player.jerseyNumber}</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-2xl">🌿</span>
            <div><p className="text-xs text-gray-500">Role</p><p className="font-bold">{ROLE_LABELS[player.role] || player.role}</p></div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-2xl">🔢</span>
            <div><p className="text-xs text-gray-500">Jersey Number</p><p className="font-bold">#{player.jerseyNumber}</p></div>
          </div>
          {player.address && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-2xl">📍</span>
              <div><p className="text-xs text-gray-500">Address</p><p className="font-bold">{player.address}</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminPlayerCard({ player, onDelete }) {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <div className="card">
        <div className="flex items-center gap-3">
          <div onClick={() => setShowModal(true)} className="cursor-pointer flex-shrink-0">
            {player.photo ? (
              <img src={player.photo} className="w-16 h-20 object-contain bg-gray-100 rounded-lg" alt={player.name} />
            ) : (
              <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-400">{player.name?.charAt(0)}</div>
            )}
          </div>
          <div className="flex-1" onClick={() => setShowModal(true)}>
            <p className="font-bold cursor-pointer hover:text-primary">{player.name}</p>
            <p className="text-sm text-primary">{ROLE_LABELS[player.role] || player.role}</p>
            <p className="text-xs text-gray-500">Jersey #{player.jerseyNumber}</p>
            {player.address && <p className="text-xs text-gray-400">📍 {player.address}</p>}
          </div>
          <button onClick={() => onDelete(player._id)} className="text-red-500 text-sm bg-red-50 px-3 py-1.5 rounded-lg flex-shrink-0">Delete</button>
        </div>
      </div>
      {showModal && <PlayerModal player={player} onClose={() => setShowModal(false)} />}
    </>
  )
}

const TABS = ['Users', 'Teams', 'Matches', 'Schedule', 'Gallery']

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('adminToken'))
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [activeTab, setActiveTab] = useState('Users')
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [matches, setMatches] = useState([])
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [scoreModal, setScoreModal] = useState(null)
  const [scoreData, setScoreData] = useState({ t1runs: '', t1wickets: '', t2runs: '', t2wickets: '', winnerId: '' })
  const [resetModal, setResetModal] = useState(null)
  const [resetForm, setResetForm] = useState({ newUsername: '', newPassword: '' })
  const [gallery, setGallery] = useState(JSON.parse(localStorage.getItem('fzGallery') || '[]'))
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')

  const loadData = async () => {
    try {
      const [t, u, m] = await Promise.all([getAllTeams(), getAdminUsers(), getMatches()])
      setTeams(t.data); setUsers(u.data); setMatches(m.data)
    } catch (error) {
      console.error('Failed to load admin data:', error)
    }
  }

  useEffect(() => {
    if (loggedIn) loadData()
  }, [loggedIn])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await adminLogin({ username: 'admin', password })
      localStorage.setItem('adminToken', res.data.token)
      setLoggedIn(true)
      toast.success('Welcome Admin!')
    } catch { toast.error('Invalid password') }
  }

  const handleApprove = async (id) => {
    await updateTeam(id, { status: 'approved' }); loadData(); toast.success('Team approved!')
  }
  const handleReject = (team) => { setRejectModal(team); setRejectReason('') }
  const confirmReject = async () => {
    await updateTeam(rejectModal._id, { status: 'rejected', rejectReason })
    setRejectModal(null); loadData(); toast.success('Team rejected')
  }
  const handlePayment = async (id) => {
    await updateTeam(id, { paymentDone: true }); loadData(); toast.success('Payment confirmed!')
  }
  const handleDeleteTeam = async (id) => {
    if (!confirm('Delete this team?')) return
    await deleteTeam(id); loadData(); toast.success('Team deleted')
  }
  const loadPlayers = async (teamId) => {
    const res = await getTeamPlayers(teamId); setSelectedPlayers(res.data); setActiveTab('Players')
  }
  const handleDeletePlayer = async (id) => {
    if (!confirm('Delete player?')) return
    await deletePlayer(id); setSelectedPlayers(selectedPlayers.filter(p => p._id !== id)); toast.success('Player deleted')
  }
  const handleDeleteUser = async (id) => {
    if (!confirm('Delete user and all data?')) return
    await deleteAdminUser(id); setUsers(users.filter(u => u._id !== id)); toast.success('User deleted')
  }
  const handleResetUser = async () => {
    await resetUserCredentials(resetModal._id, resetForm)
    setResetModal(null); loadData(); toast.success('Credentials reset!')
  }
  const handleMatchStatus = async (id, status) => {
    await updateMatchStatus(id, { status }); loadData()
  }
  const handleScoreUpdate = async () => {
    await updateMatchScore(scoreModal._id, { team1Score: { runs: +scoreData.t1runs, wickets: +scoreData.t1wickets }, team2Score: { runs: +scoreData.t2runs, wickets: +scoreData.t2wickets } })
    if (scoreData.winnerId) await updateMatchStatus(scoreModal._id, { status: 'completed', winnerId: scoreData.winnerId })
    setScoreModal(null); loadData(); toast.success('Score updated!')
  }
  const handleGenerateSchedule = async () => {
    if (!confirm('Generate schedule for all teams?')) return
    await generateSchedule(); loadData(); toast.success('Schedule generated!')
  }
  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    try {
      const { uploadImage } = await import('../services/api')
      const url = await uploadImage(file)
      const updated = [...gallery, { url, caption }]
      setGallery(updated); localStorage.setItem('fzGallery', JSON.stringify(updated))
      setCaption(''); toast.success('Photo uploaded!')
    } catch { toast.error('Upload failed') }
    setUploading(false)
  }
  const handleDeleteGallery = (i) => {
    const updated = gallery.filter((_, idx) => idx !== i)
    setGallery(updated); localStorage.setItem('fzGallery', JSON.stringify(updated))
  }

  if (!loggedIn) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card w-full max-w-md shadow-xl">
        <div className="text-center mb-6"><span className="text-5xl">🔐</span><h2 className="text-2xl font-bold mt-3">Admin Login</h2></div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} placeholder="Admin Password" value={password} onChange={e => setPassword(e.target.value)} className="input no-upper pr-12" required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">{showPass ? '🙈' : '👁️'}</button>
          </div>
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="py-6 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <button onClick={() => { localStorage.removeItem('adminToken'); setLoggedIn(false) }} className="text-red-500 font-medium text-sm">Logout</button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition ${activeTab === tab ? 'cricket-gradient text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {tab}
            </button>
          ))}
          {activeTab === 'Players' && <button className="px-4 py-2 rounded-xl font-medium text-sm cricket-gradient text-white">Players</button>}
        </div>

        {/* Reject Modal */}
        {rejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="font-bold text-lg mb-3">❌ Reject Team: {rejectModal.teamName}</h3>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection..." rows={3} className="input mb-4" />
              <div className="flex gap-2">
                <button onClick={confirmReject} className="flex-1 bg-red-500 text-white font-bold py-2 rounded-xl">Confirm Reject</button>
                <button onClick={() => setRejectModal(null)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Score Modal */}
        {scoreModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="font-bold text-lg mb-4">📊 Update Score</h3>
              <p className="text-sm text-gray-500 mb-4">{scoreModal.team1?.teamName} vs {scoreModal.team2?.teamName}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium mb-1">{scoreModal.team1?.teamName}</p>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Runs" value={scoreData.t1runs} onChange={e => setScoreData({ ...scoreData, t1runs: e.target.value })} className="input text-sm" />
                    <input type="number" placeholder="Wkts" value={scoreData.t1wickets} onChange={e => setScoreData({ ...scoreData, t1wickets: e.target.value })} className="input text-sm" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">{scoreModal.team2?.teamName}</p>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Runs" value={scoreData.t2runs} onChange={e => setScoreData({ ...scoreData, t2runs: e.target.value })} className="input text-sm" />
                    <input type="number" placeholder="Wkts" value={scoreData.t2wickets} onChange={e => setScoreData({ ...scoreData, t2wickets: e.target.value })} className="input text-sm" />
                  </div>
                </div>
              </div>
              <select value={scoreData.winnerId} onChange={e => setScoreData({ ...scoreData, winnerId: e.target.value })} className="input mb-4">
                <option value="">Select Winner (optional)</option>
                <option value={scoreModal.team1?._id}>{scoreModal.team1?.teamName}</option>
                <option value={scoreModal.team2?._id}>{scoreModal.team2?.teamName}</option>
              </select>
              <div className="flex gap-2">
                <button onClick={handleScoreUpdate} className="flex-1 btn-primary">Save</button>
                <button onClick={() => setScoreModal(null)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Modal */}
        {resetModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="font-bold text-lg mb-2">🔄 Reset Credentials</h3>
              <p className="text-sm text-gray-500 mb-4">{resetModal.username} • {resetModal.mobile}</p>
              <div className="space-y-3">
                <input type="text" placeholder="New Username" value={resetForm.newUsername} onChange={e => setResetForm({ ...resetForm, newUsername: e.target.value })} className="input no-upper" />
                <input type="text" placeholder="New Password (leave empty to keep)" value={resetForm.newPassword} onChange={e => setResetForm({ ...resetForm, newPassword: e.target.value })} className="input no-upper" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={handleResetUser} className="flex-1 btn-primary">Reset</button>
                <button onClick={() => setResetModal(null)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
