import { useApp } from '../context/AppContext'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

export default function Results() {
  const { matches, teams, loading } = useApp()
  const [completed, setCompleted] = useState([])
  const sorted = [...teams].sort((a, b) => b.points - a.points)
  
  useEffect(() => {
    setCompleted(matches.filter(m => m.status === 'completed'))
  }, [matches])
  
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'https://fzcricket-backend.onrender.com', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5
    })
    
    socket.on('connect', () => {
      console.log('Results: Socket connected')
    })
    
    socket.on('matchStatusChange', (data) => {
      if (data.status === 'completed') {
        setCompleted(prev => [data, ...prev.filter(m => m._id !== data._id)])
      }
    })
    
    return () => {
      socket.disconnect()
    }
  }, [])
  
  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>