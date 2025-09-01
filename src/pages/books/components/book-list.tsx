import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBooksWithFilters } from "../services/book.service";
import type { Book } from "../types/book";
import type { BooksResponse } from "../types/book-response";
import type {
  FilterBook,
  PaginationApiResponse,
} from "@/api/types/book-api-response.interface";
import { useSearchParams } from "react-router-dom";
import PaginationPage from "@/components/pagination";
import { formatPrice } from "@/utils/helpers/format-price";
import { formatDate } from "@/utils/helpers/format-date";
import { BookCard } from "./book-card";
import { ErrorState } from "./error-state";
import { EmptyState } from "./empty-state";



export function BookList() {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationApiResponse>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Estados para filtros
  const [filters, setFilters] = useState<FilterBook>({
    page: 1,
    limit: 4,
    search: "",
    availability: true,
    sortBy: "title",
    order: "ASC",
  });

  // Cargar libros
  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: BooksResponse = await getBooksWithFilters(filters);
      setBooks(response.books);
      setPagination(response.pagination);
    } catch (err) {
      setError("Error al cargar los libros");
      console.error("Error loading books:", err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para sincronizar filtros con URL
  useEffect(() => {
    const search = searchParams.get("search") ?? "";
    const availability = searchParams.get("availability");
    const sortBy = searchParams.get("sortBy") ?? "title";
    const order = searchParams.get("Order") ?? "ASC";
    const page = Number(searchParams.get("page")) || 1;
    const genreId = searchParams.get("genreId") || null;
    const authorId = searchParams.get("authorId") || null;
    const editorialId = searchParams.get("editorialId") || null;
        
  
    
    setFilters(prev => ({
      ...prev,
      search,
      availability: availability === "true" ? true : availability === "false" ? false : undefined,
      sortBy: ["title", "price", "stock", "createAt"].includes(sortBy) ? sortBy as any : "title",
      order: ["ASC", "DESC"].includes(order) ? order as any : "ASC",
      page,
      genreId: genreId || undefined,
      authorId: authorId || undefined,
      editorialId: editorialId || undefined,
    }));
  }, [searchParams]);

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }, (_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <Skeleton className="aspect-[3/2] w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Contenido principal */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState error={error} loadBooks={loadBooks} />
      ) : books.length === 0 ? (
        <EmptyState filters={filters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              formatDate={(date: string) => formatDate(new Date(date))}
              formatPrice={formatPrice}
              onBookDeleted={loadBooks}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {!loading && !error && <PaginationPage pagination={pagination} />}
    </div>
  );
}
