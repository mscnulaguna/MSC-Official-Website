import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from '@/hooks/useToast'
import { ThemeProvider } from '@/context/ThemeContext'
import AppLayout from './layout.tsx'
import './globals.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AppLayout>
          <App />
        </AppLayout>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
