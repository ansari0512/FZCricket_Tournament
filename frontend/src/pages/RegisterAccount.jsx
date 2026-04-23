import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function RegisterAccount() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ mobile: '', username: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await registerUser({ mobile: form.mobile, username: form.username, password: form.password })
      login(res.data.user, res.data.token)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          <div className="text-center mb-6">
            <span className="text-5xl">🌟</span>
            <h2 className="text-2xl font-bold mt-3">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Register to participate in the tournament</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="tel" placeholder="Mobile Number *" value={form.mobile}
              onChange={e => setForm({ ...form, mobile: e.target.value })} className="input" required />
            <input type="text" placeholder="Username *" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} className="input no-upper" required />
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="Password *" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} className="input no-upper pr-12" required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            <input type={showPass ? 'text' : 'password'} placeholder="Confirm Password *" value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })} className="input no-upper" required />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-500">
            Already have account? <Link to="/login" className="text-primary font-bold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
