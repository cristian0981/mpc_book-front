import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "./ui/pagination";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import type { PaginationApiResponse } from "@/api/types/book-api-response.interface";

interface PaginationProps {
  pagination: PaginationApiResponse;
}

const PaginationPage = ({ pagination }: PaginationProps) => {
  const { page, totalPages } = pagination;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const getVisiblePages = () => {
    // Detectar si es móvil basado en el ancho de pantalla
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxVisiblePages = isMobile ? 3 : 10;
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // Si hay menos páginas que el máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, page - halfVisible);
      let endPage = Math.min(totalPages, page + halfVisible);
      
      // Ajustar si estamos cerca del inicio
      if (page <= halfVisible) {
        endPage = maxVisiblePages;
      }
      
      // Ajustar si estamos cerca del final
      if (page > totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 1;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button 
            variant={"outline"} 
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Atrás
          </Button>
        </PaginationItem>
        
        <div className="relative overflow-auto max-w-[5rem] md:max-w-[70rem] flex gap-[.5rem]">
          {/* Primera página si no está visible */}
          {showStartEllipsis && (
            <>
              <PaginationItem>
                <Button 
                  variant={"outline"} 
                  onClick={() => handlePageChange(1)}
                >
                  1
                </Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}
          
          {/* Páginas visibles */}
          {visiblePages.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <Button 
                variant={page === pageNumber ? "default" : "outline"} 
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            </PaginationItem>
          ))}
          
          {/* Última página si no está visible */}
          {showEndEllipsis && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <Button 
                  variant={"outline"} 
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </PaginationItem>
            </>
          )}
        </div>
        
        <PaginationItem>
          <Button 
            variant={"outline"} 
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Siguiente
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationPage;
