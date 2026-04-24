import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
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

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
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
        <Toaster position="top-center" />
      </AppProvider>
    </BrowserRouter>
  )
}
