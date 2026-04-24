import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { getTeamPlayers } from '../services/api'

const COLORS = ['from-green-500', 'from-blue-500', 'from-purple-500', 'from-orange-500', 'from-pink-500', 'from-indigo-500', 'from-teal-500', 'from-red-500']
const ROLE_LABELS = { batsman: '🏏 Batsman', bowler: '🎯 Bowler', 'all-rounder': '⭐ All-Rounder', 'wicket-keeper': '🧤 Wicket Keeper' }

function PlayerModal({ player, onClose, onPrev, onNext }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="relative bg-gray-900">
          {player.photo ? (
            <img src={player.photo} className="w-full h-72 object-contain" alt={player.name} />
          ) : (
            <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-6xl font-bold text-gray-400">
              {player.name?.charAt(0)}
            </div>
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

function TeamCard({ team, index }) {
  const [showPlayers, setShowPlayers] = useState(false)
  const [players, setPlayers] = useState([])
  const [loadingPlayers, setLoadingPlayers] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(null)

  const togglePlayers = async () => {
    if (!showPlayers && !players.length) {
      setLoadingPlayers(true)
      try {
        const res = await getTeamPlayers(team._id)
        setPlayers(res.data)
      } catch {
        setPlayers([])
      } finally {
        setLoadingPlayers(false)
      }
    }
    setShowPlayers(!showPlayers)
  }

  return (
    <div className="card hover:shadow-lg transition">
      <div className={`bg-gradient-to-r ${COLORS[index % COLORS.length]} to-transparent h-1.5 -mx-5 -mt-5 mb-4 rounded-t-2xl`} />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600">
            {team.teamName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg">{team.teamName}</h3>
            <p className="text-gray-500 text-sm">Capt: {team.captainName}</p>
            <p className="text-gray-400 text-xs">📍 {team.city}</p>
          </div>
        </div>
        <span className="badge-approved">✅ Approved</span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
        {[['M', team.matchesPlayed], ['W', team.wins], ['L', team.losses], ['Pts', team.points]].map(([k, v]) => (
          <div key={k} className="bg-gray-50 rounded-lg py-2">
            <p className="font-bold text-primary">{v}</p>
            <p className="text-xs text-gray-500">{k}</p>
          </div>
        ))}
      </div>

      <button onClick={togglePlayers} className="w-full mt-4 bg-gray-50 hover:bg-gray-100 py-2 rounded-xl text-sm font-medium transition">
        {loadingPlayers ? 'Loading...' : showPlayers ? 'Hide Players ▲' : 'View Players ▼'}
      </button>

      {showPlayers && players.length > 0 && (
        <div className="mt-3 space-y-2">
          {players.map((p, i) => (
            <div key={p._id} onClick={() => setPreviewIndex(i)}
              className="flex items-center gap-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition">
              {p.photo ? (
                <img src={p.photo} className="w-16 h-20 object-cover rounded-lg flex-shrink-0" alt={p.name} />
              ) : (
                <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-400 flex-shrink-0">
                  {p.name?.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{p.name}</p>
                <p className="text-xs text-primary font-medium">{ROLE_LABELS[p.role] || p.role}</p>
                <p className="text-xs text-gray-400">Jersey #{p.jerseyNumber}</p>
                {p.address && <p className="text-xs text-gray-400 truncate">📍 {p.address}</p>}
              </div>
              <span className="text-gray-300 text-lg flex-shrink-0">›</span>
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

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="py-8 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Registered Teams ({teams.length}/8)</h2>
        {teams.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">👥</p>
            <p>No teams registered yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team, i) => <TeamCard key={team._id} team={team} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
