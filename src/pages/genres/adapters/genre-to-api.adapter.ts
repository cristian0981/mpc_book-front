import type { GenreApiResponse } from "@/api/types/genre-api-response.interface";
import type { Genre } from "../types/genre";

export const adaptGenreToApi = (genre: Genre): Partial<GenreApiResponse> => {
    return {
        id: genre.id,
        name: genre.name
    };
};