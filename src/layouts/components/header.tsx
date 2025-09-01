
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Book, LogOut, MenuIcon, User } from "lucide-react"

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="ghost" size="sm" onClick={onMenuToggle} className="md:hidden p-2">
            <MenuIcon className="h-5 w-5" />
          </Button>

          <div className="p-2 md:p-3 bg-primary rounded-lg">
            <Book className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground">CMPC Libros</h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Sistema de Inventario</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{user?.name}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2 border-border hover:bg-muted bg-transparent text-xs md:text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
            <span className="sm:hidden">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
