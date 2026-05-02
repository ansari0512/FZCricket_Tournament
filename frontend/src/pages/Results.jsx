import { useApp } from '../context/AppContext'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { SOCKET_URL } from '../services/api'

export default function Results() {
  const { matches, teams, loading } = useApp()
  const [completed, setCompleted] = useState([])
  const sorted = [...teams].sort((a, b) => b.points - a.points)

  useEffect(() => {
    setCompleted(matches.filter(m => m.status === 'completed'))
  }, [matches])

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5
    })
    socket.on('matchStatusChange', (data) => {
      if (data.status === 'completed') {
        setCompleted(prev => [data, ...prev.filter(m => m._id !== data._id)])
      }
    })
    return () => socket.disconnect()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="py-8 px-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Leaderboard */}
        {sorted.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">🏆 Points Table</h2>
            <div className="card overflow-hidden p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="cricket-gradient text-white">
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Team</th>
                    <th className="py-3 px-4 text-center">M</th>
                    <th className="py-3 px-4 text-center">W</th>
                    <th className="py-3 px-4 text-center">L</th>
                    <th className="py-3 px-4 text-center font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((team, i) => (
                    <tr key={team._id} className={`border-t ${i === 0 ? 'bg-slate-50' : i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="py-3 px-4 font-bold text-gray-500">{i + 1}</td>
                      <td className="py-3 px-4 font-bold">{team.teamName}</td>
                      <td className="py-3 px-4 text-center">{team.matchesPlayed}</td>
                      <td className="py-3 px-4 text-center text-sky-600 font-medium">{team.wins}</td>
                      <td className="py-3 px-4 text-center text-slate-600 font-medium">{team.losses}</td>
                      <td className="py-3 px-4 text-center font-bold text-primary">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Completed Matches */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">📋 Match Results</h2>
          {completed.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">🏏</p>
              <p>No matches completed yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completed.map((match) => (
                <div key={match._id} className="card hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                      <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-medium">✅ Completed</span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">{match.matchType?.toUpperCase()}</span>
                    </div>
                    <span className="text-gray-400 text-xs">{new Date(match.matchDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className={`flex-1 text-center ${match.winner?._id === match.team1?._id ? 'text-sky-600' : ''}`}>
                      <p className="font-bold text-lg">{match.team1?.teamName || 'TBD'}</p>
                      {match.team1Score && <p className="text-2xl font-bold">{match.team1Score.runs}/{match.team1Score.wickets}</p>}
                      {match.winner?._id === match.team1?._id && <p className="text-xs text-sky-600 font-bold mt-1">🏆 Winner</p>}
                    </div>
                    <span className="text-2xl font-bold text-gray-200 px-4">VS</span>
                    <div className={`flex-1 text-center ${match.winner?._id === match.team2?._id ? 'text-sky-600' : ''}`}>
                      <p className="font-bold text-lg">{match.team2?.teamName || 'TBD'}</p>
                      {match.team2Score && <p className="text-2xl font-bold">{match.team2Score.runs}/{match.team2Score.wickets}</p>}
                      {match.winner?._id === match.team2?._id && <p className="text-xs text-sky-600 font-bold mt-1">🏆 Winner</p>}
                    </div>
                  </div>
                  {!match.winner && <p className="text-center text-gray-400 text-xs mt-2">Match Drawn</p>}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
