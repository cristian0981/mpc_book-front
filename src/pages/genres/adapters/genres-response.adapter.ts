import type { GenreApiResponse } from "@/api/types/genre-api-response.interface";
import type { Genre } from "../types/genre";
import { adaptGenres } from "./genre.adapter";


export const adaptGenresResponse = (genresApiResponse: GenreApiResponse[]): Genre[] => {
    return adaptGenres({ data: genresApiResponse });
};
