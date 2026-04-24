import { Link } from 'react-router-dom'
import { registerUser } from '../services/api'
import { useApp } from '../context/AppContext'
import { useForm } from '../hooks/useForm'
import { useSubmit } from '../hooks/useSubmit'
import FormInput from '../components/FormInput'

export default function RegisterAccount() {
  const { login } = useApp()
  const { form, setForm, loading, setLoading, showPass, setShowPass } = useForm({ mobile: '', username: '', password: '', confirm: '' })
  const { handleSubmit } = useSubmit('Account created!', '/dashboard')

  const validateForm = (data) => {
    if (data.password !== data.confirm) return 'Passwords do not match'
    if (data.password.length < 6) return 'Password must be at least 6 characters'
    return null
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await handleSubmit(
      async (data) => {
        const response = await registerUser({ mobile: data.mobile, username: data.username, password: data.password })
        login(response.data.user, response.data.token)
        return response
      },
      form,
      setLoading,
      validateForm
    )
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
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInput
              type="tel"
              placeholder="Mobile Number *"
              value={form.mobile}
              onChange={e => setForm({ ...form, mobile: e.target.value })}
              required
            />
            <FormInput
              type="text"
              placeholder="Username *"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
            <FormInput
              type="password"
              placeholder="Password *"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              showPassToggle
              showPass={showPass}
              setShowPass={setShowPass}
            />
            <FormInput
              type="password"
              placeholder="Confirm Password *"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              required
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating Account...' : 'Create Account'}
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
