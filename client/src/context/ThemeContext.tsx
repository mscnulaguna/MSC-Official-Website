import { createContext, useContext, useState, ReactNode } from 'react'

/**
 * ThemeContext
 * ============
 * Provides a shared theme/dark mode state across the entire application.
 * Ensures dark mode toggles are synchronized across all components.
 */

interface ThemeContextType {
  isDarkMode: boolean
  setIsDarkMode: (isDarkMode: boolean) => void
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme Hook
 * =============
 * Access shared theme state from any component.
 * Must be used within a ThemeProvider.
 * 
 * Usage:
 * const { isDarkMode, toggleDarkMode } = useTheme()
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
