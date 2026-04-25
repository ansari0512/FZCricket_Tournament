import { useState, useEffect } from 'react'
import { adminLogin, getAdminUsers, deleteAdminUser, resetUserCredentials, getAllTeams, updateTeam, deleteTeam, getTeamPlayers, deletePlayer, getMatches, updateMatchStatus, updateMatchScore, generateSchedule, getGallery, addGalleryPhoto, deleteGalleryPhoto } from '../services/api'
import toast from 'react-hot-toast'

const ROLE_LABELS = { batsman: '🏏 Batsman', bowler: '🎯 Bowler', 'all-rounder': '⭐ All-Rounder', 'wicket-keeper': '🧤 Wicket Keeper' }

function PlayerModal({ player, onClose, onPrev, onNext }) {
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
          <button onClick={(e) => { e.stopPropagation(); onPrev() }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl">‹</button>
          <button onClick={(e) => { e.stopPropagation(); onNext() }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl">›</button>
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

function AdminPlayerCard({ player, onDelete, onPreview }) {
  return (
    <>
      <div className="card">
        <div className="flex items-center gap-3">
          <div onClick={() => onPreview()} className="cursor-pointer flex-shrink-0">
            {player.photo ? (
              <img src={player.photo} className="w-16 h-20 object-contain bg-gray-100 rounded-lg" alt={player.name} />
            ) : (
              <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-400">{player.name?.charAt(0)}</div>
            )}
          </div>
          <div className="flex-1" onClick={() => onPreview()}>
            <p className="font-bold cursor-pointer hover:text-primary">{player.name}</p>
            <p className="text-sm text-primary">{ROLE_LABELS[player.role] || player.role}</p>
            <p className="text-xs text-gray-500">Jersey #{player.jerseyNumber}</p>
            {player.address && <p className="text-xs text-gray-400">📍 {player.address}</p>}
          </div>
          <button onClick={() => onDelete(player._id)} className="text-red-500 text-sm bg-red-50 px-3 py-1.5 rounded-lg flex-shrink-0">Delete</button>
        </div>
      </div>
    </>
  )
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('adminToken'))
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [activeTab, setActiveTab] = useState('')
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
  const [gallery, setGallery] = useState([])
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [previewIndex, setPreviewIndex] = useState(null)

  const loadData = async () => {
    try {
      const [t, u, m, g] = await Promise.all([getAllTeams(), getAdminUsers(), getMatches(), getGallery()])
      setTeams(t.data); setUsers(u.data); setMatches(m.data); setGallery(g.data)
    } catch (error) {
      console.error('Failed to load admin data:', error)
    }
  }

  useEffect(() => { if (loggedIn) loadData() }, [loggedIn])

  const toggle = (tab) => setActiveTab(activeTab === tab ? '' : tab)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await adminLogin({ username: 'admin', password })
      localStorage.setItem('adminToken', res.data.token)
      setLoggedIn(true)
      toast.success('Welcome Admin!')
    } catch { toast.error('Invalid password') }
  }

  const handleApprove = async (id) => { await updateTeam(id, { status: 'approved' }); loadData(); toast.success('Team approved!') }
  const handleReject = (team) => { setRejectModal(team); setRejectReason('') }
  const confirmReject = async () => {
    await updateTeam(rejectModal._id, { status: 'rejected', rejectReason })
    setRejectModal(null); loadData(); toast.success('Team rejected')
  }
  const handlePayment = async (id) => { await updateTeam(id, { paymentDone: true }); loadData(); toast.success('Payment confirmed!') }
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
  const handleMatchStatus = async (id, status) => { await updateMatchStatus(id, { status }); loadData() }
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
      const { uploadGalleryImage } = await import('../services/api')
      const url = await uploadGalleryImage(file)
      await addGalleryPhoto({ url, caption })
      setCaption('')
      toast.success('Photo uploaded!')
      loadData()
    } catch { toast.error('Upload failed') }
    setUploading(false)
  }
  const handleDeleteGallery = async (id) => {
    try {
      await deleteGalleryPhoto(id)
      setGallery(gallery.filter(p => p._id !== id))
    } catch { toast.error('Delete failed') }
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

  const tabBtn = (tab, label) => (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <button onClick={() => toggle(tab)}
        className={`w-full text-left px-4 py-3 font-medium text-sm flex justify-between items-center transition ${activeTab === tab ? 'cricket-gradient text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
        {label} <span>{activeTab === tab ? '▲' : '▼'}</span>
      </button>
    </div>
  )

  return (
    <div className="py-6 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <button onClick={() => { localStorage.removeItem('adminToken'); setLoggedIn(false) }} className="text-red-500 font-medium text-sm">Logout</button>
        </div>

        <div className="space-y-2">

          {/* Users */}
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <button onClick={() => toggle('Users')}
              className={`w-full text-left px-4 py-3 font-medium text-sm flex justify-between items-center transition ${activeTab === 'Users' ? 'cricket-gradient text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              👥 Users <span>{activeTab === 'Users' ? '▲' : '▼'}</span>
            </button>
            {activeTab === 'Users' && (
              <div className="p-3 space-y-3">
                {users.length === 0 ? <p className="text-center text-gray-400 py-10">No users yet</p> :
                users.map(user => (
                  <div key={user._id} className="card flex justify-between items-center">
                    <div>
                      <p className="font-bold">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.mobile}</p>
                      <p className="text-xs mt-1">{user.teamId ? <span className="text-green-600">✅ Team Registered</span> : <span className="text-yellow-600">⏳ No Team</span>}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setResetModal(user); setResetForm({ newUsername: user.username, newPassword: '' }) }} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg">Reset</button>
                      <button onClick={() => handleDeleteUser(user._id)} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teams */}
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <button onClick={() => toggle('Teams')}
              className={`w-full text-left px-4 py-3 font-medium text-sm flex justify-between items-center transition ${activeTab === 'Teams' ? 'cricket-gradient text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              🏏 Teams <span>{activeTab === 'Teams' ? '▲' : '▼'}</span>
            </button>
            {activeTab === 'Teams' && (
              <div className="p-3 space-y-3">
                {teams.length === 0 ? <p className="text-center text-gray-400 py-10">No teams yet</p> :
                teams.map(team => (
                  <div key={team._id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{team.teamName}</p>
                        <p className="text-sm text-gray-500">{team.captainName} • {team.captainPhone}</p>
                      </div>
                      <span className={team.status === 'approved' ? 'badge-approved' : team.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>{team.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {team.status === 'pending' && <button onClick={() => handleApprove(team._id)} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium">✅ Approve</button>}
                      {team.status === 'pending' && <button onClick={() => handleReject(team)} className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-medium">❌ Reject</button>}
                      {team.status === 'rejected' && <button onClick={() => handleApprove(team._id)} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium">✅ Approve</button>}
                      {team.status === 'approved' && !team.paymentDone && <button onClick={() => handlePayment(team._id)} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium">₹ Confirm Payment</button>}
                      {team.paymentDone && <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium">✅ Paid</span>}
                      {team.paymentScreenshot && !team.paymentDone && (
                        <a href={team.paymentScreenshot} target="_blank" rel="noreferrer" className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-medium">📸 View Screenshot</a>
                      )}
                      <button onClick={() => loadPlayers(team._id)} className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-medium">👥 Players</button>
                      <button onClick={() => handleDeleteTeam(team._id)} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-medium">🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Players */}
          {activeTab === 'Players' && (
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="cricket-gradient text-white px-4 py-3 text-sm font-medium flex justify-between items-center">
                👤 Players ({selectedPlayers.length})
                <button onClick={() => setActiveTab('Teams')} className="text-white text-xs">← Back</button>
              </div>
              <div className="p-3 space-y-2">
                {selectedPlayers.length === 0 ? <p className="text-center text-gray-400 py-10">No players</p> :
                selectedPlayers.map((p, i) => (
                  <AdminPlayerCard key={p._id} player={p} onDelete={handleDeletePlayer}
                    onPreview={() => setPreviewIndex(i)} />
                ))}
              </div>
            </div>
          )}
          {previewIndex !== null && selectedPlayers[previewIndex] && (
            <PlayerModal
              player={selectedPlayers[previewIndex]}
              onClose={() => setPreviewIndex(null)}
              onPrev={() => setPreviewIndex((previewIndex - 1 + selectedPlayers.length) % selectedPlayers.length)}
              onNext={() => setPreviewIndex((previewIndex + 1) % selectedPlayers.length)}
            />
          )}

          {/* Matches */}
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <button onClick={() => toggle('Matches')}
              className={`w-full text-left px-4 py-3 font-medium text-sm flex justify-between items-center transition ${activeTab === 'Matches' ? 'cricket-gradient text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              🏆 Matches <span>{activeTab === 'Matches' ? '▲' : '▼'}</span>
            </button>
            {activeTab === 'Matches' && (
              <div className="p-3 space-y-3">
                {matches.length === 0 ? <p className="text-center text-gray-400 py-10">No matches. Generate schedule first.</p> :
                matches.map(match => (
                  <div key={match._id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{match.team1?.teamName} vs {match.team2?.teamName}</p>
                        <p className="text-xs text-gray-500">{match.status} {match.team1Score ? `• ${match.team1Score.runs}/${match.team1Score.wickets} - ${match.team2Score.runs}/${match.team2Score.wickets}` : ''}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${match.status === 'in-progress' ? 'bg-red-100 text-red-700' : match.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{match.status}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {match.status === 'scheduled' && <button onClick={() => handleMatchStatus(match._id, 'in-progress')} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg">▶ Start</button>}
                      {match.status === 'in-progress' && <button onClick={() => { setScoreModal(match); setScoreData({ t1runs: match.team1Score?.runs || '', t1wickets: match.team1Score?.wickets || '', t2runs: match.team2Score?.runs || '', t2wickets: match.team2Score?.wickets || '', winnerId: '' }) }} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">📊 Update Score</button>}
                      {match.status === 'in-progress' && <button onClick={() => handleMatchStatus(match._id, 'completed')} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">⏹ End</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <button onClick={() => toggle('Schedule')}
              className={`w-full text-left px-4 py-3 font-medium text-sm flex justify-between items-center transition ${activeTab === 'Schedule' ? 'cricket-gradient text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              📅 Schedule <span>{activeTab === 'Schedule' ? '▲' : '▼'}</span>
            </button>
            {activeTab === 'Schedule' && (
              <div className="p-4">
                <p className="text-gray-500 text-sm mb-4">Creates round-robin matches for all {teams.filter(t => t.status === 'approved').length} approved teams.</p>
                <button onClick={handleGenerateSchedule} className="btn-primary">Generate Schedule</button>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <button onClick={() => toggle('Gallery')}
              className={`w-full text-left px-4 py-3 font-medium text-sm flex justify-between items-center transition ${activeTab === 'Gallery' ? 'cricket-gradient text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              📸 Gallery <span>{activeTab === 'Gallery' ? '▲' : '▼'}</span>
            </button>
            {activeTab === 'Gallery' && (
              <div className="p-3">
                <div className="card mb-4">
                  <h3 className="font-bold mb-3">📸 Upload Photo</h3>
                  <input type="text" placeholder="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} className="input mb-3" />
                  <label className={`btn-primary w-full text-center cursor-pointer block ${uploading ? 'opacity-50' : ''}`}>
                    {uploading ? 'Uploading...' : '📤 Choose & Upload'}
                    <input type="file" accept="image/*" onChange={handleGalleryUpload} disabled={uploading} className="hidden" />
                  </label>
                </div>
                {gallery.length === 0 ? <p className="text-center text-gray-400 py-10">No photos yet</p> : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gallery.map((p, i) => (
                      <div key={i} className="relative rounded-2xl overflow-hidden aspect-square shadow">
                        <img src={p.url} className="w-full h-full object-cover" />
                        {p.caption && <p className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs p-1 text-center">{p.caption}</p>}
                        <button onClick={() => handleDeleteGallery(p._id)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

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
