import { Link } from 'react-router-dom'

export default function Contact() {
  const contacts = [
    { icon: '📞', label: 'Mobile 1', value: '+91 8127021765', href: 'tel:+918127021765', color: 'from-blue-500 to-cyan-500' },
    { icon: '📞', label: 'Mobile 2', value: '+91 9369429653', href: 'tel:+919369429653', color: 'from-cyan-500 to-teal-500' },
    { icon: '📧', label: 'Email', value: 'shahidansari0512@gmail.com', href: 'mailto:shahidansari0512@gmail.com', color: 'from-purple-500 to-pink-500' },
  ]

  const details = [
    { label: 'Contact Person', value: 'Shahid Ansari', icon: '👤' },
    { label: 'Venue', value: 'Village Odajhar, Post Naseerpur, Biswan, Sitapur - 261202', icon: '📍' },
  ]

  const tournament = [
    { label: 'Tournament Start', value: '21 April 2026' },
    { label: 'Registration', value: '10–20 Apr 2026' },
    { label: 'Format', value: '8 Overs (T8)' },
    { label: 'Teams', value: '8 Teams Max' },
    { label: 'Winner Prize', value: '₹7,000 + Trophy' },
    { label: 'Entry Fee', value: '₹1,100 / Team' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20 page-enter">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-16 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Get In Touch</h1>
          <p className="text-lg text-gray-300">Have questions about FZ Cricket Tournament? We're here to help!</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-8">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contacts.map((item, i) => (
            <a key={i} href={item.href} className="group">
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-slate-600 hover:border-slate-500">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">{item.label}</p>
                <p className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">{item.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Details Section */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-slate-600">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">ℹ️</span> Details
          </h2>
          <div className="space-y-4">
            {details.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-2xl flex-shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Info */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-3xl">🏏</span> FZ Cricket Tournament 2026
            </h2>
            <p className="text-blue-100 mb-6">Village level cricket tournament with exciting prizes</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tournament.map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-xs text-blue-100 font-semibold uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-white font-bold text-lg">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center pt-4">
          <Link to="/admin" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-600 hover:border-slate-500">
            <span>🔐</span> Admin Panel
          </Link>
        </div>
      </div>
    </div>
  )
}
