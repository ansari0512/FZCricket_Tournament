import { Link, useLocation } from 'react-router-dom'

const items = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/teams', icon: '👥', label: 'Teams' },
  { to: '/schedule', icon: '📅', label: 'Schedule' },
  { to: '/results', icon: '🏆', label: 'Results' },
  { to: '/contact', icon: '📞', label: 'Contact' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #111827 100%)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Top accent */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)' }} />
      <div className="flex justify-around py-2 px-1">
        {items.map(item => {
          const active = pathname === item.to
          return (
            <Link key={item.to} to={item.to}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
                active ? 'scale-105' : 'opacity-60 hover:opacity-90'
              }`}
              style={active ? { background: 'linear-gradient(135deg, #2563eb, #4f46e5)' } : {}}>
              <span className="text-lg leading-none">{item.icon}</span>
              <span className={`text-[10px] mt-0.5 font-semibold leading-none ${active ? 'text-gray-900' : 'text-white'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  )
}
