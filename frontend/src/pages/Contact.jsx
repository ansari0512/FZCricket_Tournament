import { Link } from 'react-router-dom'

export default function Contact() {
  const contacts = [
    { icon: '📞', name: 'Saddam Husain', value: '+91 8127021765', href: 'tel:+918127021765', type: 'phone' },
    { icon: '📞', name: 'Mohd Sufiyan', value: '+91 9369429653', href: 'tel:+919369429653', type: 'phone' },
    { icon: '💬', name: 'WhatsApp Group', value: 'Join Now', href: 'https://chat.whatsapp.com/CR4Wx8QgHbJFaTnDkuTkxu', type: 'whatsapp' },
  ]

  const details = [
    { label: 'Contact Person', value: 'Shahid Ansari', icon: '👤' },
    { label: 'Venue', value: 'Village Odajhar, Post Naseerpur, Biswan, Sitapur - 261202', icon: '📍' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20 page-enter">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">Get In Touch</h1>
          <p className="text-blue-100 text-lg">Have questions? Contact us anytime</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Contact Card - All in One */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">📞 Quick Contact</h2>
          </div>
          <div className="p-6 space-y-4">
            {contacts.map((item, i) => (
              <a key={i} href={item.href} target={item.type === 'whatsapp' ? '_blank' : '_self'} rel={item.type === 'whatsapp' ? 'noopener noreferrer' : ''} className="group">
                <div className={`flex items-center gap-4 p-4 rounded-xl transition-all border-2 ${
                  item.type === 'whatsapp'
                    ? 'bg-green-50 border-green-200 hover:border-green-400 hover:bg-green-100'
                    : 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                }`}>
                  <div className={`text-4xl flex-shrink-0 p-3 rounded-lg ${
                    item.type === 'whatsapp'
                      ? 'bg-green-200'
                      : 'bg-blue-200'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-lg ${
                      item.type === 'whatsapp'
                        ? 'text-green-700'
                        : 'text-blue-700'
                    }`}>{item.name}</p>
                    <p className={`text-sm font-semibold ${
                      item.type === 'whatsapp'
                        ? 'text-green-600'
                        : 'text-blue-600'
                    }`}>{item.value}</p>
                  </div>
                  <div className={`text-2xl transition-transform group-hover:translate-x-1 ${
                    item.type === 'whatsapp'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}>
                    →
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">ℹ️ Details</h2>
          </div>
          <div className="p-6 space-y-4">
            {details.map((item, i) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-gray-800 font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
