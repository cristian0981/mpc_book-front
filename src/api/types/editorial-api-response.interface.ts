export interface EditorialApiResponse {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface EditorialsApiResponse {
    data: EditorialApiResponse[];
}