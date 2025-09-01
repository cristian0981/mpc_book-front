

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthorList } from "./components/author-list";
import { FormAuthor } from "./components/form-author";


/**
 * Componente principal para la gestión de autores
 * Proporciona una interfaz completa para operaciones CRUD
 */
export default function Author() {
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);

  const handleNewAuthor = () => {
    setEditingAuthor(null);
    setShowForm(true);
  };

  const handleEditAuthor = (authorId: string) => {
    setEditingAuthor(authorId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAuthor(null);
  };

  if (showForm) {
    return (
      <FormAuthor
        authorId={editingAuthor}
        onClose={handleCloseForm}
        onSuccess={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Autores</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona la información de los autores
          </p>
        </div>
        <Button
          onClick={handleNewAuthor}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Autor
        </Button>
      </div>
      <AuthorList onEditAuthor={handleEditAuthor} />
    </div>
  );
}