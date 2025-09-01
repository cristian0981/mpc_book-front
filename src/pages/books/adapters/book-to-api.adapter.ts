import type { BookApiResponse } from "@/api/types/book-api-response.interface";
import type { Book } from "../types/book";

export const adaptBookToApi = (book: Partial<Book>): Partial<BookApiResponse> => {
  return {
    title: book.title,
    price: book.price?.toString(),
    stock: book.stock,
    publishedAt: book.publishedAt?.toISOString().split('T')[0],
    availability: book.availability,
    imageUrl: book.imageUrl,
    authorId: book.author?.id,
    editorialId: book.editorial?.id,
    genreId: book.genre?.id,
  };
};