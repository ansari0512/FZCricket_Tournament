import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getGallery } from '../services/api'

function RulesModal({ onClose }) {
  const rules = [
    { color: 'green', title: '1. टीमें', text: 'इस टूर्नामेंट में अधिकतम 8 टीमें ही भाग ले सकती हैं।' },
    { color: 'blue', title: '2. मैच फॉर्मेट', text: 'सभी मैच 8-8 ओवर के होंगे, जबकि सेमीफाइनल और फाइनल 10-10 ओवर के होंगे।' },
    { color: 'yellow', title: '3. पावर प्ले', text: 'शुरुआती 2 ओवर पावर प्ले होंगे, जिसमें सर्कल के बाहर केवल 2 खिलाड़ी ही फील्डिंग कर सकते हैं।' },
    { color: 'orange', title: '4. बॉलिंग नियम', text: 'प्रत्येक बॉलर अधिकतम 2 ओवर ही गेंदबाजी कर सकता है। टीम द्वारा दिए गए बॉलर्स ही गेंदबाजी कर सकते हैं।' },
    { color: 'purple', title: '5. बॉल', text: 'सभी मैच Sixit टेनिस बॉल से खेले जाएंगे।' },
    { color: 'teal', title: '6. खिलाड़ी पात्रता', text: 'केवल गांव स्तर (Village Level) के खिलाड़ी ही इस टूर्नामेंट में भाग ले सकते हैं।' },
    { color: 'indigo', title: '7. ग्रुप स्टेज', text: '8 टीमों को 2 ग्रुप (प्रत्येक में 4 टीम) में बांटा जाएगा। हर टीम अपने ग्रुप की अन्य 3 टीमों के साथ एक-एक मैच खेलेगी।' },
    { color: 'blue', title: '8. सेमीफाइनल', text: 'दोनों ग्रुप की टॉप 2 टीमों के बीच सेमीफाइनल खेला जाएगा।' },
    { color: 'green', title: '9. फाइनल', text: 'सेमीफाइनल जीतने वाली टीमों के बीच फाइनल मैच होगा।' },
    { color: 'yellow', title: '10. इनाम', text: 'फाइनल जीतने वाली टीम को ₹7000 और ट्रॉफी, हारने वाली टीम को ₹3000 और ट्रॉफी दी जाएगी।' },
    { color: 'pink', title: '11. मैन ऑफ द मैच', text: 'प्रत्येक मैच में "मैन ऑफ द मैच" दिया जाएगा।' },
    { color: 'orange', title: '12. शेड्यूल', text: 'सभी टीमों को निर्धारित तारीख पर ही मैच खेलना होगा। मैच का पूरा शेड्यूल WhatsApp के माध्यम से भेजा जाएगा।' },
    { color: 'blue', title: '13. लाइव स्कोर', text: 'सभी मैचों का स्कोर लाइव अपडेट किया जाएगा, जिसे वेबसाइट पर देखा जा सकता है।' },
    { color: 'red', title: '14. अंपायर निर्णय', text: 'अंपायर का फैसला अंतिम होगा, विवाद की स्थिति में टूर्नामेंट कमेटी का निर्णय मान्य होगा।' },
    { color: 'gray', title: '15. रजिस्ट्रेशन', text: 'सभी नियमों को ध्यान से पढ़कर ही टीम रजिस्टर करें।' },
  ]
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="cricket-gradient text-white p-5 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-xl font-bold">🏏 Tournament Rules</h3>
          <button onClick={onClose} className="text-2xl font-bold">✕</button>
        </div>
        <div className="p-5 space-y-3 text-sm">
          {rules.map((r, i) => (
            <div key={i} className={`bg-${r.color}-50 border-l-4 border-${r.color}-500 p-3 rounded`}>
              <p className={`font-bold text-${r.color}-700`}>{r.title}</p>
              <p className="text-gray-600 mt-1">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GallerySlider({ photos }) {
  const [current, setCurrent] = useState(0)
  if (!photos.length) return null
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl h-72">
      {photos.map((p, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
          {p.caption && <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-center py-2 text-sm">{p.caption}</div>}
        </div>
      ))}
      <button onClick={() => setCurrent(p => (p - 1 + photos.length) % photos.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl">‹</button>
      <button onClick={() => setCurrent(p => (p + 1) % photos.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl">›</button>
      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{current + 1}/{photos.length}</div>
    </div>
  )
}

export default function Home() {
  const { teams, matches, loading, registrationOpen } = useApp()
  const [showRules, setShowRules] = useState(false)
  const [showRegRules, setShowRegRules] = useState(false)
  const [gallery, setGallery] = useState([])
  const liveMatch = matches.find(m => m.status === 'in-progress')

  useEffect(() => {
    getGallery().then(r => setGallery(r.data)).catch(() => {})
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="pb-20">
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showRegRules && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="cricket-gradient text-white p-5 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-xl font-bold">📝 टीम रजिस्ट्रेशन के नियम</h3>
              <button onClick={() => setShowRegRules(false)} className="text-2xl font-bold">✕</button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              {[
                'इस टूर्नामेंट में भाग लेने के लिए टीम को वेबसाइट पर जाकर रजिस्टर करना अनिवार्य है।',
                'टीम रजिस्टर करने के लिए पहले यूजर आईडी और पासवर्ड बनाना होगा।',
                'यूजर आईडी बनाने के 24 घंटे के अंदर टीम को रजिस्टर करना अनिवार्य है, अन्यथा आईडी हटा दी जाएगी।',
                'टीम रजिस्टर करते समय सभी जानकारी सही-सही भरनी होगी, गलत जानकारी पर टीम रिजेक्ट कर दी जाएगी।',
                'प्रत्येक टीम में कुल 15 खिलाड़ियों को रजिस्टर करना अनिवार्य है और उन्हीं खिलाड़ियों को खेलने की अनुमति होगी।',
                'टीम में 8 खिलाड़ी एक ही गांव के और अधिकतम 3 खिलाड़ी अन्य गांव के हो सकते हैं।',
                'टीम को अपने सभी बॉलर्स की जानकारी रजिस्ट्रेशन के समय ही देनी होगी।',
                'टीम का रजिस्ट्रेशन पहले कमेटी द्वारा चेक किया जाएगा, उसके बाद ही अप्रूवल मिलेगा।',
                'अप्रूवल मिलने के बाद ₹300 रजिस्ट्रेशन फीस जमा करना अनिवार्य है।',
                'मैच शुरू होने से पहले बाकी ₹800 एंट्री फीस जमा करनी होगी।',
                'रजिस्ट्रेशन फीस किसी भी स्थिति में वापस नहीं की जाएगी।',
                'टीम रजिस्टर करने के बाद 24 घंटे में लॉगिन करके स्टेटस चेक किया जा सकता है।',
                'यदि टीम रिजेक्ट होती है तो कारण देखकर दोबारा सही जानकारी के साथ रजिस्टर किया जा सकता है।',
                'एक बार टीम रजिस्टर होने के बाद री-एंट्री की अनुमति नहीं होगी।',
                'टीम रजिस्टर करते समय मैच की तारीख चुन सकते हैं, कमेटी उसी अनुसार मैच कराने की कोशिश करेगी।',
              ].map((rule, i) => (
                <div key={i} className="flex gap-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <span className="font-bold text-blue-700 flex-shrink-0">{i + 1}.</span>
                  <p className="text-gray-700">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 relative overflow-hidden">
        <div className="marquee-container py-2 border-b border-white/10">
          <div className="marquee-banner">
            Team Registration Date : 10 Apr 2026 to 20 Apr 2026
          </div>
        </div>
        <div className="absolute inset-0 opacity-5 text-[150px] md:text-[200px] flex items-center justify-center select-none">🏏</div>
        <div className="max-w-4xl mx-auto text-center relative pt-6 pb-14">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Firoz Shah Cricket Tournament</h1>
          <p className="text-yellow-300 font-semibold mb-1">📍 Village Odajhar, Post Naseerpur</p>
          <p className="text-gray-400 text-sm mb-1">Tahsil Biswan, Sitapur - 261202</p>
          <p className="text-green-400 font-bold mt-2">🗓️ Tournament Start: 21 April 2026</p>
          <p className="text-gray-400 text-sm mt-1">8 Teams • 15 Players Each • 8 Overs</p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              { val: teams.length, label: 'Teams Registered', color: 'text-yellow-300' },
              { val: 8 - teams.length, label: 'Spots Left', color: 'text-green-300' },
              { val: matches.filter(m => m.status === 'completed').length, label: 'Matches Played', color: 'text-blue-300' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 border border-white/10">
                <p className={`text-3xl font-bold ${s.color}`}>{s.val}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {registrationOpen ? (
              <Link to="/register" className="bg-green-400 hover:bg-green-300 text-gray-900 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-lg">
                Register Your Team 🚀
              </Link>
            ) : (
              <div className="bg-red-500/30 border border-red-400 rounded-full px-6 py-3">
                <p className="text-red-300 font-bold">Registration Closed</p>
              </div>
            )}
            <button onClick={() => setShowRules(true)} className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-lg">
              📋 टूर्नामेंट नियम
            </button>
            <button onClick={() => setShowRegRules(true)} className="bg-blue-400 hover:bg-blue-300 text-gray-900 font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-lg">
              📝 रजिस्ट्रेशन नियम
            </button>
          </div>
        </div>
      </section>

      {/* Live Match */}
      {liveMatch && (
        <section className="bg-yellow-50 py-5 px-4 border-b-4 border-yellow-400">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              <span className="font-bold text-red-600 text-sm">LIVE MATCH</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg flex justify-between items-center text-center">
              <div className="flex-1">
                <p className="font-bold">{liveMatch.team1?.teamName}</p>
                <p className="text-2xl font-bold text-primary">{liveMatch.team1Score?.runs || 0}/{liveMatch.team1Score?.wickets || 0}</p>
              </div>
              <span className="text-xl font-bold text-gray-300">VS</span>
              <div className="flex-1">
                <p className="font-bold">{liveMatch.team2?.teamName}</p>
                <p className="text-2xl font-bold text-primary">{liveMatch.team2Score?.runs || 0}/{liveMatch.team2Score?.wickets || 0}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Prize Money */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">💰 Entry Fee & Prize Money</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🎟️', title: 'Entry Fee', amount: '₹1,100', sub: 'Cash on Arrival', bg: 'from-pink-500 to-rose-500' },
              { icon: '🏆', title: 'Winner Prize', amount: '₹7,000', sub: '1st Place', bg: 'from-yellow-400 to-orange-400' },
              { icon: '🥈', title: 'Runner-up', amount: '₹3,000', sub: '2nd Place', bg: 'from-purple-500 to-indigo-500' },
            ].map((p, i) => (
              <div key={i} className={`bg-gradient-to-br ${p.bg} text-white rounded-2xl p-6 text-center shadow-xl hover:scale-105 transition`}>
                <p className="text-4xl mb-2">{p.icon}</p>
                <p className="font-bold text-lg">{p.title}</p>
                <p className="text-4xl font-bold mt-2">{p.amount}</p>
                <p className="text-sm mt-2 bg-white/20 rounded-full px-3 py-1 inline-block">{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="bg-gray-50 py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">📸 Photo Gallery</h2>
            <GallerySlider photos={gallery} />
          </div>
        </section>
      )}

      {/* Teams */}
      {teams.length > 0 && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">👥 Registered Teams ({teams.length}/8)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teams.map((team, i) => {
                const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500']
                return (
                  <div key={team._id} className="card hover:shadow-lg transition">
                    <div className={`${colors[i % colors.length]} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3`}>
                      {team.teamName.charAt(0)}
                    </div>
                    <p className="font-bold text-sm truncate">{team.teamName}</p>
                    <p className="text-xs text-gray-500">Capt: {team.captainName}</p>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>W: {team.wins}</span>
                      <span>L: {team.losses}</span>
                      <span className="font-bold text-primary">{team.points}pts</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Matches */}
      {matches.filter(m => m.status === 'scheduled').length > 0 && (
        <section className="bg-gray-50 py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">📅 Upcoming Matches</h2>
            <div className="space-y-3">
              {matches.filter(m => m.status === 'scheduled').slice(0, 5).map((match) => (
                <div key={match._id} className="card flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{match.team1?.teamName} vs {match.team2?.teamName}</p>
                    <p className="text-xs text-gray-500">{match.venue} • {match.overs} overs</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">{new Date(match.matchDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs text-gray-500">{new Date(match.matchDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
