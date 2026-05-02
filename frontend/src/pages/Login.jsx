import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  if (currentUser) { navigate('/dashboard'); return null }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') toast.error('Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md page-enter">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center" style={{ background: 'linear-gradient(135deg, #1e293b, #2563eb)' }}>
            <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563eb, #818cf8)' }}>
              <span className="text-4xl">🏏</span>
            </div>
            <h1 className="text-2xl font-black text-white">FZ Cricket</h1>
            <p className="text-white/60 text-sm mt-1">Tournament 2026</p>
          </div>

          {/* Body */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome Back!</h2>
            <p className="text-gray-500 text-sm mb-6">Login to register your team and manage players</p>

            <button onClick={handleGoogleLogin} disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-primary hover:bg-sky-50 text-gray-700 font-bold py-3.5 px-6 rounded-2xl transition-all shadow-sm disabled:opacity-50 group">
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              )}
              <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>

            <div className="mt-6 p-4 bg-sky-50 border border-sky-100 rounded-2xl">
              <p className="text-sky-800 text-xs font-medium text-center">
                🔒 Secure login via Google — No password needed
              </p>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              By logging in, you agree to our tournament rules and guidelines
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: '🏏', text: 'Register Team' },
            { icon: '👥', text: 'Add Players' },
            { icon: '📊', text: 'Track Status' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center shadow-card">
              <p className="text-2xl mb-1">{f.icon}</p>
              <p className="text-xs text-gray-500 font-medium">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
