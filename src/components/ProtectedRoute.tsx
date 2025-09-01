import { useAuth } from "@/contexts/auth-context"
import { Navigate, Outlet } from "react-router-dom"
import { type ReactNode } from "react"

interface ProtectedRouteProps {
  children?: ReactNode
  redirectTo?: string
  requireAuth?: boolean // true = requiere autenticación, false = requiere NO estar autenticado
}

export function ProtectedRoute({ 
  children, 
  redirectTo = "/", 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children ? children : <Outlet />
}