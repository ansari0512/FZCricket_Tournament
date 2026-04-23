import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.user, res.data.token)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          <div className="text-center mb-6">
            <span className="text-5xl">👤</span>
            <h2 className="text-2xl font-bold mt-3">User Login</h2>
            <p className="text-gray-500 text-sm mt-1">Login to manage your team</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Username or Mobile" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="input no-upper" required />
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input no-upper pr-12" required />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-500">
            New user? <Link to="/register-account" className="text-primary font-bold">Create Account</Link>
          </p>
          <Link to="/" className="block text-center mt-2 text-sm text-gray-400">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
