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

  if (currentUser) {
    navigate('/dashboard')
    return null
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Login failed. Please try again.')
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card shadow-xl text-center">
          <span className="text-5xl">🏏</span>
          <h2 className="text-2xl font-bold mt-3 mb-2">User Login</h2>
          <p className="text-gray-500 text-sm mb-8">Tournament mein participate karne ke liye login karo</p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-primary hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            {loading ? 'Logging in...' : 'Google se Login karo'}
          </button>

          <p className="text-xs text-gray-400 mt-6">
            Login karne ke baad team register kar sakte ho
          </p>
        </div>
      </div>
    </div>
  )
}
