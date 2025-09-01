
import api from '@/api/axios';
import type { Book } from '../types/book';
import { 
  adaptBook,  
  adaptBooksResponse,  
  adaptBookToApi,
} from '@/pages/books/adapters';
import type { BooksResponse } from '../types/book-response';
import type { BooksApiResponse, FilterBook } from '@/api/types/book-api-response.interface';

// Obtener libros con filtros y paginación
export const getBooksWithFilters = async (filters: FilterBook = {}): Promise<BooksResponse> => {
  const params = filters;
  const response = await api.get<BooksApiResponse>('/books', { params });
  return adaptBooksResponse(response.data);
};

// Obtener todos los libros (sin filtros) - mantener compatibilidad
export const getBooks = async (): Promise<Book[]> => {
  const response = await getBooksWithFilters({ limit: 1000 }); // Obtener muchos libros
  return response.books;
};

// Obtener libro por ID
export const getBookById = async (id: string): Promise<Book> => {
  const response = await api.get(`/books/${id}`);
  return adaptBook(response.data.data);
};

// Crear libro
export const createBook = async (book: Partial<Book>): Promise<Book> => {
  const bookData = adaptBookToApi(book);
  console.log(bookData);
  
  const response = await api.post('/books', bookData);
  const createdBook = response.data.data;
  if (!createdBook.author || !createdBook.editorial || !createdBook.genre) {

    return {
      id: createdBook.id,
      title: createdBook.title,
      price: parseFloat(createdBook.price),
      stock: createdBook.stock,
      publishedAt: new Date(createdBook.publishedAt),
      availability: createdBook.availability,
      imageUrl: createdBook.imageUrl,
      author: book.author || { id: createdBook.authorId, name: '' },
      editorial: book.editorial || { id: createdBook.editorialId, name: '' },
      genre: book.genre || { id: createdBook.genreId, name: '' }
      
    };
  }
  return adaptBook(createdBook);
};

// Actualizar libro
export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
  const bookData = adaptBookToApi(book);
  const response = await api.patch(`/books/${id}`, bookData);
  return adaptBook(response.data.data);
};

// Eliminar libro
export const deleteBook = async (id: string): Promise<void> => {
  await api.delete(`/books/${id}`);
};