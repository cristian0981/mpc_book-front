import { Toaster } from "./components/ui/sonner"
import { AuthProvider } from "./contexts/auth-context"
import AppRouter from "./router/AppRouter"

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
  )
}

export default App