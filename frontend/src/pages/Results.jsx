import { useApp } from '../context/AppContext'

export default function Results() {
  const { matches, teams, loading } = useApp()
  const completed = matches.filter(m => m.status === 'completed')
  const sorted = [...teams].sort((a, b) => b.points - a.points)

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="py-8 px-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Leaderboard */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">🏆 Leaderboard</h2>
          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {['#', 'Team', 'M', 'W', 'L', 'Pts'].map(h => (
                    <th key={h} className="p-3 text-left text-sm">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-400">No data yet</td></tr>
                ) : sorted.map((team, i) => (
                  <tr key={team._id} className={`border-b border-gray-100 ${i === 0 ? 'bg-yellow-50' : ''}`}>
                    <td className="p-3 font-bold text-sm">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                    <td className="p-3 font-medium text-sm">{team.teamName}</td>
                    <td className="p-3 text-center text-sm">{team.matchesPlayed}</td>
                    <td className="p-3 text-center text-sm text-green-600 font-bold">{team.wins}</td>
                    <td className="p-3 text-center text-sm text-red-500">{team.losses}</td>
                    <td className="p-3 text-center text-sm font-bold text-primary">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Match Results */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">📋 Match Results</h2>
          {completed.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">🏏</p>
              <p>No matches completed yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completed.map(match => (
                <div key={match._id} className="card">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400 text-xs">{new Date(match.matchDate).toLocaleDateString('en-IN')}</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Completed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-bold">{match.team1?.teamName}</p>
                      <p className="text-2xl font-bold text-primary">{match.team1Score?.runs || 0}/{match.team1Score?.wickets || 0}</p>
                    </div>
                    <span className="text-xl font-bold text-gray-200">VS</span>
                    <div className="flex-1 text-right">
                      <p className="font-bold">{match.team2?.teamName}</p>
                      <p className="text-2xl font-bold text-primary">{match.team2Score?.runs || 0}/{match.team2Score?.wickets || 0}</p>
                    </div>
                  </div>
                  {match.winner && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                      <p className="font-bold text-yellow-600">🏆 Winner: {match.winner?.teamName}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
