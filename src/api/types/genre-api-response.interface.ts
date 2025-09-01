


export interface GenreApiResponse {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

// Respuesta simple de la API (array directo)
export interface GenresApiResponse {
    data: GenreApiResponse[];
}