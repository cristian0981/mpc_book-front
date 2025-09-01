import { Filter } from "@/components/filter";
import { BookList } from "./components/book-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Book() {
  const navigate = useNavigate();

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Libros</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tu colección de libros
            </p>
          </div>
          <Button
            onClick={() => navigate("/books/new")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Libro
          </Button>
        </div>
        <Filter />
        <BookList />
      </div>
    </>
  );
}
