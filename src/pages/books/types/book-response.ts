import type { PaginationApiResponse } from "@/api/types/book-api-response.interface";
import type { Book } from "./book";

export interface BooksResponse {
  books: Book[];
  pagination: PaginationApiResponse;
}