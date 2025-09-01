import z from "zod";

const bookSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").min(3, "El título debe tener al menos 3 caracteres"),
  price: z.number().min(0.01, "El precio debe ser mayor a 0"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  publishedAt: z.string().min(1, "La fecha de publicación es obligatoria"),
  availability: z.boolean(),
  authorId: z.string().min(1, "Debe seleccionar un autor"),
  editorialId: z.string().min(1, "Debe seleccionar una editorial"),
  genreId: z.string().min(1, "Debe seleccionar un género"),
  imageUrl: z.instanceof(File).optional().or(z.literal(undefined))
});
 export { bookSchema };
 export type BookSchema = z.infer<typeof bookSchema>;