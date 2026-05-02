import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { getTeams, getAllTeams, getMatches, googleLogin, getMe } from '../services/api'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [teams, setTeams] = useState([])
  const [allTeamsCount, setAllTeamsCount] = useState(0)
  const [approvedPaidTeamsCount, setApprovedPaidTeamsCount] = useState(0)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [teamsRes, matchesRes, allTeamsRes] = await Promise.all([getTeams(), getMatches(), getAllTeams()])
      setTeams(teamsRes.data)
      setAllTeamsCount(teamsRes.data.length)
      setApprovedPaidTeamsCount(allTeamsRes.data.length)
      setMatches(matchesRes.data)
    } catch {
      setTeams([]); setMatches([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Pehle localStorage se user load karo (instant)
    const savedUser = localStorage.getItem('fzUser')
    const savedToken = localStorage.getItem('fzToken')
    if (savedUser && savedToken) {
      try {
        // Token valid hai ya nahi check karo
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
          const res = await googleLogin({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photo: firebaseUser.photoURL
          })
          // JWT token save karo
          localStorage.setItem('fzToken', res.data.token)
          // Fresh user data backend se lo
          const meRes = await fetch(`${import.meta.env.VITE_API_URL || 'https://fzcricket-backend.onrender.com/api'}/auth/me`, {
            headers: { Authorization: `Bearer ${res.data.token}` }
          })
          if (meRes.ok) {
            const userData = await meRes.json()
            localStorage.setItem('fzUser', JSON.stringify(userData))
            setCurrentUser(userData)
          } else {
            localStorage.setItem('fzUser', JSON.stringify(res.data.user))
            setCurrentUser(res.data.user)
          }
        } catch (err) {
          console.error('Auth error:', err)
          // localStorage se fallback
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
  }, [])

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem('fzToken')
    localStorage.removeItem('fzUser')
    setCurrentUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await getMe()
      localStorage.setItem('fzUser', JSON.stringify(res.data))
      setCurrentUser(res.data)
      return res.data
    } catch (err) {
      console.error('refreshUser error:', err)
    }
  }

  const registrationOpen = approvedPaidTeamsCount < 8

  return (
    <AppContext.Provider value={{ teams, matches, loading, authLoading, currentUser, logout, fetchData, registrationOpen, refreshUser }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
