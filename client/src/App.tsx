import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AboutPage from './pages/about'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}