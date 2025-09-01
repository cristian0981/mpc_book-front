

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormGenre } from "./components/FormGenre";
import { GenreList } from "./components/GenreList";



/**
 * Componente principal para la gestión de autores
 * Proporciona una interfaz completa para operaciones CRUD
 */
export default function Genre() {
  const [showForm, setShowForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<string | null>(null);

  const handleNewGenre = () => {
    setEditingGenre(null);
    setShowForm(true);
  };

  const handleEditGenre = (genreId: string) => {
    setEditingGenre(genreId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGenre(null);
  };

  if (showForm) {
    return (
      <FormGenre
        genreId={editingGenre}
        onClose={handleCloseForm}
        onSuccess={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Géneros</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona la información de los géneros
          </p>
        </div>
        <Button
          onClick={handleNewGenre}  
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Género
        </Button>
      </div>
      <GenreList onEditGenre={handleEditGenre} />   
    </div>
  );
}