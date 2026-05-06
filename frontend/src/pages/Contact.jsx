import { Link } from 'react-router-dom'

export default function Contact() {
  const contacts = [
    { icon: '📞', label: 'Saddam Husain', value: '+91 8127021765', href: 'tel:+918127021765' },
    { icon: '📞', label: 'Mohd Sufiyan', value: '+91 9369429653', href: 'tel:+919369429653' },
    { icon: '💬', label: 'WhatsApp Group', value: 'Join Group', href: 'https://chat.whatsapp.com/CR4Wx8QgHbJFaTnDkuTkxu' },
  ]

  const details = [
    { label: 'Contact Person', value: 'Shahid Ansari', icon: '👤' },
    { label: 'Venue', value: 'Village Odajhar, Post Naseerpur, Biswan, Sitapur - 261202', icon: '📍' },
  ]

  const tournament = [
    { label: 'Start', value: '21 Apr 2026' },
    { label: 'Registration', value: '10–20 Apr' },
    { label: 'Format', value: '8 Overs' },
    { label: 'Teams', value: '8 Max' },
    { label: 'Prize', value: '₹7,000' },
    { label: 'Fee', value: '₹1,100' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20 page-enter">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Get In Touch</h1>
          <p className="text-blue-100">Questions about FZ Cricket Tournament?</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {contacts.map((item, i) => {
            const isWhatsApp = item.label === 'WhatsApp Group'
            return (
              <a key={i} href={item.href} target={isWhatsApp ? '_blank' : '_self'} rel={isWhatsApp ? 'noopener noreferrer' : ''} className="group">
                <div className={`rounded-lg p-4 shadow-sm hover:shadow-md transition-all border ${
                  isWhatsApp 
                    ? 'bg-green-50 border-green-200 hover:border-green-400' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}>
                  <p className="text-2xl mb-2">{item.icon}</p>
                  <p className="text-xs text-gray-500 font-semibold mb-1">{item.label}</p>
                  <p className={`text-sm font-bold ${
                    isWhatsApp 
                      ? 'text-green-600 group-hover:text-green-700' 
                      : 'text-blue-600 group-hover:text-blue-700'
                  }`}>{item.value}</p>
                </div>
              </a>
            )
          })}
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Details</h2>
          <div className="space-y-3">
            {details.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-semibold mb-0.5">{item.label}</p>
                  <p className="text-sm text-gray-800 font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Info */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-5 text-white shadow-sm">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>🏏</span> FZ Cricket Tournament 2026
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {tournament.map((item, i) => (
              <div key={i} className="bg-white/20 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-100 font-semibold mb-1">{item.label}</p>
                <p className="font-bold text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center">
          <Link to="/admin" className="inline-flex items-center gap-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all text-sm">
            <span>🔐</span> Admin Panel
          </Link>
        </div>
      </div>
    </div>
  )
}
