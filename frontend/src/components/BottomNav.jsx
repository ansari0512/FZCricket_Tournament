import { Link, useLocation } from 'react-router-dom'

const items = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/register', icon: '📝', label: 'Register' },
  { to: '/teams', icon: '👥', label: 'Teams' },
  { to: '/schedule', icon: '📅', label: 'Schedule' },
  { to: '/results', icon: '🏆', label: 'Results' },
  { to: '/contact', icon: '📞', label: 'Contact' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-1">
        {items.map(item => (
          <Link key={item.to} to={item.to}
            className={`flex flex-col items-center py-1 px-2 ${pathname === item.to ? 'text-primary' : 'text-gray-500'}`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
