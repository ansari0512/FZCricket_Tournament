import { Link } from 'react-router-dom'

export default function Contact() {
  const contacts = [
    { icon: '📞', name: 'Saddam Husain', value: '+91 8127021765', href: 'tel:+918127021765', type: 'phone' },
    { icon: '📞', name: 'Mohd Sufiyan', value: '+91 9369429653', href: 'tel:+919369429653', type: 'phone' },
    { icon: 'whatsapp', name: 'WhatsApp Group', value: 'Join Now', href: 'https://chat.whatsapp.com/CR4Wx8QgHbJFaTnDkuTkxu', type: 'whatsapp' },
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
                  <div className={`text-4xl flex-shrink-0 p-3 rounded-lg flex items-center justify-center ${
                    item.type === 'whatsapp'
                      ? 'bg-green-200'
                      : 'bg-blue-200'
                  }`}>
                    {item.icon === 'whatsapp' ? (
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.536.925-2.603 2.291-2.77 3.297a5.947 5.947 0 00.505 3.537 5.977 5.977 0 001.834 2.775 5.976 5.976 0 002.641 1.235c.842.108 1.637-.041 2.25-.36 1.002-.502 1.945-1.053 2.812-1.642.867-.589 1.646-1.3 2.31-2.041a5.902 5.902 0 001.56-2.716 5.822 5.822 0 00-.079-3.677 5.9 5.9 0 00-1.501-2.443 5.899 5.899 0 00-2.64-1.235 5.89 5.89 0 00-2.891.23m5.031 15.9a11.9 11.9 0 01-5.796-1.437 11.88 11.88 0 01-3.956-3.236 11.852 11.852 0 01-2.589-4.75 11.816 11.816 0 01.44-5.231 11.864 11.864 0 012.605-4.387 11.879 11.879 0 014.242-2.973 11.9 11.9 0 015.796 1.437 11.88 11.88 0 013.956 3.236 11.852 11.852 0 012.589 4.75 11.816 11.816 0 01-.44 5.231 11.864 11.864 0 01-2.605 4.387 11.879 11.879 0 01-4.242 2.973z"/>
                      </svg>
                    ) : (
                      item.icon
                    )}
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
