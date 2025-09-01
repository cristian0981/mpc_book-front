import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import type { Editorial } from "../types/editorial";
import { getEditorials } from "../services/editorial.service";
import { EditorialCard } from "./EditorialCard";


interface EditorialListProps {
  onEditEditorial: (editorialId: string) => void;
}

/**
 * Componente que muestra la lista de editoriales en formato de tarjetas
 * Incluye estados de carga, error y lista vacía
 */
export const EditorialList = ({ onEditEditorial }: EditorialListProps) => {
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEditorials = async () => {
    try {
      setLoading(true);
      setError(null);
      const editorialsData = await getEditorials();
      setEditorials(editorialsData);
    } catch (err) {
      setError('Error al cargar las editoriales');
      console.error('Error loading editorials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEditorials();   
  }, []);

  // Componente de esqueleto para estado de carga
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={loadEditorials} />
      ) : editorials.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {editorials.map((editorial) => (
            <EditorialCard
              key={editorial.id}
              editorial={editorial}
              onEdit={() => editorial.id && onEditEditorial(editorial.id)}
              onDelete={loadEditorials} 
            />
          ))}
        </div>
      )}
    </div>
  );
};