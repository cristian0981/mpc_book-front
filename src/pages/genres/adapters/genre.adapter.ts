
import type {  GenreApiResponse, GenresApiResponse } from "@/api/types/genre-api-response.interface";
import type { Genre } from "../types/genre";

export const adaptGenre = (genre: GenreApiResponse): Genre => ({
    id: genre.id,
    name: genre.name,
})

export const adaptGenres = (genres: GenresApiResponse): Genre[] => 
  genres.data.map((genre: GenreApiResponse) => adaptGenre({ 
    id: genre.id,
    name: genre.name,
    createdAt: new Date(genre.createdAt),
    updatedAt: new Date(genre.updatedAt),
    deletedAt: new Date(genre.deletedAt),
  }))


