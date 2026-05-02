import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerTeam } from '../services/api'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const RULES = [
  'इस टूर्नामेंट में भाग लेने के लिए टीम को वेबसाइट पर जाकर रजिस्टर करना अनिवार्य है।',
  'टीम रजिस्टर करने के लिए पहले Google से Login करना होगा।',
  'टीम रजिस्टर करते समय सभी जानकारी सही-सही भरनी होगी, गलत जानकारी पर टीम रिजेक्ट कर दी जाएगी।',
  'प्रत्येक टीम में कुल 15 खिलाड़ियों को रजिस्टर करना अनिवार्य है और उन्हीं खिलाड़ियों को खेलने की अनुमति होगी।',
  'टीम में 8 खिलाड़ी एक ही गांव के और अधिकतम 3 खिलाड़ी अन्य गांव के हो सकते हैं।',
  'टीम को अपने सभी बॉलर्स की जानकारी रजिस्ट्रेशन के समय ही देनी होगी।',
  'टीम का रजिस्ट्रेशन पहले कमेटी द्वारा चेक किया जाएगा, उसके बाद ही अप्रूवल मिलेगा।',
  'अप्रूवल मिलने के बाद ₹300 रजिस्ट्रेशन फीस जमा करना अनिवार्य है।',
  'मैच शुरू होने से पहले बाकी ₹800 एंट्री फीस जमा करनी होगी।',
  'रजिस्ट्रेशन फीस किसी भी स्थिति में वापस नहीं की जाएगी।',
  'यदि टीम रिजेक्ट होती है तो कारण देखकर दोबारा सही जानकारी के साथ रजिस्टर किया जा सकता है।',
  'एक बार टीम अप्रूव होने के बाद री-एंट्री की अनुमति नहीं होगी।',
  'सभी नियमों को ध्यान से पढ़कर ही टीम रजिस्टर करें।',
]

export default function Register() {
  const { currentUser, registrationOpen, refreshUser } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState('rules') // rules | form
  const [agreed, setAgreed] = useState(false)
  const [form, setForm] = useState({ teamName: '', address: '', registrantName: '', mobile: '' })
  const [loading, setLoading] = useState(false)

  if (!currentUser) return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="card max-w-md w-full text-center shadow-card p-8">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-3xl">🔒</span></div>
        <h2 className="text-xl font-bold mb-2">Login Required</h2>
        <p className="text-gray-500 text-sm mb-6">You need to log in first before registering a team.</p>
        <Link to="/login" className="btn-primary w-full">Login</Link>
      </div>
    </div>
  )

  if (currentUser.teamId) return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="card max-w-md w-full text-center shadow-card p-8">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-3xl">🏏</span></div>
        <h2 className="text-xl font-bold mb-2">Team Already Registered!</h2>
        <p className="text-gray-500 text-sm mb-6">Go to your dashboard to manage your team.</p>
        <Link to="/dashboard" className="btn-primary w-full">Go to Dashboard</Link>
      </div>
    </div>
  )

  if (!registrationOpen) return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="card max-w-md w-full text-center shadow-card p-8">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-3xl">😔</span></div>
        <h2 className="text-xl font-bold mb-2">Registration Closed</h2>
        <p className="text-gray-500 text-sm mb-6">All 8 teams have already registered.</p>
        <Link to="/" className="btn-primary w-full">Go to Home</Link>
      </div>
    </div>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.teamName.trim()) return toast.error('Team name is required')
    if (!form.address.trim()) return toast.error('Address is required')
    if (!form.registrantName.trim()) return toast.error('Your name is required')
    if (!/^[0-9]{10}$/.test(form.mobile)) return toast.error('Please enter a valid 10 digit mobile number')

    setLoading(true)
    try {
      const res = await registerTeam({
        teamName: form.teamName.trim().toUpperCase(),
        captainName: form.registrantName.trim().toUpperCase(),
        captainPhone: form.mobile,
        city: form.address.trim().toUpperCase(),
        userId: currentUser._id,
        firebaseUid: currentUser.firebaseUid
      })
      // Update user with teamId after team registration
      const updatedUser = await refreshUser()
      if (updatedUser) {
        toast.success('Team registered successfully! Admin will review it.')
        navigate('/dashboard')
      } else {
        // Fallback - navigate with teamId
        toast.success('Team registered successfully! Admin will review it.')
        navigate('/dashboard', { state: { teamId: res.data.team._id } })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  if (step === 'rules') return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20 page-enter">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="p-6" style={{ background: 'linear-gradient(135deg, #064e3b, #047857)' }}>
            <h2 className="text-xl font-bold text-white text-center">📝 Team Registration Rules</h2>
            <p className="text-center text-white/70 text-sm mt-1">Read the rules first, then register your team</p>
          </div>
          <div className="p-5 space-y-2.5 mb-2">
            {RULES.map((rule, i) => (
              <div key={i} className="flex gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-gray-700 text-sm leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-4">
              <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer flex-shrink-0" />
              <label htmlFor="agree" className="text-sm font-medium text-gray-700 cursor-pointer">I have read all the rules and I agree to them.</label>
            </div>
            <button onClick={() => setStep('form')} disabled={!agreed} className="btn-primary w-full disabled:opacity-40">Proceed →</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20 page-enter">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="p-6" style={{ background: 'linear-gradient(135deg, #064e3b, #047857)' }}>
            <h2 className="text-xl font-bold text-white text-center">🏏 Team Registration</h2>
            <p className="text-center text-white/70 text-sm mt-1">Registration Fee: ₹1,100 (Cash on Arrival)</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Team का नाम *', key: 'teamName', placeholder: 'Team Name', type: 'text' },
                { label: 'Team का Address (गांव/शहर) *', key: 'address', placeholder: 'Village / City', type: 'text' },
                { label: 'आपका नाम (Captain) *', key: 'registrantName', placeholder: 'Your Name', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="input" required />
                </div>
              ))}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Mobile Number *</label>
                <input type="tel" placeholder="10 digit mobile number" value={form.mobile}
                  onChange={e => setForm({ ...form, mobile: e.target.value })} className="input no-upper" maxLength={10} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep('rules')} className="btn-secondary flex-1">← Back</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Registering...' : 'Register Team →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
