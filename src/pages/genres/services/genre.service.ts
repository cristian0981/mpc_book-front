import api from "@/api/axios";
import { adaptGenre, adaptGenres } from "../adapters/genre.adapter";
import { adaptGenreToApi } from "../adapters/genre-to-api.adapter";
import type { Genre } from "../types/genre";

export class GenreService {
    private static baseUrl = '/genres';

    static async getGenres(): Promise<Genre[]> {
        const response = await api.get(this.baseUrl);
        return adaptGenres(response.data);
    }

    static async getGenreById(id: string): Promise<Genre> {
        const response = await api.get(`${this.baseUrl}/${id}`);
        return adaptGenre(response.data.data || response.data);
    }

    static async createGenre(genre: Omit<Genre, 'id'>): Promise<Genre> {
        const genreData = adaptGenreToApi(genre as Genre);
        const response = await api.post(this.baseUrl, genreData);
        return adaptGenre(response.data.data || response.data);
    }

    static async updateGenre(id: string, genre: Partial<Genre>): Promise<Genre> {
        const genreData = adaptGenreToApi(genre as Genre);
        const response = await api.patch(`${this.baseUrl}/${id}`, genreData);
        return adaptGenre(response.data.data || response.data);
    }

    static async removeGenre(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    static async getGenresForSelect(): Promise<{ value: string; label: string }[]> {
        try {
            const genres = await this.getGenres();
            return genres.map(genre => ({
                value: genre.id || '',
                label: genre.name
            }));
        } catch (error) {
            console.error('Error fetching genres for select:', error);
            return [];
        }
    }
}

// Funciones de conveniencia
export const getGenres = () => GenreService.getGenres();
export const getGenreById = (id: string) => GenreService.getGenreById(id);
export const createGenre = (genre: Omit<Genre, 'id'>) => GenreService.createGenre(genre);
export const updateGenre = (id: string, genre: Partial<Genre>) => GenreService.updateGenre(id, genre);
export const removeGenre = (id: string) => GenreService.removeGenre(id);
export const getGenresForSelect = () => GenreService.getGenresForSelect();