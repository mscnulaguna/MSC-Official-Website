import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{message}</h1>
      <Button onClick={fetchMessage}>Refresh</Button>
    </div>
  )
}