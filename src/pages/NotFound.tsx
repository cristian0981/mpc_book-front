import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-sm text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold text-foreground">404</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Página no encontrada
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Volver atrás
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}