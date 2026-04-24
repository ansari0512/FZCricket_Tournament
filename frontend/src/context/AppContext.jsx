import { createContext, useContext, useState, useEffect } from 'react'
import { getTeams, getMatches } from '../services/api'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [teams, setTeams] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('fzUser') || 'null'))

  const fetchData = async () => {
    try {
      const [teamsRes, matchesRes] = await Promise.all([getTeams(), getMatches()])
      setTeams(teamsRes.data)
      setMatches(matchesRes.data)
    } catch {
      setTeams([]); setMatches([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const login = (user, token) => {
    localStorage.setItem('fzUser', JSON.stringify(user))
    localStorage.setItem('fzToken', token)
    setCurrentUser(user)
  }

  const logout = () => {
    localStorage.removeItem('fzUser')
    localStorage.removeItem('fzToken')
    setCurrentUser(null)
  }

  const registrationOpen = teams.length < 8

  return (
    <AppContext.Provider value={{ teams, matches, loading, currentUser, login, logout, fetchData, registrationOpen }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
