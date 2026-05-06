import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { getTeams, getMatches, googleLogin, getMe } from '../services/api'
import { useCallback } from 'react'
import { io } from 'socket.io-client'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [teams, setTeams] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [teamsRes, matchesRes] = await Promise.all([getTeams(), getMatches()])
      setTeams(teamsRes.data)
      setMatches(matchesRes.data)
    } catch {
      setTeams([]); setMatches([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    // localStorage se instant load
    const savedUser = localStorage.getItem('fzUser')
    const savedToken = localStorage.getItem('fzToken')
    if (savedUser && savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]))
        const isExpired = payload.exp * 1000 < Date.now()
        if (!isExpired && payload.userId) {
          setCurrentUser(JSON.parse(savedUser))
          setAuthLoading(false)
        }
      } catch {
        localStorage.removeItem('fzToken')
        localStorage.removeItem('fzUser')
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // firebaseUid, email, name, photo bhejo — backend verify karega
          const res = await googleLogin({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photo: firebaseUser.photoURL
          })
          localStorage.setItem('fzToken', res.data.token)
          localStorage.setItem('fzUser', JSON.stringify(res.data.user))
          setCurrentUser(res.data.user)
        } catch (err) {
          console.error('Auth error:', err)
          const saved = localStorage.getItem('fzUser')
          if (saved) setCurrentUser(JSON.parse(saved))
        }
      } else {
        localStorage.removeItem('fzToken')
        localStorage.removeItem('fzUser')
        setCurrentUser(null)
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Socket
  useEffect(() => {
    const socketUrl = (import.meta.env.VITE_API_URL || 'https://fzcricket-backend.onrender.com/api').replace('/api', '')
    const socket = io(socketUrl)
    socket.on('connect', () => console.log('WebSocket connected'))
    socket.on('dataUpdate', () => { fetchData() })
    socket.on('disconnect', () => console.log('WebSocket disconnected'))
    return () => socket.disconnect()
  }, [fetchData])

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem('fzToken')
    localStorage.removeItem('fzUser')
    setCurrentUser(null)
  }

  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe()
      localStorage.setItem('fzUser', JSON.stringify(res.data))
      setCurrentUser(res.data)
      return res.data
    } catch (err) {
      console.error('refreshUser error:', err)
    }
  }, [])

  const registrationOpen = teams.length < 8

  return (
    <AppContext.Provider value={{ teams, matches, loading, authLoading, currentUser, logout, fetchData, registrationOpen, refreshUser }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
