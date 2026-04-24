import { Link } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useApp } from '../context/AppContext'
import { useForm } from '../hooks/useForm'
import { useSubmit } from '../hooks/useSubmit'
import FormInput from '../components/FormInput'

export default function Login() {
  const { login } = useApp()
  const { form, setForm, loading, setLoading, showPass, setShowPass } = useForm({ username: '', password: '' })
  const { handleSubmit } = useSubmit('Login successful!', '/dashboard')

  const onSubmit = async (e) => {
    e.preventDefault()
    await handleSubmit(
      async (data) => {
        const response = await loginUser(data)
        login(response.data.user, response.data.token)
        return response
      },
      form,
      setLoading
    )
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
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInput
              type="text"
              placeholder="Username or Mobile"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
            <FormInput
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              showPassToggle
              showPass={showPass}
              setShowPass={setShowPass}
            />
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
