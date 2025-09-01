import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

/**
 * Componente que se muestra cuando no hay autores
 */
export const EmptyState = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="text-center text-muted-foreground">
        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">
          No hay autores registrados
        </p>
        <p className="text-sm mb-4">
          Comienza agregando el primer autor al sistema
        </p>
      </div>
    </CardContent>
  </Card>
);