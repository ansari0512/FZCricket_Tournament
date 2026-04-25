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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center shadow-xl">
        <span className="text-6xl">🔒</span>
        <h2 className="text-2xl font-bold mt-4">Login Required</h2>
        <p className="text-gray-500 mt-2">Team register karne ke liye pehle login karo।</p>
        <Link to="/login" className="btn-primary w-full mt-4 block text-center">Login Karo</Link>
      </div>
    </div>
  )

  if (currentUser.teamId) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center shadow-xl">
        <span className="text-6xl">🏏</span>
        <h2 className="text-2xl font-bold mt-4">Team Already Registered!</h2>
        <p className="text-gray-500 mt-2">Dashboard pe jaake apni team manage karo।</p>
        <Link to="/dashboard" className="btn-primary w-full mt-4 block text-center">Dashboard Pe Jao</Link>
      </div>
    </div>
  )

  if (!registrationOpen) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center shadow-xl">
        <span className="text-6xl">😔</span>
        <h2 className="text-2xl font-bold mt-4">Registration Closed</h2>
        <p className="text-gray-500 mt-2">Sabhi 8 teams register ho chuki hain।</p>
        <Link to="/" className="btn-primary w-full mt-4 block text-center">Home Pe Jao</Link>
      </div>
    </div>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.teamName.trim()) return toast.error('Team name required hai')
    if (!form.address.trim()) return toast.error('Address required hai')
    if (!form.registrantName.trim()) return toast.error('Aapka naam required hai')
    if (!/^[0-9]{10}$/.test(form.mobile)) return toast.error('Valid 10 digit mobile number daalo')

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
      // Team register hone ke baad user ko update karo teamId ke saath
      const updatedUser = await refreshUser()
      if (updatedUser) {
        toast.success('Team register ho gayi! Admin review karega।')
        navigate('/dashboard')
      } else {
        // Fallback - manually teamId set karke navigate karo
        toast.success('Team register ho gayi! Admin review karega।')
        navigate('/dashboard', { state: { teamId: res.data.team._id } })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  // Step 1: Rules
  if (step === 'rules') return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="card shadow-xl">
          <div className="cricket-gradient text-white p-5 rounded-t-2xl -mx-5 -mt-5 mb-5">
            <h2 className="text-xl font-bold text-center">📝 Team Registration Rules</h2>
            <p className="text-center text-white/80 text-sm mt-1">Team register karne se pehle yeh rules padho</p>
          </div>

          <div className="space-y-3 mb-6">
            {RULES.map((rule, i) => (
              <div key={i} className="flex gap-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-xl">
                <span className="font-bold text-blue-700 flex-shrink-0 text-sm">{i + 1}.</span>
                <p className="text-gray-700 text-sm">{rule}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-4">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
            <label htmlFor="agree" className="text-sm font-medium text-gray-700 cursor-pointer">
              मैंने सभी नियम पढ़ लिए हैं और मैं इनसे सहमत हूं।
            </label>
          </div>

          <button
            onClick={() => setStep('form')}
            disabled={!agreed}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            आगे बढ़ें →
          </button>
        </div>
      </div>
    </div>
  )

  // Step 2: Form
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="card shadow-xl">
          <div className="cricket-gradient text-white p-5 rounded-t-2xl -mx-5 -mt-5 mb-6">
            <h2 className="text-xl font-bold text-center">🏏 Team Registration</h2>
            <p className="text-center text-white/80 text-sm mt-1">Registration Fee: ₹1,100 (Cash on Arrival)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Team का नाम *</label>
              <input
                type="text"
                placeholder="Team Name"
                value={form.teamName}
                onChange={e => setForm({ ...form, teamName: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Team का Address (गांव/शहर) *</label>
              <input
                type="text"
                placeholder="Village / City"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">आपका नाम (Register करने वाले का) *</label>
              <input
                type="text"
                placeholder="Your Name"
                value={form.registrantName}
                onChange={e => setForm({ ...form, registrantName: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Mobile Number *</label>
              <input
                type="tel"
                placeholder="10 digit mobile number"
                value={form.mobile}
                onChange={e => setForm({ ...form, mobile: e.target.value })}
                className="input no-upper"
                maxLength={10}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('rules')}
                className="btn-secondary flex-1"
              >
                ← वापस
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Registering...' : 'Register Team →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
