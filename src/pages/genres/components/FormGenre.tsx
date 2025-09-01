import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { createGenre, updateGenre, getGenreById } from "../services/genre.service";

// Esquema de validación
const genreSchema = z.object({
  name: z.string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
});

type GenreFormData = z.infer<typeof genreSchema>;

interface FormGenreProps {
  genreId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Formulario para crear y editar géneros
 * Incluye validaciones y manejo de estados
 */
export const FormGenre = ({ genreId, onClose, onSuccess }: FormGenreProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!genreId);
  const isEditMode = !!genreId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<GenreFormData>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: ""
    }
  });

  // Cargar datos del género en modo edición
  useEffect(() => {
    const loadGenre = async () => {
      if (!genreId) return;

      try {
        setInitialLoading(true);
        const genre = await getGenreById(genreId);
        setValue("name", genre.name);
      } catch (error) {
        console.error('Error al cargar el género:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadGenre();
  }, [genreId, setValue]);

  const onSubmit = async (data: GenreFormData) => {
    try {
      setLoading(true);
      
      if (isEditMode && genreId) {
        await updateGenre(genreId, data);
      } else {
        await createGenre(data);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar el género:', error);
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