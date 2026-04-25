import { Link } from 'react-router-dom'

export default function Contact() {
  const info = [
    { icon: '👤', label: 'Contact Person', value: 'Shahid Ansari', type: 'text' },
    { icon: '📞', label: 'Mobile 1', value: '+91 8127021765', type: 'phone', href: 'tel:+918127021765' },
    { icon: '📞', label: 'Mobile 2', value: '+91 9369429653', type: 'phone', href: 'tel:+919369429653' },
    { icon: '📧', label: 'Email', value: 'shahidansari0512@gmail.com', type: 'email', href: 'mailto:shahidansari0512@gmail.com' },
    { icon: '📍', label: 'Venue', value: 'Village Odajhar, Post Naseerpur, Biswan, Sitapur - 261202', type: 'text' },
  ]

  return (
    <div className="py-8 px-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Contact & Support</h2>
        <div className="card space-y-4">
          {info.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-500">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="font-medium text-primary hover:underline">
                    {item.value}
                  </a>
                ) : (
                  <p className="font-medium">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/admin" className="text-xs text-gray-400 hover:text-gray-600">🔐 Admin Panel</Link>
        </div>
      </div>
    </div>
  )
}
