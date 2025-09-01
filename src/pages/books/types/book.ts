import type { Author } from "@/pages/authors/types/author";
import type { Editorial } from "@/pages/editorials/types/editorial";
import type { Genre } from "@/pages/genres/types/genre";

export interface Book {
  id?: string;
  title: string;
  publishedAt: Date;
  availability: boolean;
  price: number;
  stock: number;
  author: Author;
  editorial: Editorial;
  genre: Genre;
  imageUrl?: string;
}
