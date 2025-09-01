
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  BookOpen, 
  User, 
  Building, 
  Tag, 
  Calendar, 
  DollarSign, 
  Package 
} from "lucide-react"
import type { Book } from "../types/book";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { deleteBook } from "../services/book.service";

interface BookCardProps {
  book: Book;
  formatDate: (date: string) => string;
  formatPrice: (price: number) => string;
  onBookDeleted?: () => void;
}

export const BookCard = ({ 
  book, 
  formatDate, 
  formatPrice,
  onBookDeleted
}: BookCardProps) => {
 
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      setIsDeleting(true);
      book.id && await deleteBook(book.id);
      setIsDialogOpen(false);
      onBookDeleted?.();
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card 
      key={book.id} 
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-border hover:border-primary/50"
      onClick={() => navigate(`/books/view/${book.id}`)}
    >
      <CardContent className="pt-6">
        {/* Imagen del libro */}
        <div className="aspect-[3/2] bg-muted rounded-lg mb-4 overflow-hidden">
          {book.imageUrl ? (
            <img 
              src={book.imageUrl} 
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Información del libro */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="truncate">{book.author.name}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              <span className="truncate">{book.editorial.name}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span className="truncate">{book.genre.name}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(book.publishedAt.toString())}</span>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Precio y stock */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-primary font-semibold">
              <span>{formatPrice(book.price)}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <Package className="w-3 h-3" />
              <span className={book.stock > 0 ? 'text-green-600' : 'text-destructive'}>
                {book.stock} unidades
              </span>
            </div>
          </div>

          {/* Estado de disponibilidad */}
          <div className="flex items-center justify-between pt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              book.availability 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {book.availability ? 'Disponible' : 'No disponible'}
            </span>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="default"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  navigate(`/books/edit/${book.id}`);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Editar
              </Button>
              
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el libro 
                      "{book.title}" del sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};