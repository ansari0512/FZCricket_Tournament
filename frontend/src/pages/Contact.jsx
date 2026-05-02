import { Link } from 'react-router-dom'

export default function Contact() {
  const info = [
    { icon: '👤', label: 'Contact Person', value: 'Shahid Ansari', type: 'text', color: 'from-sky-500 to-indigo-600' },
    { icon: '📞', label: 'Mobile 1', value: '+91 8127021765', href: 'tel:+918127021765', color: 'from-cyan-500 to-sky-600' },
    { icon: '📞', label: 'Mobile 2', value: '+91 9369429653', href: 'tel:+919369429653', color: 'from-indigo-500 to-violet-600' },
    { icon: '📧', label: 'Email', value: 'shahidansari0512@gmail.com', href: 'mailto:shahidansari0512@gmail.com', color: 'from-slate-500 to-slate-700' },
    { icon: '📍', label: 'Venue', value: 'Village Odajhar, Post Naseerpur, Biswan, Sitapur - 261202', type: 'text', color: 'from-slate-500 to-slate-600' },
  ]

  return (
    <div className="py-8 px-4 pb-20 page-enter">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="section-title">📞 Contact & Support</p>
          <p className="section-subtitle">Have any questions? Feel free to contact us</p>
        </div>

        {/* Contact Cards */}
        <div className="space-y-3 mb-6">
          {info.map((item, i) => (
            <div key={i} className="card-hover flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-md`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="font-bold text-primary hover:text-primary-dark transition-colors truncate block">
                    {item.value}
                  </a>
                ) : (
                  <p className="font-bold text-gray-800 text-sm leading-snug">{item.value}</p>
                )}
              </div>
              {item.href && (
                <div className="flex-shrink-0">
                  <a href={item.href}
                    className="w-9 h-9 bg-primary/10 hover:bg-primary/20 rounded-xl flex items-center justify-center text-primary transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tournament Info Card */}
        <div className="rounded-2xl overflow-hidden shadow-card mb-6">
          <div className="p-4" style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}>
            <p className="text-white font-bold text-center">🏏 FZ Cricket Tournament 2026</p>
          </div>
          <div className="p-4 bg-white grid grid-cols-2 gap-3">
            {[
              { label: 'Tournament Start', value: '21 April 2026' },
              { label: 'Registration', value: '10–20 Apr 2026' },
              { label: 'Format', value: '8 Overs (T8)' },
              { label: 'Teams', value: '8 Teams Max' },
              { label: 'Winner Prize', value: '₹7,000 + Trophy' },
              { label: 'Entry Fee', value: '₹1,100 / Team' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                <p className="font-bold text-sm text-gray-800 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/admin" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
            🔐 Admin Panel
          </Link>
        </div>
      </div>
    </div>
  )
}
