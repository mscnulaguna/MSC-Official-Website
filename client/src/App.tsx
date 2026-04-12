import { Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/home'
import AboutPage from '@/pages/about'
import PartnersPage from '@/pages/partners'
import LearnPage from '@/pages/learn'
import GuildJoin from '@/pages/guild-join'
import Activities from './pages/activities'
import EventDetails from '@/pages/event-details'
import Login from '@/pages/login'
import { useEffect } from 'react'
import { Footer } from "@/components/ui/layout/Footer"
import FallbackPage from "./pages/fallback/fallback-page"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') || "http://localhost:5000"

export default function App() {
  const location = useLocation()
  const hideFooterPaths = [
    '/login',
    '/coming-soon',
    '/maintenance',
    '/access-restricted',
    '/no-announcements',
  ]
  const mainRoutes = ['/', '/about', '/partners', '/learn']
  const is404 = !mainRoutes.includes(location.pathname) && 
                !location.pathname.startsWith('/learn/') &&
                !location.pathname.startsWith('/activities/') &&
                !hideFooterPaths.includes(location.pathname)
  const showFooter = !hideFooterPaths.includes(location.pathname) && !is404

  const fetchMessage = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hello`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      console.log('Backend response:', data?.message ?? data)
    } catch (error) {
      console.error('Backend connection failed:', error)
    }
  }

  useEffect(() => { fetchMessage() }, [])

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:guildId" element={<GuildJoin />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/activities/:eventId" element={<EventDetails />} />
        <Route path="/partners" element={<PartnersPage />} />

        {/* fallback demos  */}
        <Route path="/coming-soon" element={<FallbackPage type="coming-soon"/>}/>
        <Route path="/maintenance" element={<FallbackPage type="maintenance"/>}/>
        <Route path="/access-restricted" element={<FallbackPage type="access-restricted"/>}/>
        <Route path="/no-announcements" element={<FallbackPage type="no-announcements"/>}/>

        <Route path="/*" element={<FallbackPage type="404"/>}/>
      </Routes>

      {showFooter && <Footer />}
    </div>
  )
}