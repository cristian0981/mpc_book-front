import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

/**
 * Componente que se muestra cuando ocurre un error
 */
export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
        <p className="text-lg font-medium mb-2 text-destructive">
          Error al cargar los autores
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {error}
        </p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </div>
    </CardContent>
  </Card>
);