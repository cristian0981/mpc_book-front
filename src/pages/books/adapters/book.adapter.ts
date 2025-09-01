
import type { BookApiResponse } from "@/api/types/book-api-response.interface";
import type { Book } from "@/pages/books/types/book";

export const adaptBook = (apiBook: BookApiResponse): Book => {
  return {
    id: apiBook.id,
    title: apiBook.title,
    price: parseFloat(apiBook.price),
    stock: apiBook.stock,
    publishedAt: new Date(apiBook.publishedAt),
    availability: apiBook.availability,
    imageUrl: apiBook.imageUrl,
    author: apiBook.author ? {
      id: apiBook.author.id,
      name: apiBook.author.name
    } : {
      id: '',
      name: 'Autor no disponible'
    },
    editorial: apiBook.editorial ? {
      id: apiBook.editorial.id,
      name: apiBook.editorial.name
    } : {
      id: '',
      name: 'Editorial no disponible'
    },
    genre: apiBook.genre ? {
      id: apiBook.genre.id,
      name: apiBook.genre.name
    } : {
      id: '',
      name: 'Género no disponible'
    }
  };
};