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
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5
    })
    
    socket.on('connect', () => {
      console.log('Schedule: Socket connected')
    })
    
    socket.on('scoreUpdate', (data) => {
      setLiveMatches(prev => prev.map(m => 
        m._id === data.matchId ? { ...m, team1Score: data.team1Score, team2Score: data.team2Score } : m
      ))
    })
    
    socket.on('matchStatusChange', (data) => {
      setLiveMatches(prev => {
        const updated = prev.map(m => m._id === data.matchId ? { ...m, ...data } : m)
        setScheduledMatches(scheduled => scheduled.filter(m => m._id !== data.matchId))
        return updated
      })
    })
    
    return () => {
      socket.disconnect()
    }
  }, [])
  
  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="py-8 px-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse inline-block"></span>
              Live Matches
            </h2>
            <div className="space-y-4">
              {liveMatches.map(match => (
                <div key={match._id} className="card border-2 border-red-400 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">🔴 LIVE</span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">{match.overs} Overs</span>
                    </div>
                    <span className="text-gray-400 text-xs">{match.venue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex-1 text-center">
                      <p className="font-bold text-lg">{match.team1?.teamName || 'TBD'}</p>
                      <p className="text-2xl font-bold text-primary">{match.team1Score?.runs || 0}/{match.team1Score?.wickets || 0}</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-200 px-4">VS</span>
                    <div className="flex-1 text-center">
                      <p className="font-bold text-lg">{match.team2?.teamName || 'TBD'}</p>
                      <p className="text-2xl font-bold text-primary">{match.team2Score?.runs || 0}/{match.team2Score?.wickets || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Matches */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">📅 Tournament Schedule</h2>
          {scheduledMatches.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">📅</p>
              <p>Abhi koi match schedule nahi hai</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledMatches.map((match) => (
                <div key={match._id} className="card hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                      <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">{match.matchType?.toUpperCase()}</span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">{match.overs} Overs</span>
                    </div>
                    <span className="text-gray-400 text-xs">{match.venue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg flex-1 text-center">{match.team1?.teamName || 'TBD'}</p>
                    <span className="text-2xl font-bold text-gray-200 px-4">VS</span>
                    <p className="font-bold text-lg flex-1 text-center">{match.team2?.teamName || 'TBD'}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-primary text-sm">{new Date(match.matchDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                      <p className="text-gray-400 text-xs">{new Date(match.matchDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">🕐 Scheduled</span>
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
