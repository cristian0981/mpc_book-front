import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

interface ErrorStateProps {
  error: string;
  loadBooks: () => void;
}
  // Componente de error
  export const ErrorState = ({ error, loadBooks }: ErrorStateProps) => {
return <Card className="border-destructive">
      <CardContent className="pt-6">
        <div className="text-center text-destructive">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Error al cargar libros</p>
          <p className="text-sm">{error}</p>
          <Button onClick={loadBooks} variant="outline" className="mt-4">
            Reintentar
          </Button>
        </div>
      </CardContent>
    </Card>
  }
    
