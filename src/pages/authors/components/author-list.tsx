import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthors } from "../services/author.service";
import type { Author } from "../types/author";
import { ErrorState } from "./error-state";
import { EmptyState } from "./empty-state";
import { AuthorCard } from "./author-card";

interface AuthorListProps {
  onEditAuthor: (authorId: string) => void;
}

/**
 * Componente que muestra la lista de autores en formato de tarjetas
 * Incluye estados de carga, error y lista vacía
 */
export const AuthorList = ({ onEditAuthor }: AuthorListProps) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const authorsData = await getAuthors();
      setAuthors(authorsData);
    } catch (err) {
      setError('Error al cargar los autores');
      console.error('Error loading authors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
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
        <ErrorState error={error} onRetry={loadAuthors} />
      ) : authors.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {authors.map((author) => (
            <AuthorCard
              key={author.id}
              author={author}
              onEdit={() => author.id && onEditAuthor(author.id)}
              onDeleted={loadAuthors}
            />
          ))}
        </div>
      )}
    </div>
  );
};