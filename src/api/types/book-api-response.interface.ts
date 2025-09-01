// Tipos para la respuesta de la API
export interface BookApiResponse {
  id: string;
  title: string;
  authorId: string;
  editorialId: string;
  genreId: string;
  price: string;
  availability: boolean;
  imageUrl: string;
  createdBy: string;
  updatedBy: string | null;
  deletedBy: string | null;
  stock: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  author: {
    id: string;
    name: string;
  };
  editorial: {
    id: string;
    name: string;
  };
  genre: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    email: string;
  };
  updater: {
    id: string;
    email: string;
  } | null;
  deleter: {
    id: string;
    email: string;
  } | null;
}

export interface PaginationApiResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BooksApiResponse {
  statusCode: number;
  data: {
    data: BookApiResponse[];
    pagination: PaginationApiResponse;
  };
}

// Tipos para filtros de la API
export interface FilterBook {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: string;
  genreId?: string;
  editorialId?: string;
  availability?: boolean;
  sortBy?: 'title' | 'price' | 'stock' | 'createAt';
  order?: 'ASC' | 'DESC';
}