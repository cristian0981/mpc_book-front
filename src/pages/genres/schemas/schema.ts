import { z } from "zod";

export const genreSchema = z.object({
  name: z.string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim()
});

export type GenreSchema = z.infer<typeof genreSchema>;