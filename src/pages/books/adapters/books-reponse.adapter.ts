import type { BooksApiResponse } from "@/api/types/book-api-response.interface";
import type { BooksResponse } from "../types/book-response";
import { adaptBook } from "./book.adapter";



export const adaptBooksResponse = (apiResponse: BooksApiResponse): BooksResponse => {
  return {
    books: apiResponse.data.data.map(adaptBook),
    pagination: {
      page: apiResponse.data.pagination.page,
      limit: apiResponse.data.pagination.limit,
      total: apiResponse.data.pagination.total,
      totalPages: apiResponse.data.pagination.totalPages,
      hasNext: apiResponse.data.pagination.hasNext,
      hasPrev: apiResponse.data.pagination.hasPrev
    }
  };
};
