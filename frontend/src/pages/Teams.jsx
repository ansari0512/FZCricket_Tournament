import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { getTeamPlayers } from '../services/api'

const COLORS = ['from-green-500', 'from-blue-500', 'from-purple-500', 'from-orange-500', 'from-pink-500', 'from-indigo-500', 'from-teal-500', 'from-red-500']

function TeamCard({ team, index }) {
  const [showPlayers, setShowPlayers] = useState(false)
  const [players, setPlayers] = useState([])

  const togglePlayers = async () => {
    if (!showPlayers && !players.length) {
      const res = await getTeamPlayers(team._id)
      setPlayers(res.data)
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
            <p className="text-gray-400 text-xs">{team.city}</p>
          </div>
        </div>
        <span className="badge-approved">Approved</span>
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
        {showPlayers ? 'Hide Players ▲' : `View Players (${players.length || '...'}) ▼`}
      </button>

      {showPlayers && players.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {players.map(p => (
            <div key={p._id} className="text-center p-2 bg-gray-50 rounded-xl">
              {p.photo && <img src={p.photo} className="w-10 h-10 rounded-full object-cover mx-auto mb-1" />}
              <p className="text-xs font-medium truncate">{p.name}</p>
              <p className="text-xs text-gray-400">#{p.jerseyNumber}</p>
            </div>
          ))}
        </div>
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
