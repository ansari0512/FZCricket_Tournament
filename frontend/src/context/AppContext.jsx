import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { getTeams, getMatches, googleLogin, getMe } from '../services/api'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [teams, setTeams] = useState([])
  const [allTeamsCount, setAllTeamsCount] = useState(0)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [teamsRes, matchesRes] = await Promise.all([getTeams(), getMatches()])
      setTeams(teamsRes.data)
      setAllTeamsCount(teamsRes.data.length)
      setMatches(matchesRes.data)
    } catch {
      setTeams([]); setMatches([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await googleLogin({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photo: firebaseUser.photoURL
          })
          const res = await getMe()
          setCurrentUser(res.data)
        } catch (err) {
          console.error('Auth error:', err)
          // Backend fail hone pe bhi basic user info set karo
          setCurrentUser({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photo: firebaseUser.photoURL,
            teamId: null
          })
        }
      } else {
        setCurrentUser(null)
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await signOut(auth)
    setCurrentUser(null)
  }

  const refreshUser = async () => {
    try {
      const firebaseUser = auth.currentUser
      if (!firebaseUser) return
      // Pehle backend mein save karo
      await googleLogin({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photo: firebaseUser.photoURL
      })
      const res = await getMe()
      setCurrentUser(res.data)
      return res.data
    } catch (err) {
      console.error('refreshUser error:', err)
    }
  }

  const registrationOpen = allTeamsCount < 8

  return (
    <AppContext.Provider value={{ teams, matches, loading, authLoading, currentUser, logout, fetchData, registrationOpen, refreshUser }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
