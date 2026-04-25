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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 shadow-2xl"
      style={{background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)'}}>
      <div className="flex justify-around py-2 px-2">
        {items.map(item => (
          <Link key={item.to} to={item.to}
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              pathname === item.to
                ? 'bg-yellow-400 text-gray-900 shadow-md scale-105'
                : 'text-white/70 hover:text-white'
            }`}>
            <span className="text-xl">{item.icon}</span>
            <span className={`text-[10px] mt-0.5 font-medium ${pathname === item.to ? 'text-gray-900 font-bold' : ''}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
