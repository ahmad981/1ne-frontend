import { useEffect } from 'react'
import { Router } from './routes'
import { Toastbar } from './components/shared/Toastbar'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  useEffect(() => {
    // Debug: Log that App component is rendering
    console.log('[App] Component rendered')
  }, [])

  return (
    <ErrorBoundary>
      <Router />
      <Toastbar />
    </ErrorBoundary>
  )
}

export default App

