import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerTeam } from '../services/api'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { currentUser, registrationOpen, login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ teamName: '', captainName: '', captainPhone: '', city: '' })
  const [loading, setLoading] = useState(false)

  if (!currentUser) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center shadow-xl">
        <span className="text-6xl">🔒</span>
        <h2 className="text-2xl font-bold mt-4">Login Required</h2>
        <p className="text-gray-500 mt-2">Please login to register your team.</p>
        <Link to="/login" className="btn-primary w-full mt-4 block text-center">Login</Link>
        <Link to="/register-account" className="btn-secondary w-full mt-2 block text-center">Create Account</Link>
      </div>
    </div>
  )

  if (currentUser.teamId) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center shadow-xl">
        <span className="text-6xl">🏏</span>
        <h2 className="text-2xl font-bold mt-4">Team Already Registered!</h2>
        <p className="text-gray-500 mt-2">Go to dashboard to manage your team.</p>
        <Link to="/dashboard" className="btn-primary w-full mt-4 block text-center">Go to Dashboard</Link>
      </div>
    </div>
  )

  if (!registrationOpen) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center shadow-xl">
        <span className="text-6xl">😔</span>
        <h2 className="text-2xl font-bold mt-4">Registration Closed</h2>
        <p className="text-gray-500 mt-2">All 8 teams have registered.</p>
        <Link to="/" className="btn-primary w-full mt-4 block text-center">Back to Home</Link>
      </div>
    </div>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await registerTeam({
        teamName: form.teamName.toUpperCase(),
        captainName: form.captainName.toUpperCase(),
        captainPhone: form.captainPhone,
        city: form.city.toUpperCase(),
        userId: currentUser._id
      })
      const updatedUser = { ...currentUser, teamId: res.data.team._id }
      login(updatedUser, localStorage.getItem('fzToken'))
      toast.success('Team registered! Now add players from dashboard.')
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
            <span className="text-5xl">🏏</span>
            <h2 className="text-2xl font-bold mt-3">Team Registration</h2>
            <p className="text-gray-500 text-sm mt-1">Registration Fee: <span className="font-bold text-primary">₹1,100 (Cash on Arrival)</span></p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Team Name *" value={form.teamName}
              onChange={e => setForm({ ...form, teamName: e.target.value })} className="input" required />
            <input type="text" placeholder="Captain Name *" value={form.captainName}
              onChange={e => setForm({ ...form, captainName: e.target.value })} className="input" required />
            <input type="tel" placeholder="Captain Phone *" value={form.captainPhone}
              onChange={e => setForm({ ...form, captainPhone: e.target.value })} className="input" required />
            <input type="text" placeholder="Village *" value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })} className="input" />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Registering...' : 'Register Team →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
