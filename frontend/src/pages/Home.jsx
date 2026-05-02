import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getGallery } from '../services/api'

function RulesModal({ onClose }) {
  const rules = [
    { icon: '👥', color: '#10B981', title: '1. टीमें', text: 'इस टूर्नामेंट में अधिकतम 8 टीमें ही भाग ले सकती हैं।' },
    { icon: '🏏', color: '#3B82F6', title: '2. मैच फॉर्मेट', text: 'सभी मैच 8-8 ओवर के होंगे, जबकि सेमीफाइनल और फाइनल 10-10 ओवर के होंगे।' },
    { icon: '⚡', color: '#F59E0B', title: '3. पावर प्ले', text: 'शुरुआती 2 ओवर पावर प्ले होंगे, जिसमें सर्कल के बाहर केवल 2 खिलाड़ी ही फील्डिंग कर सकते हैं।' },
    { icon: '🎯', color: '#EF4444', title: '4. बॉलिंग नियम', text: 'प्रत्येक बॉलर अधिकतम 2 ओवर ही गेंदबाजी कर सकता है।' },
    { icon: '🎾', color: '#8B5CF6', title: '5. बॉल', text: 'सभी मैच Sixit टेनिस बॉल से खेले जाएंगे।' },
    { icon: '🏘️', color: '#06B6D4', title: '6. खिलाड़ी पात्रता', text: 'केवल गांव स्तर (Village Level) के खिलाड़ी ही भाग ले सकते हैं।' },
    { icon: '📊', color: '#6366F1', title: '7. ग्रुप स्टेज', text: '8 टीमों को 2 ग्रुप में बांटा जाएगा। हर टीम अपने ग्रुप की 3 टीमों से खेलेगी।' },
    { icon: '🥊', color: '#3B82F6', title: '8. सेमीफाइनल', text: 'दोनों ग्रुप की टॉप 2 टीमों के बीच सेमीफाइनल खेला जाएगा।' },
    { icon: '🏆', color: '#10B981', title: '9. फाइनल', text: 'सेमीफाइनल जीतने वाली टीमों के बीच फाइनल मैच होगा।' },
    { icon: '💰', color: '#F59E0B', title: '10. इनाम', text: 'फाइनल जीतने वाली टीम को ₹7000 और ट्रॉफी, हारने वाली टीम को ₹3000 और ट्रॉफी।' },
    { icon: '⭐', color: '#EC4899', title: '11. मैन ऑफ द मैच', text: 'प्रत्येक मैच में "मैन ऑफ द मैच" दिया जाएगा।' },
    { icon: '📅', color: '#EF4444', title: '12. अंपायर निर्णय', text: 'अंपायर का फैसला अंतिम होगा।' },
  ]
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #064e3b, #047857)' }}>
          <div>
            <h3 className="text-xl font-bold text-white">🏏 Tournament Rules</h3>
            <p className="text-white/70 text-xs mt-0.5">FZ Cricket Tournament 2026</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">✕</button>
        </div>
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-5 space-y-2.5">
          {rules.map((r, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all"
              style={{ borderLeft: `3px solid ${r.color}` }}>
              <span className="text-xl flex-shrink-0">{r.icon}</span>
              <div>
                <p className="font-bold text-sm text-gray-800">{r.title}</p>
                <p className="text-gray-500 text-xs md:text-sm mt-0.5 leading-relaxed">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RegRulesModal({ onClose }) {
  const rules = [
    'टीम रजिस्टर करने के लिए पहले Google से Login करना होगा।',
    'टीम रजिस्टर करते समय सभी जानकारी सही-सही भरनी होगी।',
    'प्रत्येक टीम में कुल 15 खिलाड़ियों को रजिस्टर करना अनिवार्य है।',
    'टीम में 8 खिलाड़ी एक ही गांव के और अधिकतम 3 अन्य गांव के हो सकते हैं।',
    'टीम का रजिस्ट्रेशन पहले कमेटी द्वारा चेक किया जाएगा।',
    'अप्रूवल मिलने के बाद ₹300 रजिस्ट्रेशन फीस जमा करना अनिवार्य है।',
    'मैच शुरू होने से पहले बाकी ₹800 एंट्री फीस जमा करनी होगी।',
    'रजिस्ट्रेशन फीस किसी भी स्थिति में वापस नहीं की जाएगी।',
  ]
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)' }}>
          <div>
            <h3 className="text-xl font-bold text-white">📝 Registration Rules</h3>
            <p className="text-white/70 text-xs mt-0.5">Team Registration Guidelines</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">✕</button>
        </div>
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-5 space-y-2.5">
          {rules.map((rule, i) => (
            <div key={i} className="flex gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-gray-700 text-sm leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GallerySlider({ photos }) {
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % photos.length), 3500)
    return () => clearInterval(timer)
  }, [photos.length])

  if (!photos.length) return null

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden shadow-xl h-72 cursor-pointer group" onClick={() => setFullscreen(true)}>
        {photos.map((p, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
            <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {p.caption && <div className="absolute bottom-0 inset-x-0 text-white text-center py-3 px-4 text-sm font-medium">{p.caption}</div>}
          </div>
        ))}
        <button onClick={e => { e.stopPropagation(); setCurrent(p => (p - 1 + photos.length) % photos.length) }}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl transition-all opacity-0 group-hover:opacity-100">‹</button>
        <button onClick={e => { e.stopPropagation(); setCurrent(p => (p + 1) % photos.length) }}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl transition-all opacity-0 group-hover:opacity-100">›</button>
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full font-medium">{current + 1}/{photos.length}</div>
        <div className="absolute bottom-10 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">🔍 Tap to zoom</div>
        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i) }}
              className={`rounded-full transition-all ${i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`} />
          ))}
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setFullscreen(false)}>
          <div className="relative w-full max-w-3xl px-4" onClick={e => e.stopPropagation()}>
            <img src={photos[current].url} alt={photos[current].caption} className="w-full max-h-[80vh] object-contain rounded-xl" />
            {photos[current].caption && <p className="text-white/80 text-center mt-3 text-sm">{photos[current].caption}</p>}
            <button onClick={() => setCurrent(p => (p - 1 + photos.length) % photos.length)} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-11 h-11 rounded-full flex items-center justify-center text-2xl transition-all">‹</button>
            <button onClick={() => setCurrent(p => (p + 1) % photos.length)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-11 h-11 rounded-full flex items-center justify-center text-2xl transition-all">›</button>
            <button onClick={() => setFullscreen(false)} className="absolute top-2 right-6 bg-white/10 hover:bg-white/20 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all">✕</button>
            <p className="text-white/40 text-center text-xs mt-2">{current + 1} / {photos.length}</p>
          </div>
        </div>
      )}
    </>
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
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #020c07, #064e3b)' }}>
      <span className="text-6xl mb-4">🏏</span>
      <p className="text-white text-xl font-bold mb-6">FZ Cricket Tournament</p>
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="pb-20 page-enter">
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showRegRules && <RegRulesModal onClose={() => setShowRegRules(false)} />}

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #020c07 0%, #064e3b 40%, #065f46 70%, #0a3d2e 100%)' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        {/* Big cricket emoji bg */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <span className="text-[200px] opacity-[0.04]">🏏</span>
        </div>

        {/* Marquee */}
        <div className="relative border-b border-white/10 py-2">
          <div className="marquee-container">
            <div className="marquee-banner">
              🏏 &nbsp; Team Registration: 10 Apr – 20 Apr 2026 &nbsp; • &nbsp; Tournament Start: 21 April 2026 &nbsp; • &nbsp; Village Odajhar, Sitapur &nbsp; 🏏
            </div>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 pt-10 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-xs font-semibold tracking-wider uppercase">Village Level Cricket</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
            Firoz Shah Cricket<br />
            <span style={{ background: 'linear-gradient(90deg, #F59E0B, #FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Tournament 2026
            </span>
          </h1>

          <p className="text-white/60 text-sm mb-1">📍 Village Odajhar, Post Naseerpur, Biswan, Sitapur</p>
          <p className="font-bold text-sm mb-8" style={{ color: '#4ade80' }}>🗓️ Tournament Start: 21 April 2026 &nbsp;•&nbsp; 8 Teams &nbsp;•&nbsp; 8 Overs</p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { val: teams.length, label: 'Teams Registered', color: '#F59E0B' },
              { val: `${8 - teams.length}`, label: 'Spots Left', color: '#4ade80' },
              { val: matches.filter(m => m.status === 'completed').length, label: 'Matches Played', color: '#60a5fa' },
            ].map((s, i) => (
              <div key={i} className="stat-card min-w-[100px]">
                <p className="text-3xl font-black" style={{ color: s.color }}>{s.val}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {registrationOpen ? (
              <Link to="/register" className="btn-gold text-base px-8 py-3 shadow-glow-gold">
                Register Your Team 🚀
              </Link>
            ) : (
              <div className="bg-red-500/20 border border-red-400/40 rounded-full px-6 py-3">
                <p className="text-red-300 font-bold text-sm">🔒 Registration Closed</p>
              </div>
            )}
            <button onClick={() => setShowRules(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 px-6 rounded-full text-sm transition-all">
              📋 Tournament Rules
            </button>
            <button onClick={() => setShowRegRules(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 px-6 rounded-full text-sm transition-all">
              📝 Registration Rules
            </button>
          </div>
        </div>
      </section>

      {/* ── Live Match Banner ── */}
      {liveMatch && (
        <section className="bg-gradient-to-r from-red-600 to-red-500 py-4 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              <span className="font-black text-white text-sm tracking-widest uppercase">Live Match</span>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center text-white gap-4">
              <div className="flex-1 text-center">
                <p className="font-bold text-sm">{liveMatch.team1?.teamName}</p>
                <p className="text-2xl md:text-3xl font-black mt-1">{liveMatch.team1Score?.runs ?? 0}<span className="text-base md:text-lg text-white/70">/{liveMatch.team1Score?.wickets ?? 0}</span></p>
              </div>
              <div className="px-4">
                <div className="bg-white/20 rounded-xl px-3 py-1.5">
                  <p className="text-xs font-black text-white/80">VS</p>
                </div>
              </div>
              <div className="flex-1 text-center">
                <p className="font-bold text-sm">{liveMatch.team2?.teamName}</p>
                <p className="text-2xl md:text-3xl font-black mt-1">{liveMatch.team2Score?.runs ?? 0}<span className="text-base md:text-lg text-white/70">/{liveMatch.team2Score?.wickets ?? 0}</span></p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Prize Money ── */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="section-title">💰 Prize Money</p>
          <p className="section-subtitle">Win big at FZ Cricket Tournament 2026</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🎟️', title: 'Entry Fee', amount: '₹1,100', sub: 'Per Team', bg: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.3)' },
              { icon: '🏆', title: 'Winner', amount: '₹7,000', sub: '1st Place + Trophy', bg: 'from-yellow-400 to-orange-500', glow: 'rgba(245,158,11,0.4)' },
              { icon: '🥈', title: 'Runner-up', amount: '₹3,000', sub: '2nd Place + Trophy', bg: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.3)' },
            ].map((p, i) => (
              <div key={i} className={`bg-gradient-to-br ${p.bg} text-white rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300`}
                style={{ boxShadow: `0 10px 30px ${p.glow}` }}>
                <p className="text-5xl mb-3">{p.icon}</p>
                <p className="font-bold text-base opacity-90">{p.title}</p>
                <p className="text-4xl font-black mt-2 mb-2">{p.amount}</p>
                <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">{p.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <p className="section-title">📸 Photo Gallery</p>
            <p className="section-subtitle">Moments from our cricket ground</p>
            <GallerySlider photos={gallery} />
          </div>
        </section>
      )}

      {/* ── Teams ── */}
      {teams.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="section-title">👥 Registered Teams</p>
            <p className="section-subtitle">{teams.length} of 8 spots filled</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teams.map((team, i) => {
                const colors = [
                  { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50' },
                  { bg: 'from-blue-500 to-indigo-600', light: 'bg-blue-50' },
                  { bg: 'from-purple-500 to-violet-600', light: 'bg-purple-50' },
                  { bg: 'from-orange-500 to-red-500', light: 'bg-orange-50' },
                  { bg: 'from-pink-500 to-rose-600', light: 'bg-pink-50' },
                  { bg: 'from-cyan-500 to-blue-500', light: 'bg-cyan-50' },
                  { bg: 'from-amber-500 to-yellow-500', light: 'bg-amber-50' },
                  { bg: 'from-red-500 to-pink-600', light: 'bg-red-50' },
                ]
                const c = colors[i % colors.length]
                return (
                  <div key={team._id} className="card-hover cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center text-white text-xl font-black mb-3 shadow-md`}>
                      {team.teamName.charAt(0)}
                    </div>
                    <p className="font-bold text-sm truncate">{team.teamName}</p>
                    <p className="text-xs text-gray-400 truncate">📍 {team.city}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-1 text-center">
                      {[['W', team.wins, 'text-green-600'], ['L', team.losses, 'text-red-500'], ['Pts', team.points, 'text-primary font-bold']].map(([k, v, cls]) => (
                        <div key={k}>
                          <p className={`text-sm font-bold ${cls}`}>{v}</p>
                          <p className="text-[10px] text-gray-400">{k}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Upcoming Matches ── */}
      {matches.filter(m => m.status === 'scheduled').length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <p className="section-title">📅 Upcoming Matches</p>
            <p className="section-subtitle">Get ready for the action</p>
            <div className="space-y-3">
              {matches.filter(m => m.status === 'scheduled').slice(0, 5).map((match) => (
                <div key={match._id} className="card-hover flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">🏏</div>
                    <div>
                      <p className="font-bold text-sm">{match.team1?.teamName} <span className="text-gray-400 font-normal">vs</span> {match.team2?.teamName}</p>
                      <p className="text-xs text-gray-400">{match.venue} • {match.overs} overs • {match.matchType}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="font-bold text-primary text-sm">{new Date(match.matchDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs text-gray-400">{new Date(match.matchDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
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
