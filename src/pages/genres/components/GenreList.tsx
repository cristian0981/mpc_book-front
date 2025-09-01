import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Genre } from "../types/genre";
import { getGenres } from "../services/genre.service";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { GenreCard } from "./GenreCard";


interface GenreListProps {
  onEditGenre: (genreId: string) => void;
}

/**
 * Componente que muestra la lista de autores en formato de tarjetas
 * Incluye estados de carga, error y lista vacía
 */
export const GenreList = ({ onEditGenre }: GenreListProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const genresData = await getGenres();
      setGenres(genresData);
    } catch (err) {
      setError('Error al cargar los géneros');
      console.error('Error loading genres:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();   
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
        <ErrorState error={error} onRetry={loadGenres} />
      ) : genres.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {genres.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              onEdit={() => genre.id && onEditGenre(genre.id)}
              onDelete={loadGenres}
            />
          ))}
        </div>
      )}
    </div>
  );
};