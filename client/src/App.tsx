import { Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/home'
import AboutPage from '@/pages/about'
import PartnersPage from '@/pages/partners'
import Activities from './pages/activities'
import EventDetails from '@/pages/event-details'
import Login from '@/pages/login'
import { useEffect } from 'react'
import { Footer } from "@/components/ui/layout/Footer"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function App() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  const fetchMessage = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hello`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      await res.json()
    } catch {
      // Error fetching message
    }
  }

  useEffect(() => { fetchMessage() }, [])

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/activities/:eventId" element={<EventDetails />} />
        <Route path="/partners" element={<PartnersPage />} />
      </Routes>

      {!isLogin && <Footer />}
    </div>
  )
}