import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { getGenresForSelect } from "@/pages/genres/services/genre.service";
import { getAuthorsForSelect } from "@/pages/authors/services/author.service";
import { getEditorialsForSelect } from "@/pages/editorials/services/editorial.service";
import type { Book } from "../types/book";
import { createBook, updateBook, getBookById } from "../services/book.service";
import { uploadBookImage} from "@/services/file.service";
import { bookSchema, type BookSchema } from "../schemas/schema";
import { useParams } from "react-router-dom";

interface SelectOption {
  value: string;
  label: string;
}

interface NewBookProps {
  book?: Book; // Prop opcional para modo edición
}

export default function NewBook({ book }: NewBookProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const [genres, setGenres] = useState<SelectOption[]>([]);
  const [authors, setAuthors] = useState<SelectOption[]>([]);
  const [editorials, setEditorials] = useState<SelectOption[]>([]);
  const [loadingSelects, setLoadingSelects] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentBook, setCurrentBook] = useState<Book | undefined>(book);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  // Determinar si estamos en modo edición
  const isEditMode = !!currentBook || !!id;
  
  const currentSchema = bookSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookSchema>({
    resolver: zodResolver(currentSchema) as Resolver<BookSchema>,
    defaultValues: {
      title: "",
      price: undefined,
      stock: undefined, // Cambiado de 0 a undefined para que esté vacío
      publishedAt: new Date().toISOString().split('T')[0],
      availability: true,
      authorId: "",
      editorialId: "",
      genreId: "",
      imageUrl: undefined
    }
  });

  const watchedImageFile = watch("imageUrl");

  // Cargar datos del libro por ID cuando estamos en modo edición
  useEffect(() => {
    const loadBookData = async () => {
      if (id && !currentBook) {
        try {
          setLoadingBook(true);
          setError(null);
          const bookData = await getBookById(id);
          setCurrentBook(bookData);
        } catch (error: any) {
          setError("Error al cargar los datos del libro");
        } finally {
          setLoadingBook(false);
        }
      }
    };

    loadBookData();
  }, [id, currentBook]);

  // Sincronizar formulario con datos del libro cargado
  useEffect(() => {
    if (currentBook) {
      reset({
        title: currentBook.title || "",
        price: currentBook.price || 0,
        stock: currentBook.stock || 0,
        publishedAt: currentBook.publishedAt 
          ? currentBook.publishedAt.toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0],
        availability: currentBook.availability ?? true,
        authorId: currentBook.author?.id || "",
        editorialId: currentBook.editorial?.id || "",
        genreId: currentBook.genre?.id || "",
        imageUrl: undefined
      });

      // Establecer imagen preview si existe
      if (currentBook.imageUrl) {
        setImagePreview(currentBook.imageUrl);
      }
    }
  }, [currentBook, reset]);

  // Cargar datos para los selects
  useEffect(() => {
    const loadSelectData = async () => {
      try {
        setLoadingSelects(true);
        const [genresData, authorsData, editorialsData] = await Promise.all([
          getGenresForSelect(),
          getAuthorsForSelect(),
          getEditorialsForSelect()
        ]);
        
        setGenres(genresData);
        setAuthors(authorsData);
        setEditorials(editorialsData);
      } catch (error) {
        console.error("Error loading select data:", error);
      } finally {
        setLoadingSelects(false);
      }
    };

    loadSelectData();
  }, []);

  // Manejar preview de imagen
  useEffect(() => {
    if (watchedImageFile && watchedImageFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(watchedImageFile);
    }
  }, [watchedImageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("imageUrl", file);
    }
  };

  const removeImage = () => {
    setValue("imageUrl", undefined);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCardClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (data: BookSchema) => {
    setLoading(true);
      // Encontrar los objetos completos para author, editorial y genre
      const selectedAuthor = authors.find(a => a.value === data.authorId);
      const selectedEditorial = editorials.find(e => e.value === data.editorialId);
      const selectedGenre = genres.find(g => g.value === data.genreId);

      if (!selectedAuthor || !selectedEditorial || !selectedGenre) {
        throw new Error("Error al obtener los datos seleccionados");
      }

      let imageUrl = isEditMode ? currentBook?.imageUrl : undefined;
      
      // Subir imagen si existe una nueva
      if (data.imageUrl instanceof File) {

          const uploadResponse = await uploadBookImage(data.imageUrl);
          imageUrl = uploadResponse.secureUrl;
      }

      const bookData: Partial<Book> = {
        title: data.title,
        price: data.price,
        stock: data.stock,
        publishedAt: new Date(data.publishedAt),
        availability: data.availability,
        author: {
          id: selectedAuthor.value,
          name: selectedAuthor.label
        },
        editorial: {
          id: selectedEditorial.value,
          name: selectedEditorial.label
        },
        genre: {
          id: selectedGenre.value,
          name: selectedGenre.label
        },
        imageUrl: imageUrl
      };

      if (isEditMode && currentBook?.id) {
        await updateBook(currentBook.id, bookData);
      } else {
        await createBook(bookData);
      }
      
      navigate("/books");
  };

  // Mostrar estado de carga mientras se obtienen los datos del libro
  if (loadingBook) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/books")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Cargando libro...
            </h1>
            <p className="text-muted-foreground mt-1">
              Obteniendo información del libro
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mostrar error si no se pudo cargar el libro
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/books")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Error
            </h1>
            <p className="text-muted-foreground mt-1">
              {error}
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Intentar de nuevo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/books")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditMode ? 'Editar Libro' : 'Nuevo Libro'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? 'Modifica la información del libro' : 'Agrega un nuevo libro a tu colección'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Libro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Título del libro"
                  className={errors.title ? "border-red-500" : "border-primary w-full"}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Fecha de Publicación *</Label>
                <Input
                  id="publishedAt"
                  type="date"
                  {...register("publishedAt")}
                  className={errors.publishedAt ? "border-red-500" : "border-primary w-full"}
                />
                {errors.publishedAt && (
                  <p className="text-sm text-red-500">{errors.publishedAt.message}</p>
                )}
              </div>
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="text"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className={errors.price ? "border-red-500" : "border-primary w-full"}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="text"
                  {...register("stock", { valueAsNumber: true })}
                  placeholder="0"
                  className={errors.stock ? "border-red-500" : "border-primary w-full"}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Selects para Author, Editorial y Genre */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Autor *</Label>
                <Select
                  disabled={loadingSelects}
                  value={watch("authorId")}
                  onValueChange={(value) => setValue("authorId", value)}
                >
                  <SelectTrigger className={errors.authorId ? "border-red-500" : "border-primary w-full"}>
                    <SelectValue placeholder={loadingSelects ? "Cargando..." : "Seleccionar autor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author.value} value={author.value}>
                        {author.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.authorId && (
                  <p className="text-sm text-red-500">{errors.authorId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Editorial *</Label>
                <Select
                  disabled={loadingSelects}
                  value={watch("editorialId")}
                  onValueChange={(value) => setValue("editorialId", value)}
                >
       <SelectTrigger className={errors.authorId ? "border-red-500" : "border-primary w-full"}>
                    <SelectValue placeholder={loadingSelects ? "Cargando..." : "Seleccionar editorial"} />
                  </SelectTrigger>
                  <SelectContent>
                    {editorials.map((editorial) => (
                      <SelectItem key={editorial.value} value={editorial.value}>
                        {editorial.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.editorialId && (
                  <p className="text-sm text-red-500">{errors.editorialId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Género *</Label>
                <Select
                  disabled={loadingSelects}
                  value={watch("genreId")}
                  onValueChange={(value) => setValue("genreId", value)}
                >
                 <SelectTrigger className={errors.authorId ? "border-red-500" : "border-primary w-full"}>
                    <SelectValue placeholder={loadingSelects ? "Cargando..." : "Seleccionar género"} />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genreId && (
                  <p className="text-sm text-red-500">{errors.genreId.message}</p>
                )}
              </div>
            </div>

            {/* Campo de imagen */}
            <div className="space-y-2">
              <Label>Imagen del Libro</Label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors relative"
                onClick={handleCardClick}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-lg mx-auto"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Arrastra una imagen aquí o haz clic para seleccionar
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF hasta 5MB
                      </p>
                    </div>
                  </div>
                )}
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availability"
                checked={watch("availability")} // Usar checked en lugar de defaultChecked
                onCheckedChange={(checked) => setValue("availability", !!checked)} // Manejar cambios manualmente
              />
              <Label htmlFor="availability">Libro disponible</Label>
            </div>
            
            {/* Botones actualizados */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/books")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || loadingSelects}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? (isEditMode ? "Actualizando..." : "Guardando...") : (isEditMode ? "Actualizar Libro" : "Guardar Libro")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}