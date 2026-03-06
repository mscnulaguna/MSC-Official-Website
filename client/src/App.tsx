import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PartnersPage from './pages/partners'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/partners" element={<PartnersPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}