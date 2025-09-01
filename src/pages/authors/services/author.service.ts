
import api from '@/api/axios';
import { adaptAuthorsResponse, adaptAuthor, adaptAuthorToApi } from '../adapters';
import type { Author } from '../types/author';

export class AuthorService {
    private static baseUrl = '/authors';

    static async getAuthors(): Promise<Author[]> {
        const response = await api.get(this.baseUrl);
        return adaptAuthorsResponse(response.data.data);
    }

    static async getAuthorById(id: string): Promise<Author> {
        const response = await api.get(`${this.baseUrl}/${id}`);
        return adaptAuthor(response.data.data || response.data);
    }

    static async createAuthor(author: Omit<Author, 'id'>): Promise<Author> {
        const authorData = adaptAuthorToApi(author as Author);
        const response = await api.post(this.baseUrl, authorData);
        return adaptAuthor(response.data.data || response.data);
    }

    static async updateAuthor(id: string, author: Partial<Author>): Promise<Author> {
        const authorData = adaptAuthorToApi(author as Author);
        const response = await api.patch(`${this.baseUrl}/${id}`, authorData);
        return adaptAuthor(response.data.data || response.data);
    }

    static async removeAuthor(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    static async getAuthorsForSelect(): Promise<{ value: string; label: string }[]> {
        try {
            const authors = await this.getAuthors();
            return authors.map(author => ({
                value: author.id || '',
                label: author.name
            }));
        } catch (error) {
            console.error('Error fetching authors for select:', error);
            return [];
        }
    }
}

// Funciones de conveniencia
export const getAuthors = () => AuthorService.getAuthors();
export const getAuthorById = (id: string) => AuthorService.getAuthorById(id);
export const createAuthor = (author: Omit<Author, 'id'>) => AuthorService.createAuthor(author);
export const updateAuthor = (id: string, author: Partial<Author>) => AuthorService.updateAuthor(id, author);
export const removeAuthor = (id: string) => AuthorService.removeAuthor(id);
export const getAuthorsForSelect = () => AuthorService.getAuthorsForSelect();