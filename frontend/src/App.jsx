import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Login from './pages/Login'
import RegisterAccount from './pages/RegisterAccount'
import Register from './pages/Register'
import Teams from './pages/Teams'
import Schedule from './pages/Schedule'
import Results from './pages/Results'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

function AppContent() {
  const { loading } = useApp()

  if (loading) return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
      <span className="text-6xl mb-4">🏏</span>
      <p className="text-white text-xl font-bold mb-6">FZ Cricket Tournament</p>
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm mt-4">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-account" element={<RegisterAccount />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/results" element={<Results />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <p className="text-6xl mb-4">🏏</p>
              <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
              <p className="text-gray-500 mb-6">Yeh page exist nahi karta.</p>
              <a href="/" className="btn-primary">Home Pe Jao</a>
            </div>
          } />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
        <Toaster position="top-center" />
      </AppProvider>
    </BrowserRouter>
  )
}
