import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { createAuthor, updateAuthor, getAuthorById } from "../services/author.service";

// Esquema de validación
const authorSchema = z.object({
  name: z.string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios")
});

type AuthorFormData = z.infer<typeof authorSchema>;

interface FormAuthorProps {
  authorId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Formulario para crear y editar autores
 * Incluye validaciones y manejo de estados
 */
export const FormAuthor = ({ authorId, onClose, onSuccess }: FormAuthorProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!authorId);
  const isEditMode = !!authorId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: ""
    }
  });

  // Cargar datos del autor en modo edición
  useEffect(() => {
    const loadAuthor = async () => {
      if (!authorId) return;

      try {
        setInitialLoading(true);
        const author = await getAuthorById(authorId);
        setValue("name", author.name);
      } catch (error) {
        console.error('Error al cargar el autor:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadAuthor();
  }, [authorId, setValue]);

  const onSubmit = async (data: AuthorFormData) => {
    try {
      setLoading(true);
      
      if (isEditMode && authorId) {
        await updateAuthor(authorId, data);
      } else {
        await createAuthor(data);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar el autor:', error);
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
            {isEditMode ? 'Editar Autor' : 'Nuevo Autor'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? 'Modifica la información del autor' : 'Agrega un nuevo autor al sistema'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Autor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ingresa el nombre completo del autor"
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