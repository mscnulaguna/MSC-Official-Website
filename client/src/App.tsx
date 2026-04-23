import { Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/public/home'
import AboutPage from '@/pages/public/about'
import PartnersPage from '@/pages/public/partners'
import LearnPage from '@/pages/public/learn'
import GuildJoin from '@/pages/public/guild-join'
import Activities from './pages/public/activities'
import EventDetails from '@/pages/public/event-details'
import Login from '@/pages/public/login'
import { useEffect } from 'react'
import { Footer } from "@/components/ui/layout/Footer"
import FallbackPage from "./pages/fallback/fallback-page"
<<<<<<< HEAD
import ProfilePage from "@/pages/profile"
import MembersPage from "@/pages/admin/members"
import CreateNewEventPage from "@/pages/admin/create-event"
=======
import ProfilePage from "@/pages/public/profile"
>>>>>>> dev
import { sampleMember } from '@/data/mockMember'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') || "http://localhost:5000"

const FOOTER_HIDE_PATHS = new Set([
  '/login',
  '/admin/members',
  '/admin/create-event',
  '/coming-soon',
  '/maintenance',
  '/access-restricted',
  '/no-announcements',
  '/something-went-wrong',
])

const KNOWN_PATHS = new Set([
  '/',
  '/about',
  '/learn',
  '/activities',
  '/partners',
  '/login',
  '/profile',
  '/admin/members',
  '/admin/create-event',
  '/coming-soon',
  '/maintenance',
  '/access-restricted',
  '/no-announcements',
  '/something-went-wrong',
])

export default function App() {
  const location = useLocation()
  
  const isDynamicKnown = /^\/activities\/[^/]+$/.test(location.pathname)
  const isKnownPath = KNOWN_PATHS.has(location.pathname) || isDynamicKnown

  const showFooter = !FOOTER_HIDE_PATHS.has(location.pathname) && isKnownPath

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
        <Route path='/profile' element={<ProfilePage member={sampleMember}/>} />
        <Route path='/admin/members' element={<MembersPage />} />
        <Route path='/admin/create-event' element={<CreateNewEventPage />} />

        {/* fallback demos  */}
        <Route path="/coming-soon"         element={<FallbackPage type="coming-soon" />} />
        <Route path="/maintenance"         element={<FallbackPage type="maintenance" />} />
        <Route path="/access-restricted"   element={<FallbackPage type="access-restricted" />} />
        <Route path="/no-announcements"    element={<FallbackPage type="no-announcements" />} />
        <Route path="/something-went-wrong" element={<FallbackPage type="something-went-wrong" />} />
 
        <Route path="*" element={<FallbackPage type="404" />} />
      </Routes>

      {showFooter && <Footer />}
    </div>
  )
}