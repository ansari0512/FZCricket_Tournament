import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { getTeamPlayers } from '../services/api'

const COLORS = [
  { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-600', light: 'bg-emerald-50' },
  { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-600', light: 'bg-blue-50' },
  { bg: 'from-purple-500 to-violet-600', text: 'text-purple-600', light: 'bg-purple-50' },
  { bg: 'from-orange-500 to-red-500', text: 'text-orange-600', light: 'bg-orange-50' },
  { bg: 'from-pink-500 to-rose-600', text: 'text-pink-600', light: 'bg-pink-50' },
  { bg: 'from-cyan-500 to-blue-500', text: 'text-cyan-600', light: 'bg-cyan-50' },
  { bg: 'from-amber-500 to-yellow-500', text: 'text-amber-600', light: 'bg-amber-50' },
  { bg: 'from-red-500 to-pink-600', text: 'text-red-600', light: 'bg-red-50' },
]
const ROLE_LABELS = { batsman: '🏏 Batsman', bowler: '🎯 Bowler', 'all-rounder': '⭐ All-Rounder', 'wicket-keeper': '🧤 Keeper' }

function PlayerModal({ player, onClose, onPrev, onNext }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="relative bg-gray-900">
          {player.photo
            ? <img src={player.photo} className="w-full h-72 object-contain" alt={player.name} />
            : <div className="w-full h-72 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-7xl font-black text-white/20">{player.name?.charAt(0)}</div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all">✕</button>
          <button onClick={e => { e.stopPropagation(); onPrev() }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl transition-all">‹</button>
          <button onClick={e => { e.stopPropagation(); onNext() }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl transition-all">›</button>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white font-bold text-xl">{player.name}</p>
            <p className="text-white/60 text-sm">Jersey #{player.jerseyNumber}</p>
          </div>
        </div>
        <div className="p-5 space-y-2.5">
          {[
            { icon: '🎽', label: 'Role', val: ROLE_LABELS[player.role] || player.role },
            { icon: '🔢', label: 'Jersey', val: `#${player.jerseyNumber}` },
            player.address && { icon: '📍', label: 'Address', val: player.address },
          ].filter(Boolean).map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="font-bold text-sm">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TeamCard({ team, index }) {
  const [showPlayers, setShowPlayers] = useState(false)
  const [players, setPlayers] = useState([])
  const [loadingPlayers, setLoadingPlayers] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(null)
  const c = COLORS[index % COLORS.length]

  const togglePlayers = async () => {
    if (!showPlayers && !players.length) {
      setLoadingPlayers(true)
      try { const res = await getTeamPlayers(team._id); setPlayers(res.data) }
      catch { setPlayers([]) }
      finally { setLoadingPlayers(false) }
    }
    setShowPlayers(!showPlayers)
  }

  return (
    <div className="card-hover overflow-hidden">
      {/* Color bar */}
      <div className={`h-1.5 -mx-5 -mt-5 mb-4 bg-gradient-to-r ${c.bg}`} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.bg} flex items-center justify-center text-white text-2xl font-black shadow-md`}>
            {team.teamName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-base">{team.teamName}</h3>
            <p className="text-gray-500 text-xs">👤 {team.captainName}</p>
            <p className="text-gray-400 text-xs">📍 {team.city}</p>
          </div>
        </div>
        <span className="badge-approved">✅ Confirmed</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[['M', team.matchesPlayed, 'text-gray-700'], ['W', team.wins, 'text-emerald-600'], ['L', team.losses, 'text-red-500'], ['Pts', team.points, 'text-primary']].map(([k, v, cls]) => (
          <div key={k} className="bg-gray-50 rounded-xl py-2 text-center">
            <p className={`font-black text-base ${cls}`}>{v}</p>
            <p className="text-[10px] text-gray-400 font-medium">{k}</p>
          </div>
        ))}
      </div>

      <button onClick={togglePlayers}
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all border border-gray-200 hover:border-primary hover:text-primary hover:bg-primary/5">
        {loadingPlayers ? '⏳ Loading...' : showPlayers ? '▲ Hide Players' : `▼ View Players (${team.playerCount || '?'})`}
      </button>

      {showPlayers && players.length > 0 && (
        <div className="mt-3 space-y-2">
          {players.map((p, i) => (
            <div key={p._id} onClick={() => setPreviewIndex(i)}
              className="flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-all group">
              {p.photo
                ? <img src={p.photo} className="w-14 h-18 object-cover rounded-lg flex-shrink-0 shadow-sm" style={{ height: '72px' }} alt={p.name} />
                : <div className={`w-14 rounded-lg flex items-center justify-center text-lg font-black text-white flex-shrink-0 bg-gradient-to-br ${c.bg}`} style={{ height: '72px' }}>{p.name?.charAt(0)}</div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{p.name}</p>
                <p className="text-xs text-primary font-medium">{ROLE_LABELS[p.role] || p.role}</p>
                <p className="text-xs text-gray-400">#{p.jerseyNumber}</p>
              </div>
              <span className="text-gray-300 group-hover:text-primary text-lg transition-colors">›</span>
            </div>
          ))}
        </div>
      )}

      {previewIndex !== null && players[previewIndex] && (
        <PlayerModal
          player={players[previewIndex]}
          onClose={() => setPreviewIndex(null)}
          onPrev={() => setPreviewIndex((previewIndex - 1 + players.length) % players.length)}
          onNext={() => setPreviewIndex((previewIndex + 1) % players.length)}
        />
      )}
    </div>
  )
}

export default function Teams() {
  const { teams, loading } = useApp()
  const [search, setSearch] = useState('')

  const filtered = teams.filter(t =>
    t.teamName.toLowerCase().includes(search.toLowerCase()) ||
    t.captainName.toLowerCase().includes(search.toLowerCase()) ||
    t.city.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="py-8 px-4 pb-20 page-enter">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="section-title">👥 Registered Teams</p>
          <p className="section-subtitle">{teams.length} of 8 teams confirmed for the tournament</p>
        </div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{teams.length} Teams Registered</span>
            <span>{8 - teams.length} Spots Left</span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(teams.length / 8) * 100}%`, background: 'linear-gradient(90deg, #059669, #F59E0B)' }} />
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input type="text" placeholder="Search team, captain or city..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input pl-11 pr-4" />
            <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-6xl mb-4">👥</p>
            <p className="font-semibold">{search ? 'No teams found' : 'No teams registered yet'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((team, i) => <TeamCard key={team._id} team={team} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
