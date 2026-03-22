import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function App() {
  const [message, setMessage] = useState('')

  const fetchMessage = async () => {
    const res = await fetch('http://localhost:5000/api/hello')
    const data = await res.json()
    setMessage(data.message)
  }

  useEffect(() => { fetchMessage() }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{message}</h1>
      <Button onClick={fetchMessage}>Refresh</Button>
    </div>
  )
}