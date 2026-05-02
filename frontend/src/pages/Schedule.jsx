import { useApp } from '../context/AppContext'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { SOCKET_URL } from '../services/api'

export default function Schedule() {
  const { matches, loading } = useApp()
  const [liveMatches, setLiveMatches] = useState([])
  const [scheduledMatches, setScheduledMatches] = useState([])

  useEffect(() => {
    setLiveMatches(matches.filter(m => m.status === 'in-progress'))
    setScheduledMatches(matches.filter(m => m.status === 'scheduled'))
  }, [matches])

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'], reconnection: true, reconnectionAttempts: 5 })
    socket.on('scoreUpdate', (data) => {
      setLiveMatches(prev => prev.map(m => m._id === data.matchId ? { ...m, team1Score: data.team1Score, team2Score: data.team2Score } : m))
    })
    socket.on('matchStatusChange', (data) => {
      setLiveMatches(prev => prev.map(m => m._id === data.matchId ? { ...m, ...data } : m))
      setScheduledMatches(prev => prev.filter(m => m._id !== data.matchId))
    })
    return () => socket.disconnect()
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const matchTypeLabel = { group: 'Group Stage', 'semi-final': 'Semi Final', final: 'Final' }
  const matchTypeBg = { group: 'bg-blue-100 text-blue-700', 'semi-final': 'bg-purple-100 text-purple-700', final: 'bg-amber-100 text-amber-700' }

  return (
    <div className="py-8 px-4 pb-20 page-enter">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <div>
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <h2 className="text-2xl font-black text-red-600 tracking-wide uppercase">Live Matches</h2>
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-4">
              {liveMatches.map(match => (
                <div key={match._id} className="rounded-2xl overflow-hidden shadow-lg border-2 border-red-400"
                  style={{ background: 'linear-gradient(135deg, #1a0000, #3b0000)' }}>
                  <div className="flex items-center justify-between px-4 py-2 bg-red-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-black tracking-widest uppercase">Live</span>
                    </div>
                    <span className="text-white/80 text-xs">{match.venue} • {match.overs} Overs</span>
                  </div>
                  <div className="flex justify-between items-center p-5">
                    <div className="flex-1 text-center">
                      <p className="text-white font-bold text-base">{match.team1?.teamName || 'TBD'}</p>
                      <p className="text-4xl font-black text-white mt-1">
                        {match.team1Score?.runs ?? 0}
                        <span className="text-xl text-white/50">/{match.team1Score?.wickets ?? 0}</span>
                      </p>
                    </div>
                    <div className="px-4">
                      <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                        <p className="text-white/60 text-xs font-black">VS</p>
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-white font-bold text-base">{match.team2?.teamName || 'TBD'}</p>
                      <p className="text-4xl font-black text-white mt-1">
                        {match.team2Score?.runs ?? 0}
                        <span className="text-xl text-white/50">/{match.team2Score?.wickets ?? 0}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule */}
        <div>
          <p className="section-title">📅 Tournament Schedule</p>
          <p className="section-subtitle">Upcoming matches — mark your calendar</p>

          {scheduledMatches.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">📅</p>
              <p className="text-gray-400 font-semibold">No matches scheduled yet</p>
              <p className="text-gray-300 text-sm mt-1">Admin will add the schedule soon</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledMatches.map((match, i) => (
                <div key={match._id} className="card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${matchTypeBg[match.matchType] || 'bg-gray-100 text-gray-600'}`}>
                        {matchTypeLabel[match.matchType] || match.matchType?.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {match.overs} Overs
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Match #{i + 1}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-black mx-auto mb-2 shadow-md">
                        {match.team1?.teamName?.charAt(0) || '?'}
                      </div>
                      <p className="font-bold text-sm">{match.team1?.teamName || 'TBD'}</p>
                    </div>
                    <div className="px-4 text-center">
                      <div className="bg-gray-100 rounded-xl px-3 py-2">
                        <p className="text-gray-400 text-xs font-black">VS</p>
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black mx-auto mb-2 shadow-md">
                        {match.team2?.teamName?.charAt(0) || '?'}
                      </div>
                      <p className="font-bold text-sm">{match.team2?.teamName || 'TBD'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm">📅</span>
                      </div>
                      <div>
                        <p className="font-bold text-primary text-sm">
                          {new Date(match.matchDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(match.matchDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {match.venue}
                        </p>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-3 py-1.5 rounded-full">
                      🕐 Scheduled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
