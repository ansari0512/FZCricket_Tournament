import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { currentUser } = useApp()
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/teams', label: 'Teams' },
    { to: '/schedule', label: 'Schedule' },
    { to: '/results', label: 'Results' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="cricket-gradient text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🏏</span> FZ Cricket
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-2 rounded-lg font-medium transition text-sm ${location.pathname === l.to ? 'bg-white/20' : 'hover:bg-white/10'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <Link to="/dashboard" className="text-sm bg-yellow-400 text-gray-900 font-bold px-3 py-1.5 rounded-full">
              👤 {currentUser.username}
            </Link>
          ) : (
            <Link to="/login" className="text-sm bg-white/20 px-3 py-1.5 rounded-lg">Login</Link>
          )}
          <Link to="/admin" className="text-sm bg-white/20 px-3 py-1.5 rounded-lg">Admin</Link>
        </div>
      </div>
    </nav>
  )
}
