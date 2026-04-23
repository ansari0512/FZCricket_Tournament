import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getNotifications, markNotificationsRead, getTeam, getTeamPlayers, registerPlayer, updatePlayer, updateTeam, changePassword } from '../services/api'
import { uploadImage } from '../services/api'
import toast from 'react-hot-toast'

function ChangePasswordPanel({ userId }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await changePassword(userId, { oldPassword: form.oldPassword, newPassword: form.newPassword })
      toast.success('Password changed!')
      setOpen(false)
      setForm({ oldPassword: '', newPassword: '', confirm: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    setLoading(false)
  }
  return (
    <div className="border-t pt-3 mt-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-500">🔒 Change Password</p>
        <button onClick={() => setOpen(!open)} className="text-xs text-primary">{open ? 'Cancel' : 'Change'}</button>
      </div>
      {open && (
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} placeholder="Old Password *" value={form.oldPassword} onChange={e => setForm({ ...form, oldPassword: e.target.value })} className="input no-upper pr-12" required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">{showPass ? '🙈' : '👁️'}</button>
          </div>
          <input type={showPass ? 'text' : 'password'} placeholder="New Password *" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} className="input no-upper" required />
          <input type={showPass ? 'text' : 'password'} placeholder="Confirm New Password *" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="input no-upper" required />
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Saving...' : 'Change Password'}</button>
        </form>
      )}
    </div>
  )
}

function NotificationsPanel({ userId }) {
  const [notifs, setNotifs] = useState([])
  useEffect(() => {
    getNotifications(userId).then(r => setNotifs(r.data)).catch(() => {})
  }, [userId])
  const unread = notifs.filter(n => !n.read).length
  const markRead = async () => {
    await markNotificationsRead(userId)
    setNotifs(notifs.map(n => ({ ...n, read: true })))
  }
  return (
    <div className="card mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">🔔 Notifications {unread > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">{unread}</span>}</h3>
        {unread > 0 && <button onClick={markRead} className="text-sm text-primary">Mark all read</button>}
      </div>
      {notifs.length === 0 ? <p className="text-gray-400 text-sm text-center py-2">No notifications yet</p> : (
        <div className="space-y-2">
          {notifs.map((n, i) => (
            <div key={i} className={`p-3 rounded-xl border-l-4 text-sm ${n.type === 'success' ? 'bg-green-50 border-green-500' : n.type === 'error' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'} ${!n.read ? 'font-medium' : 'opacity-60'}`}>
              <p>{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PlayerRow({ p, onEdit, canEdit }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
      {p.photo ? <img src={p.photo} className="w-10 h-10 rounded-full object-cover flex-shrink-0" /> : <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold flex-shrink-0">{p.jerseyNumber}</div>}
      <span className="text-xs text-gray-400 font-bold w-5">#{p.jerseyNumber}</span>
      <span className="font-medium text-sm flex-1 truncate">{p.name}</span>
      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{p.role === 'all-rounder' ? 'AR' : p.role === 'wicket-keeper' ? 'WK' : p.role === 'batsman' ? 'Bat' : 'Bowl'}</span>
      <span className="text-xs text-gray-400 w-20 truncate hidden sm:block">{p.address}</span>
      {canEdit && <button onClick={() => onEdit(p)} className="text-primary text-xs font-medium">Edit</button>}
    </div>
  )
}

function EditPlayerForm({ player, onSave, onCancel }) {
  const [form, setForm] = useState({ name: player.name, role: player.role, address: player.address || '', newPhoto: null, preview: '' })
  const [loading, setLoading] = useState(false)
  const handleSave = async () => {
    setLoading(true)
    try {
      let photoUrl = null
      if (form.newPhoto) photoUrl = await uploadImage(form.newPhoto)
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
  const { currentUser, logout, registrationOpen } = useApp()
  const navigate = useNavigate()
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

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return }
    const load = async () => {
      if (currentUser.teamId) {
        const [teamRes, playersRes] = await Promise.all([getTeam(currentUser.teamId), getTeamPlayers(currentUser.teamId)])
        setTeam(teamRes.data.team)
        setEditTeamData({ teamName: teamRes.data.team.teamName, captainName: teamRes.data.team.captainName, captainPhone: teamRes.data.team.captainPhone, city: teamRes.data.team.city })
        setPlayers(playersRes.data)
      }
      setLoading(false)
    }
    load()
  }, [currentUser])

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
    if (!playerForm.name.trim()) return setError('Player name required')
    if (!playerForm.address.trim()) return setError('Player address required')
    if (!playerForm.photo) return setError('Player photo required')
    if (players.length >= 15) return setError('Maximum 15 players allowed')
    setUploading(true); setError('')
    try {
      const photoUrl = await uploadImage(playerForm.photo)
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
      toast.success('Player added!')
    } catch (err) { setError(err.response?.data?.message || 'Failed') }
    setUploading(false)
  }

  const handleSubmitTeam = async () => {
    if (players.length < 11) return setError('Minimum 11 players required')
    setSubmitting(true)
    try {
      await updateTeam(currentUser.teamId, { submitted: true })
      const res = await getTeam(currentUser.teamId)
      setTeam(res.data.team)
      toast.success('Team submitted for review!')
    } catch { toast.error('Submission failed') }
    setSubmitting(false)
  }

  const canEdit = team && (team.status === 'pending' || team.status === 'rejected')

  if (!currentUser) return null
  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="py-8 px-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Profile */}
        <div className="card">
          <div className="flex justify-between items-center mb-1">
            <div>
              <h2 className="text-xl font-bold">👋 {currentUser.username}</h2>
              <p className="text-gray-500 text-sm">{currentUser.mobile}</p>
            </div>
            <button onClick={logout} className="text-red-500 font-medium text-sm">Logout</button>
          </div>
          <ChangePasswordPanel userId={currentUser._id} />
        </div>

        <NotificationsPanel userId={currentUser._id} />

        {/* My Team */}
        <div className="card">
          <h3 className="font-bold text-lg mb-4">🏏 My Team</h3>
          {team ? (
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-xl">{team.teamName}</p>
                  <p className="text-gray-500 text-sm">Captain: {team.captainName} • {team.captainPhone}</p>
                  <p className="text-gray-400 text-xs">{team.city}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={team.status === 'approved' ? 'badge-approved' : team.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>
                    {team.status === 'approved' ? '✅ Approved' : team.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                  </span>
                  {canEdit && (
                    <button onClick={() => setEditTeam(!editTeam)} className="text-xs text-primary font-medium">
                      {editTeam ? 'Cancel Edit' : '✏️ Edit Team'}
                    </button>
                  )}
                </div>
              </div>

              {canEdit && editTeam && (
                <form onSubmit={handleUpdateTeam} className="space-y-3 mb-4 bg-gray-50 p-4 rounded-xl">
                  <input type="text" placeholder="Team Name *" value={editTeamData.teamName} onChange={e => setEditTeamData({ ...editTeamData, teamName: e.target.value })} className="input" required />
                  <input type="text" placeholder="Captain Name *" value={editTeamData.captainName} onChange={e => setEditTeamData({ ...editTeamData, captainName: e.target.value })} className="input" required />
                  <input type="tel" placeholder="Captain Phone *" value={editTeamData.captainPhone} onChange={e => setEditTeamData({ ...editTeamData, captainPhone: e.target.value })} className="input" required />
                  <input type="text" placeholder="Village" value={editTeamData.city} onChange={e => setEditTeamData({ ...editTeamData, city: e.target.value })} className="input" />
                  <button type="submit" className="btn-primary w-full">Save Changes</button>
                </form>
              )}

              {team.status === 'rejected' && team.rejectReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                  <p className="text-sm text-red-700"><span className="font-bold">Reason:</span> {team.rejectReason}</p>
                </div>
              )}
              {team.status === 'approved' && !team.paymentDone && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-3">
                  <p className="text-sm text-yellow-700 font-bold">💰 Please pay ₹1,100 to confirm your spot!</p>
                  <p className="text-xs text-gray-500 mt-1">Contact admin after payment.</p>
                </div>
              )}

              {players.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="font-bold text-sm mb-3">Players ({players.length}/15)</p>
                  <div className="space-y-2">
                    {players.map(p => (
                      <div key={p._id}>
                        {editingPlayer?._id === p._id ? (
                          <EditPlayerForm
                            player={p}
                            onSave={(updated) => { setPlayers(players.map(pl => pl._id === p._id ? updated : pl)); setEditingPlayer(null) }}
                            onCancel={() => setEditingPlayer(null)}
                          />
                        ) : (
                          <PlayerRow p={p} onEdit={setEditingPlayer} canEdit={canEdit} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">You haven't registered a team yet.</p>
              {registrationOpen && <Link to="/register" className="btn-primary inline-block">Register Team</Link>}
            </div>
          )}
        </div>

        {/* Add Players */}
        {canEdit && (
          <div className="card">
            <h3 className="font-bold mb-2">➕ Add Players ({players.length}/15)</h3>
            <p className="text-sm text-gray-500 mb-4">Minimum 11 players required to submit.</p>
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
                <input type="text" placeholder="Address *" value={playerForm.address} onChange={e => setPlayerForm({ ...playerForm, address: e.target.value })} className="input" />
                <div>
                  <label className="text-sm font-medium block mb-1">Player Photo *</label>
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) setPlayerForm({ ...playerForm, photo: f, preview: URL.createObjectURL(f) }) }} className="input" />
                  {playerForm.preview && <img src={playerForm.preview} className="mt-2 w-16 h-16 object-cover rounded-xl" />}
                </div>
                <button onClick={handleAddPlayer} disabled={uploading} className="btn-primary w-full">
                  {uploading ? 'Uploading...' : '+ Add Player'}
                </button>
              </div>
            )}
            {players.length >= 11 && (
              <button onClick={handleSubmitTeam} disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl disabled:opacity-50">
                {submitting ? 'Submitting...' : '🚀 Submit Team for Review'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
