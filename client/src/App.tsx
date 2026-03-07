import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PartnersPage from './pages/partners'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function App() {
  const [message, setMessage] = useState('')

  const fetchMessage = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hello`, { cache: 'no-store' })
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }

      const data = await res.json()
      setMessage(data.message)
    } catch {
      setMessage('Unable to reach the server. Please make sure the server is running.')
    }
  }

  useEffect(() => { fetchMessage() }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full overflow-x-hidden">
        <Routes>
          <Route path="/partners" element={<PartnersPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}