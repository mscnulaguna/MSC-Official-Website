import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/home'
import AboutPage from './pages/about'
import PartnersPage from './pages/partners'
import { useEffect } from 'react'
import { Footer } from "@/components/ui/layout/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function App() {
  const fetchMessage = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hello`, { cache: 'no-store' })
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }

      await res.json()
    } catch {
      // Error fetching message
    }
  }

  useEffect(() => { fetchMessage() }, [])

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/partners" element={<PartnersPage />} />
      </Routes>

      <Footer />
    </div>
  )
}