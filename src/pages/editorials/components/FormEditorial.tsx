import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { createEditorial, updateEditorial, getEditorialById } from "../services/editorial.service";
import { editorialSchema } from "../schemas/schema";



type EditorialFormData = z.infer<typeof editorialSchema>;

interface FormEditorialProps {
  editorialId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Formulario para crear y editar editoriales
 * Incluye validaciones y manejo de estados
 */
export const FormEditorial = ({ editorialId, onClose, onSuccess }: FormEditorialProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editorialId);
  const isEditMode = !!editorialId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditorialFormData>({
    resolver: zodResolver(editorialSchema),
    defaultValues: {
      name: ""
    }
  });

  // Cargar datos de la editorial en modo edición
  useEffect(() => {
    const loadEditorial = async () => {
      if (!editorialId) return;

      try {
        setInitialLoading(true);
        const editorial = await getEditorialById(editorialId);
        setValue("name", editorial.name);
      } catch (error) {
        console.error('Error al cargar la editorial:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadEditorial();
  }, [editorialId, setValue]);

  const onSubmit = async (data: EditorialFormData) => {
    try {
      setLoading(true);
      
      if (isEditMode && editorialId) {
        await updateEditorial(editorialId, data);
      } else {
        await createEditorial(data);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar la editorial:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cargando...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditMode ? 'Editar Género' : 'Nuevo Género'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? 'Modifica la información del género' : 'Agrega un nuevo género al sistema'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Género</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del género *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ingresa el nombre del género"
                className={errors.name ? "border-red-500" : "border-primary"}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};