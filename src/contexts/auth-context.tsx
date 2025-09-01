
import { LoginRequest, RegisterRequest, LogoutRequest } from "@/services/auth.service"
import type { Login } from "@/types/login"
import type { Register } from "@/types/register"
import type { AuthResponse } from "@/types/response-auth"
import type { User } from "@/types/user"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (login: Login) => Promise<AuthResponse | null>
  register: (register: Register) => Promise<AuthResponse | null>
  logout: (userId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user_data")

    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem("user_data")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true)

    const userData = await LoginRequest({ email, password })
    console.log(userData);

    if (userData) {
      localStorage.setItem("user_data", JSON.stringify(userData))
      setUser(userData.user)
    }

    setIsLoading(false)
    return userData
  }

  const registerUser = async (registerData: Register): Promise<AuthResponse | null> => {
    try {
      setIsLoading(true)
      const response = await RegisterRequest(registerData)
      
      if (response.user) {
        setUser(response.user)
        localStorage.setItem('user_data', JSON.stringify(response))
      }
      
      return response
    } catch (error) {
      console.error('Error en registro:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      
      // Si tenemos un usuario, hacer logout en el backend
      if (user?.id) {
        await LogoutRequest(user.id)
      }
      
      // Limpiar datos locales
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
      setUser(null)
      
      console.log('Logout exitoso')
    } catch (error) {
      console.error('Error durante logout:', error)
      // Aún así limpiar datos locales en caso de error
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: ({ email, password }: Login) => login(email, password),
        register: registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
