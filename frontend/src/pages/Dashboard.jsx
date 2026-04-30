import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getNotifications, markNotificationsRead, getTeam, getTeamPlayers, registerPlayer, updatePlayer, updateTeam } from '../services/api'
import { uploadImage, uploadPaymentScreenshot } from '../services/api'
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
          <button onClick={e => { e.stopPropagation(); onPrev() }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl">‹</button>
          <button onClick={e => { e.stopPropagation(); onNext() }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl">›</button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white font-bold text-xl">{player.name}</p>
            <p className="text-gray-300 text-sm">#{player.jerseyNumber}</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-2xl">🎽</span>
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

function PaymentSection({ team, onScreenshotUploaded }) {
  const [showQR, setShowQR] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploaded, setUploaded] = useState(!!team.paymentScreenshot)
  const [copied, setCopied] = useState('')

  const openUPI = (upiId) => {
    const url = `upi://pay?pa=${upiId}&pn=FZCricket&am=300&cu=INR&tn=FZCricket%20Registration`
    // Mobile pe app open karo
    window.location.href = url
    // Fallback: 2 sec baad agar app nahi khula toh UPI ID copy karo
    setTimeout(() => {}, 2000)
  }

  const copyUPI = (upiId) => {
    navigator.clipboard.writeText(upiId)
    setCopied(upiId)
    setTimeout(() => setCopied(''), 2000)
    toast.success('UPI ID copy ho gayi!')
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setUploadProgress(0)
    try {
      const url = await uploadPaymentScreenshot(file, (percent) => {
        setUploadProgress(percent)
      })
      await updateTeam(team._id, { paymentScreenshot: url })
      onScreenshotUploaded(url)
      setUploaded(true)
      toast.success('Screenshot upload ho gaya! Admin confirm karega।')
    } catch { toast.error('Upload failed') }
    setUploading(false)
    setUploadProgress(0)
  }

  // Agar paymentDone ho gaya toh yeh section hide karo
  if (team.paymentDone) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3 text-center">
        <p className="text-3xl mb-2">✅</p>
        <p className="text-green-700 font-bold">Payment Confirm Ho Gayi!</p>
        <p className="text-sm text-gray-500 mt-1">Aapki team officially registered hai।</p>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-3">
      <p className="font-bold text-yellow-800 mb-3">💰 Registration Fee Payment</p>

      <div className="bg-white rounded-xl p-3 mb-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600">Abhi pay karo:</span>
          <span className="font-bold text-primary">₹300</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Match day pe:</span>
          <span className="font-bold text-orange-500">₹800</span>
        </div>
        <div className="flex justify-between border-t pt-1">
          <span className="font-bold">Total:</span>
          <span className="font-bold">₹1,100</span>
        </div>
      </div>

      <p className="text-sm font-medium text-gray-700 mb-2">App se pay karo (₹300) — Mobile pe click karo:</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button onClick={() => openUPI('shahidansari0512@oksbi')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-2 rounded-xl text-xs flex flex-col items-center gap-1 transition">
          <span className="text-xl">📱</span> GPay
        </button>
        <button onClick={() => openUPI('8127021765@ybl')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-2 rounded-xl text-xs flex flex-col items-center gap-1 transition">
          <span className="text-xl">📱</span> PhonePe
        </button>
        <button onClick={() => openUPI('8127021765@ptaxis')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-xl text-xs flex flex-col items-center gap-1 transition">
          <span className="text-xl">📱</span> Paytm
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-2">Ya UPI ID copy karke manually pay karo:</p>
      <div className="space-y-2 mb-3">
        {[
          { label: 'GPay', id: 'shahidansari0512@oksbi' },
          { label: 'PhonePe', id: '8127021765@ybl' },
          { label: 'Paytm', id: '8127021765@ptaxis' },
        ].map(({ label, id }) => (
          <div key={id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border">
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-medium">{id}</p>
            </div>
            <button onClick={() => copyUPI(id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${copied === id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {copied === id ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
        ))}
      </div>

      {/* QR Code Section */}
      <div className="mb-3">
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-xl text-sm transition flex items-center justify-center gap-2"
        >
          <span>📷</span>
          {showQR ? 'QR Code Band Karo' : 'QR Code Se Pay Karo (PC ke liye)'}
        </button>
        {showQR && (
          <div className="mt-3 bg-white rounded-xl p-4 text-center border">
            <p className="text-sm font-medium text-gray-700 mb-3">GPay QR Code scan karo (₹300)</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=shahidansari0512@oksbi%26pn=FZCricket%26am=300%26cu=INR%26tn=FZCricket%20Registration`}
              alt="UPI QR Code"
              className="w-48 h-48 mx-auto rounded-xl shadow"
            />
            <p className="text-xs text-gray-500 mt-2">GPay, PhonePe, Paytm se scan karo</p>
            <p className="text-sm font-bold text-primary mt-1">UPI: shahidansari0512@oksbi</p>
            <p className="text-sm font-bold">Amount: ₹300</p>
          </div>
        )}
      </div>

      {uploaded ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-green-700 font-bold text-sm">✅ Screenshot upload ho gaya!</p>
          <p className="text-xs text-gray-500 mt-1">Admin confirm karne ka wait karo...</p>
          <label className="mt-2 text-xs text-primary cursor-pointer block">
            Dobara upload karo
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <div>
          <p className="text-sm text-yellow-700 mb-2">Payment ke baad screenshot upload karo:</p>
          <label className={`btn-primary w-full text-center cursor-pointer block ${uploading ? 'opacity-50' : ''}`}>
            {uploading ? `Uploading... ${uploadProgress}%` : '📸 Payment Screenshot Upload Karo'}
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
          {uploading && (
            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 transition-all duration-300" style={{width: `${uploadProgress}%`}}></div>
              </div>
              <p className="text-xs text-yellow-700 text-center mt-1">{uploadProgress}% complete</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function NotificationsPanel({ onRefresh }) {
  const [notifs, setNotifs] = useState([])
  const load = () => getNotifications().then(r => setNotifs(r.data)).catch(() => {})
  useEffect(() => { load() }, [])
  // Parent se refresh trigger hone pe reload karo
  useEffect(() => { if (onRefresh) load() }, [onRefresh])
  const unread = notifs.filter(n => !n.read).length
  const markRead = async () => {
    await markNotificationsRead()
    setNotifs(notifs.map(n => ({ ...n, read: true })))
  }
  if (notifs.length === 0) return null
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">🔔 Notifications {unread > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">{unread}</span>}</h3>
        {unread > 0 && <button onClick={markRead} className="text-sm text-primary">Mark all read</button>}
      </div>
      <div className="space-y-2">
        {notifs.map((n, i) => (
          <div key={i} className={`p-3 rounded-xl border-l-4 text-sm ${n.type === 'success' ? 'bg-green-50 border-green-500' : n.type === 'error' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'} ${!n.read ? 'font-medium' : 'opacity-60'}`}>
            <p>{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlayerRow({ p, onPreview, onEdit, canEdit }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition" onClick={() => onPreview()}>
      {p.photo ? (
        <img src={p.photo} className="w-16 h-20 object-cover rounded-lg flex-shrink-0" alt={p.name} />
      ) : (
        <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-400 flex-shrink-0">{p.jerseyNumber}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate">{p.name}</p>
        <p className="text-xs text-primary font-medium">{ROLE_LABELS[p.role] || p.role}</p>
        <p className="text-xs text-gray-400">Jersey #{p.jerseyNumber}</p>
        {p.address && <p className="text-xs text-gray-400 truncate">📍 {p.address}</p>}
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {canEdit && <button onClick={e => { e.stopPropagation(); onEdit(p) }} className="text-primary text-xs font-medium">Edit</button>}
        <span className="text-gray-300 text-lg">›</span>
      </div>
    </div>
  )
}

function EditPlayerForm({ player, onSave, onCancel, teamName }) {
  const [form, setForm] = useState({ name: player.name, role: player.role, address: player.address || '', newPhoto: null, preview: '' })
  const [loading, setLoading] = useState(false)
  const handleSave = async () => {
    setLoading(true)
    try {
      let photoUrl = null
      if (form.newPhoto) photoUrl = await uploadImage(form.newPhoto, teamName?.replace(/\s+/g, '_'))
      const data = { name: form.name.toUpperCase(), role: form.role, address: form.address.toUpperCase() }
      if (photoUrl) data.photo = photoUrl
      const res = await updatePlayer(player._id, data)
      onSave(res.data)
      toast.success('Player updated!')
    } catch { toast.error('Update failed') }
    setLoading(false)
  }
  return (
    <div className="space-y-2 p-3 bg-blue-50 rounded-xl">
      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input text-sm no-upper" placeholder="Name" />
      <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input text-sm">
        <option value="batsman">Batsman</option>
        <option value="bowler">Bowler</option>
        <option value="all-rounder">All-Rounder</option>
        <option value="wicket-keeper">Wicket Keeper</option>
      </select>
      <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="input text-sm" placeholder="Address" />
      <div>
        <label className="text-xs text-gray-500">Change Photo (optional)</label>
        <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setForm({ ...form, newPhoto: f, preview: URL.createObjectURL(f) }) }} className="input text-sm mt-1" />
        {form.preview && <img src={form.preview} className="mt-1 w-12 h-12 object-cover rounded-lg" />}
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 py-2 text-sm">{loading ? 'Saving...' : 'Save'}</button>
        <button onClick={onCancel} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { currentUser, logout, registrationOpen, refreshUser } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [team, setTeam] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editTeam, setEditTeam] = useState(false)
  const [editTeamData, setEditTeamData] = useState({})
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [playerForm, setPlayerForm] = useState({ name: '', role: 'batsman', address: '', photo: null, preview: '' })
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [previewIndex, setPreviewIndex] = useState(null)
  const [notifRefresh, setNotifRefresh] = useState(0)
  const [fileKey, setFileKey] = useState(0) // photo input reset ke liye

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return }
    const load = async () => {
      const teamId = currentUser.teamId || location.state?.teamId
      if (teamId) {
        try {
          const [teamRes, playersRes] = await Promise.all([getTeam(teamId), getTeamPlayers(teamId)])
          setTeam(teamRes.data.team)
          setEditTeamData({ teamName: teamRes.data.team.teamName, captainName: teamRes.data.team.captainName, captainPhone: teamRes.data.team.captainPhone, city: teamRes.data.team.city })
          setPlayers(playersRes.data)
          setNotifRefresh(n => n + 1)
          // localStorage mein fresh user data save karo
          const savedUser = localStorage.getItem('fzUser')
          if (savedUser) {
            const parsed = JSON.parse(savedUser)
            localStorage.setItem('fzUser', JSON.stringify({ ...parsed, teamId }))
          }
        } catch {
          await refreshUser()
        }
      } else {
        setTeam(null)
        setPlayers([])
      }
      setLoading(false)
    }
    load()
  }, [currentUser?._id, currentUser?.teamId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto refresh - jab team pending/submitted ho toh har 10 sec pe check karo
  useEffect(() => {
    if (!team || !currentUser?.teamId) return
    if (team.status === 'approved' || team.status === 'rejected') return
    const interval = setInterval(async () => {
      try {
        const res = await getTeam(currentUser.teamId)
        const freshTeam = res.data.team
        if (freshTeam.status !== team.status || freshTeam.paymentDone !== team.paymentDone) {
          setTeam(freshTeam)
          setNotifRefresh(n => n + 1)
        }
      } catch (err) {
        console.error('Team auto-refresh failed:', err)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [team?.status, team?.paymentDone, currentUser?.teamId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdateTeam = async (e) => {
    e.preventDefault()
    try {
      const res = await updateTeam(currentUser.teamId, {
        teamName: editTeamData.teamName.toUpperCase(),
        captainName: editTeamData.captainName.toUpperCase(),
        captainPhone: editTeamData.captainPhone,
        city: editTeamData.city.toUpperCase()
      })
      setTeam(res.data)
      setEditTeam(false)
      toast.success('Team updated!')
    } catch { toast.error('Update failed') }
  }

  const handleAddPlayer = async () => {
    if (!playerForm.name.trim()) return setError('Player name required hai')
    if (!playerForm.address.trim()) return setError('Player address required hai')
    if (!playerForm.photo) return setError('Player photo required hai')
    if (players.length >= 15) return setError('Maximum 15 players allowed hain')
    setUploading(true); setError('')
    try {
      const photoUrl = await uploadImage(playerForm.photo, team.teamName.replace(/\s+/g, '_'))
      const res = await registerPlayer(currentUser.teamId, {
        name: playerForm.name.toUpperCase(),
        role: playerForm.role,
        address: playerForm.address.toUpperCase(),
        photo: photoUrl,
        jerseyNumber: players.length + 1,
        age: 18
      })
      setPlayers([...players, res.data.player])
      setPlayerForm({ name: '', role: 'batsman', address: '', photo: null, preview: '' })
      setFileKey(k => k + 1) // file input reset karo
      toast.success(`Player ${players.length + 1} add ho gaya!`)
    } catch (err) { setError(err.response?.data?.message || 'Failed') }
    setUploading(false)
  }

  const handleSubmitTeam = async () => {
    if (players.length < 11) return setError('Minimum 11 players required hain')
    if (!confirm('Kya aap team submit karna chahte hain? Submit karne ke baad admin review karega।')) return
    setSubmitting(true)
    try {
      await updateTeam(currentUser.teamId, { submitted: true, status: 'pending' })
      const res = await getTeam(currentUser.teamId)
      setTeam(res.data.team)
      toast.success('Team submit ho gayi! Admin review karega।')
    } catch { toast.error('Submission failed') }
    setSubmitting(false)
  }

  // canEdit: sirf tab jab team submitted nahi hai ya rejected hai
  const canEdit = team && (!team.submitted || team.status === 'rejected')
  const isSubmitted = team?.submitted && team?.status !== 'rejected'

  if (!currentUser) return null
  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="py-8 px-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Profile */}
        <div className="card">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {currentUser.photo && <img src={currentUser.photo} className="w-10 h-10 rounded-full" alt="profile" />}
              <div>
                <h2 className="text-xl font-bold">👋 {currentUser.name || currentUser.email}</h2>
                <p className="text-gray-500 text-sm">{currentUser.email}</p>
              </div>
            </div>
            <button onClick={logout} className="text-red-500 font-medium text-sm">Logout</button>
          </div>
        </div>

        <NotificationsPanel onRefresh={notifRefresh} />

        {/* My Team */}
        <div className="card">
          <h3 className="font-bold text-lg mb-4">🏏 Meri Team</h3>
          {team ? (
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-xl">{team.teamName}</p>
                  <p className="text-gray-500 text-sm">{team.captainName} • {team.captainPhone}</p>
                  <p className="text-gray-400 text-xs">📍 {team.city}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={team.status === 'approved' ? 'badge-approved' : team.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>
                    {team.status === 'approved' ? '✅ Approved' : team.status === 'rejected' ? '❌ Rejected' : isSubmitted ? '📋 Review Mein' : '✏️ Draft'}
                  </span>
                  {canEdit && (
                    <button onClick={() => setEditTeam(!editTeam)} className="text-xs text-primary font-medium">
                      {editTeam ? 'Cancel' : '✏️ Edit Team'}
                    </button>
                  )}
                </div>
              </div>

              {canEdit && editTeam && (
                <form onSubmit={handleUpdateTeam} className="space-y-3 mb-4 bg-gray-50 p-4 rounded-xl">
                  <input type="text" placeholder="Team Name *" value={editTeamData.teamName} onChange={e => setEditTeamData({ ...editTeamData, teamName: e.target.value })} className="input" required />
                  <input type="text" placeholder="Captain Name *" value={editTeamData.captainName} onChange={e => setEditTeamData({ ...editTeamData, captainName: e.target.value })} className="input" required />
                  <input type="tel" placeholder="Captain Phone *" value={editTeamData.captainPhone} onChange={e => setEditTeamData({ ...editTeamData, captainPhone: e.target.value })} className="input" required />
                  <input type="text" placeholder="Village/City" value={editTeamData.city} onChange={e => setEditTeamData({ ...editTeamData, city: e.target.value })} className="input" />
                  <button type="submit" className="btn-primary w-full">Save Changes</button>
                </form>
              )}

              {/* Rejection reason */}
              {team.status === 'rejected' && team.rejectReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                  <p className="text-sm font-bold text-red-700 mb-1">❌ Team Reject Hui — Karan:</p>
                  <p className="text-sm text-red-600">{team.rejectReason}</p>
                  <p className="text-xs text-gray-500 mt-2">Upar Edit karke dobara submit karo।</p>
                </div>
              )}

              {/* Payment section */}
              {team.status === 'approved' && (
                <PaymentSection
                  team={team}
                  onScreenshotUploaded={(url) => setTeam({ ...team, paymentScreenshot: url })}
                />
              )}

              {/* Players list */}
              {players.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-bold text-sm">Players ({players.length}/15)</p>
                    {players.length < 11 && (
                      <p className="text-xs text-orange-500">{11 - players.length} aur chahiye submit ke liye</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {players.map((p, i) => (
                      <div key={p._id}>
                        {editingPlayer?._id === p._id ? (
                          <EditPlayerForm
                            player={p}
                            teamName={team.teamName}
                            onSave={(updated) => { setPlayers(players.map(pl => pl._id === p._id ? updated : pl)); setEditingPlayer(null) }}
                            onCancel={() => setEditingPlayer(null)}
                          />
                        ) : (
                          <PlayerRow p={p} onPreview={() => setPreviewIndex(i)} onEdit={setEditingPlayer} canEdit={canEdit} />
                        )}
                      </div>
                    ))}
                  </div>
                  {previewIndex !== null && players[previewIndex] && (
                    <PlayerModal
                      player={players[previewIndex]}
                      onClose={() => setPreviewIndex(null)}
                      onPrev={() => setPreviewIndex((previewIndex - 1 + players.length) % players.length)}
                      onNext={() => setPreviewIndex((previewIndex + 1) % players.length)}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">Abhi tak koi team register nahi ki।</p>
              {registrationOpen && <Link to="/register" className="btn-primary inline-block">Team Register Karo</Link>}
            </div>
          )}
        </div>

        {/* Add Players - sirf tab jab canEdit ho */}
        {team && canEdit && (
          <div className="card">
            <h3 className="font-bold mb-1">➕ Players Add Karo ({players.length}/15)</h3>
            <p className="text-sm text-gray-500 mb-4">
              Submit karne ke liye minimum 11 players chahiye।
              {players.length >= 11 && players.length < 15 && <span className="text-green-600 font-medium"> Submit kar sakte ho!</span>}
            </p>

            {error && <div className="bg-red-50 text-red-600 px-3 py-2 rounded-xl mb-3 text-sm">{error}</div>}

            {players.length < 15 && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-4">
                <input type="text" placeholder="Player Name *" value={playerForm.name} onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })} className="input" />
                <select value={playerForm.role} onChange={e => setPlayerForm({ ...playerForm, role: e.target.value })} className="input">
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="all-rounder">All-Rounder</option>
                  <option value="wicket-keeper">Wicket Keeper</option>
                </select>
                <input type="text" placeholder="Address/Village *" value={playerForm.address} onChange={e => setPlayerForm({ ...playerForm, address: e.target.value })} className="input" />
                <div>
                  <label className="text-sm font-medium block mb-1">Player Photo *</label>
                  <input key={fileKey} type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setPlayerForm({ ...playerForm, photo: f, preview: URL.createObjectURL(f) }) }} className="input" />
                  {playerForm.preview && <img src={playerForm.preview} className="mt-2 w-16 h-16 object-cover rounded-xl" />}
                </div>
                <button onClick={handleAddPlayer} disabled={uploading} className="btn-primary w-full">
                  {uploading ? `Uploading Player ${players.length + 1}...` : `+ Player ${players.length + 1} Add Karo`}
                </button>
              </div>
            )}

            {/* Submit button - sirf 11+ players hone ke baad */}
            {players.length >= 11 && (
              <button
                onClick={handleSubmitTeam}
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 text-lg"
              >
                {submitting ? 'Submitting...' : '🚀 Team Submit Karo (Review ke liye)'}
              </button>
            )}
          </div>
        )}

        {/* Submitted message */}
        {isSubmitted && team.status !== 'approved' && (
          <div className="card bg-blue-50 border border-blue-200 text-center">
            <p className="text-2xl mb-2">📋</p>
            <p className="font-bold text-blue-700">Team Review Mein Hai</p>
            <p className="text-sm text-gray-500 mt-1">Admin aapki team review kar raha hai। Notification milegi।</p>
          </div>
        )}

      </div>
    </div>
  )
}
