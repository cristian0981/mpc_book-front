import { FilterInput } from "./input-filter";
import { SelectFilter } from "./select-filter";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { RotateCcw, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { getGenresForSelect } from "@/pages/genres/services/genre.service";
import { getAuthorsForSelect } from "@/pages/authors/services/author.service";
import { getEditorialsForSelect } from "@/pages/editorials/services/editorial.service";
import { getBooksWithFilters } from "@/pages/books/services/book.service";
import type { FilterBook } from "@/api/types/book-api-response.interface";
import type { Book } from "@/pages/books/types/book";
import { toast } from "sonner";

export const Filter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [genres, setGenres] = useState<{ value: string; label: string }[]>([]);
  const [authors, setAuthors] = useState<{ value: string; label: string }[]>([]); 
  const [editorials, setEditorials] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingCSV, setExportingCSV] = useState(false);

  const handleResetFilters = () => {
    navigate(location.pathname);
  };

  // Función para exportar a CSV
  const handleExportCSV = async () => {
    try {
      setExportingCSV(true);
      
      // Obtener filtros actuales de la URL
      const currentFilters: FilterBook = {
        search: searchParams.get('search') || undefined,
        authorId: searchParams.get('authorId') || undefined,
        genreId: searchParams.get('genreId') || undefined,
        editorialId: searchParams.get('editorialId') || undefined,
        availability: searchParams.get('availability') ? searchParams.get('availability') === 'true' : undefined,
        sortBy: (searchParams.get('sortBy') as 'title' | 'price' | 'stock' | 'createAt') || 'title',
        order: (searchParams.get('Order') as 'ASC' | 'DESC') || undefined,
        limit: 10, // Obtener todos los libros para exportar
      };

      // Obtener todos los libros con los filtros aplicados
      const response = await getBooksWithFilters(currentFilters);
      const books = response.books;

      if (books.length === 0) {
        toast.info('No hay datos para exportar con los filtros aplicados.');
        return;
      }

      // Convertir datos a CSV
      const csvContent = convertBooksToCSV(books);
      
      // Crear y descargar archivo
      downloadCSV(csvContent, 'libros_export.csv');
      
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('Error al exportar los datos. Por favor, inténtalo de nuevo.');
    } finally {
      setExportingCSV(false);
    }
  };

  // Función para convertir libros a formato CSV
  const convertBooksToCSV = (books: Book[]): string => {
    const headers = [
      'ID',
      'Título',
      'Autor',
      'Editorial', 
      'Género',
      'Precio',
      'Stock',
      'Fecha de Publicación',
      'Disponibilidad',
      'URL de Imagen'
    ];

    const csvRows = [
      headers.join(','), // Encabezados
      ...books.map(book => [
        book.id || '',
        `"${book.title.replace(/"/g, '""')}"`, // Escapar comillas
        `"${book.author.name.replace(/"/g, '""')}"`,
        `"${book.editorial.name.replace(/"/g, '""')}"`,
        `"${book.genre.name.replace(/"/g, '""')}"`,
        book.price.toString(),
        book.stock.toString(),
        book.publishedAt.toISOString().split('T')[0], // Formato YYYY-MM-DD
        book.availability ? 'Disponible' : 'No disponible',
        book.imageUrl || ''
      ].join(','))
    ];

    return csvRows.join('\n');
  };

  // Función para descargar el archivo CSV
  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const genresFetch = async () => {
    try {
      setLoading(true);
      const genresSelect = await getGenresForSelect();
      if (genresSelect) {
        setGenres(genresSelect);
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
      setGenres([]); 
    } finally {
      setLoading(false);
    }
  }

  const authorsFetch = async () => {
    try {
      setLoading(true);
      const authorsSelect = await getAuthorsForSelect();
      if (authorsSelect) {
        setAuthors(authorsSelect);
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
      setAuthors([]); 
    } finally {
      setLoading(false);
    }
  }

  const editorialsFetch = async () => {
    try {
      setLoading(true);
      const editorialsSelect = await getEditorialsForSelect();
      if (editorialsSelect) {
        setEditorials(editorialsSelect);
      }
    } catch (error) {
      console.error("Error fetching editorials:", error);
      setEditorials([]); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    genresFetch();
    authorsFetch();
    editorialsFetch();
  }, []);

  return (
    <Card >
      <CardHeader>
        <CardTitle>Filtrar libros</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <FilterInput filterKey="search" placeholder="Buscar libros..." />
            </div>
            <div className="flex-1">
              <SelectFilter
                filterKey="authorId"
                options={loading ? [] : authors}
                placeholder="Seleccionar autor"
                defaultLabel="Todos los autores"
              />
            </div>
          <div className="flex-1">
              <SelectFilter
                filterKey="genreId"
                options={loading ? [] : genres} // Usar los géneros dinámicos
                placeholder={loading ? "Cargando géneros..." : "Seleccionar género"}
                defaultLabel="Todos los géneros"
              />
            </div>
            <div className="flex-1">
              <SelectFilter
                filterKey="editorialId"
                options={loading ? [] : editorials}
                placeholder="Seleccionar editorial"
                defaultLabel="Todos los editores"
              />
            </div>

            <div className="flex-1">
              <SelectFilter
                filterKey="availability"
                options={[
                  { value: "true", label: "Disponible" },
                  { value: "false", label: "No disponible" },
                ]}
                placeholder="Seleccionar disponibilidad"
                defaultLabel="Todos los libros"
              />
            </div>

            <div className="flex-1">
              <SelectFilter
                filterKey="sortBy"
                options={[
                  { value: "title", label: "Título" },
                  { value: "price", label: "Precio" },
                  { value: "stock", label: "Cantidad" },
                  { value: "createdAt", label: "Fecha de registro" },
                  { value: "availability", label: "Disponibilidad" },
                ]}
                placeholder="Seleccionar orden"
                defaultLabel="Selecciona el orden"
              />
            </div>
            <div className="flex-1">
              <SelectFilter
                filterKey="Order"
                options={[
                  { value: "ASC", label: "Ascendente" },
                  { value: "DESC", label: "Descendente" },
                ]}
                placeholder="Seleccionar orden"
                defaultLabel="Selecciona el orden"
              />
            </div>

            {/* Botones de acción */}
            <div className="flex items-end gap-2">
              {/* Botón para exportar CSV */}
              <Button
                variant="default"
                onClick={handleExportCSV}
                disabled={exportingCSV}
                className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white"
                title="Exportar datos a CSV"
              >
                <Download className="h-4 w-4 mr-2" />
                {exportingCSV ? 'Exportando...' : 'Exportar CSV'}
              </Button>
              
              {/* Botón para resetear filtros */}
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="h-10 px-4"
                title="Resetear filtros"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetear
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
