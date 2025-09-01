

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorialList } from "./components/EditorialList";
import { FormEditorial } from "./components/FormEditorial";


/**
 * Componente principal para la gestión de editoriales
 * Proporciona una interfaz completa para operaciones CRUD
 */
export default function Editorial() {
  const [showForm, setShowForm] = useState(false);
  const [editingEditorial, setEditingEditorial] = useState<string | null>(null);

  const handleNewEditorial = () => {
    setEditingEditorial(null);
    setShowForm(true);
  };

  const handleEditEditorial = (editorialId: string) => {
    setEditingEditorial(editorialId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEditorial(null);
  };

  if (showForm) {
    return (
      <FormEditorial
        editorialId={editingEditorial}
        onClose={handleCloseForm}
        onSuccess={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editoriales</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona la información de las editoriales  
          </p>
        </div>
        <Button
          onClick={handleNewEditorial}  
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Editorial
        </Button>
      </div>
      <EditorialList onEditEditorial={handleEditEditorial} />   
    </div>
  );
}