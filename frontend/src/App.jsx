import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import { lazy, Suspense } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Teams = lazy(() => import('./pages/Teams'))
const Schedule = lazy(() => import('./pages/Schedule'))
const Results = lazy(() => import('./pages/Results'))
const Contact = lazy(() => import('./pages/Contact'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Admin = lazy(() => import('./pages/Admin'))

const PageLoader = () => (
  <div className="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center z-40">
    <span className="text-5xl mb-4">🏏</span>
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
)

function AppContent() {
  const { loading, authLoading } = useApp()

  if (loading || authLoading) return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
      <span className="text-6xl mb-4">🏏</span>
      <p className="text-white text-xl font-bold mb-6">FZ Cricket Tournament</p>
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm mt-4">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
              <p className="text-gray-500 mb-6">This page does not exist.</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
        </Suspense>
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
