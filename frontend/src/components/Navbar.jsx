import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { currentUser } = useApp()
  const location = useLocation()

  const links = [
    { to: '/', label: '🏠 Home' },
    { to: '/teams', label: '👥 Teams' },
    { to: '/schedule', label: '📅 Schedule' },
    { to: '/results', label: '🏆 Results' },
    { to: '/contact', label: '📞 Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 shadow-lg" style={{background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)'}}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-lg shadow-md">🏏</div>
          <div>
            <p className="font-extrabold text-white text-base leading-tight">FZ Cricket</p>
            <p className="text-yellow-300 text-[10px] leading-tight">Tournament 2026</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-xl font-medium transition text-sm ${
                location.pathname === l.to
                  ? 'bg-yellow-400 text-gray-900 shadow-md font-bold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <Link to="/dashboard" className="flex items-center gap-1.5 bg-yellow-400 text-gray-900 font-bold px-3 py-1.5 rounded-full text-sm shadow-md hover:bg-yellow-300 transition">
              👤 {currentUser.username}
            </Link>
          ) : (
            <Link to="/login" className="text-sm border border-white/40 text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition">
              User Login
            </Link>
          )}
          <Link to="/admin" className="text-sm bg-white/20 border border-white/30 text-white px-3 py-1.5 rounded-full hover:bg-white/30 transition">
            🔐 Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
