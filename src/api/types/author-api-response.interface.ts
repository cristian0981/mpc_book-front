export interface AuthorApiResponse {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface AuthorsApiResponse {
    data: AuthorApiResponse[];
}