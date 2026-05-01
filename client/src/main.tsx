import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/authContext'
import AppLayout from './layout.tsx'
import './globals.css'
import App from './App.tsx'
import { EventsProvider } from '@/context/eventsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <EventsProvider>
            <AppLayout>
              <App />
            </AppLayout>
          </EventsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
