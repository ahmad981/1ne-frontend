import { Router } from './routes'
import { Toastbar } from './components/shared/Toastbar'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Router />
      <Toastbar />
    </ErrorBoundary>
  )
}

export default App

