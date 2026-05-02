import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { currentUser } = useApp()
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/teams', label: 'Teams', icon: '👥' },
    { to: '/schedule', label: 'Schedule', icon: '📅' },
    { to: '/results', label: 'Results', icon: '🏆' },
    { to: '/contact', label: 'Contact', icon: '📞' },
  ]

  return (
    <nav className="sticky top-0 z-50" style={{ background: 'linear-gradient(135deg, #020c07 0%, #064e3b 60%, #065f46 100%)' }}>
      {/* Top accent line */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #F59E0B, #10B981, #F59E0B)' }} />

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
            <span className="text-lg">🏏</span>
          </div>
          <div>
            <p className="font-extrabold text-white text-base leading-tight tracking-wide">FZ Cricket</p>
            <p className="text-xs leading-tight font-medium" style={{ color: '#F59E0B' }}>Tournament 2026</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm ${
                location.pathname === l.to
                  ? 'text-gray-900 shadow-md font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={location.pathname === l.to ? { background: 'linear-gradient(135deg, #F59E0B, #D97706)' } : {}}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <Link to="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#111' }}>
              {currentUser.photo
                ? <img src={currentUser.photo} className="w-6 h-6 rounded-full ring-2 ring-white/50" alt="" />
                : <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">👤</span>
              }
              <span className="hidden sm:inline">{currentUser.name?.split(' ')[0] || 'User'}</span>
            </Link>
          ) : (
            <Link to="/login"
              className="text-sm border border-white/30 text-white/90 px-4 py-1.5 rounded-full hover:bg-white/10 hover:border-white/50 transition-all font-medium">
              Login
            </Link>
          )}
          <Link to="/admin"
            className="text-sm px-4 py-1.5 rounded-full font-semibold transition-all border border-white/20 text-white/80 hover:bg-white/10 hover:text-white">
            🔐 Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
