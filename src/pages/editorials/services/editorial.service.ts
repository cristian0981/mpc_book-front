
import api from '@/api/axios';
import { adaptEditorialsResponse, adaptEditorial, adaptEditorialToApi } from '../adapters';
import type { Editorial } from '../types/editorial';

export class EditorialService {
    private static baseUrl = '/editorials';

    static async getEditorials(): Promise<Editorial[]> {
        const response = await api.get(this.baseUrl);
        return adaptEditorialsResponse(response.data.data);
    }

    static async getEditorialById(id: string): Promise<Editorial> {
        const response = await api.get(`${this.baseUrl}/${id}`);
        return adaptEditorial(response.data.data || response.data);
    }

    static async createEditorial(editorial: Omit<Editorial, 'id'>): Promise<Editorial> {
        const editorialData = adaptEditorialToApi(editorial as Editorial);
        const response = await api.post(this.baseUrl, editorialData);
        return adaptEditorial(response.data.data || response.data);
    }

    static async updateEditorial(id: string, editorial: Partial<Editorial>): Promise<Editorial> {
        const editorialData = adaptEditorialToApi(editorial as Editorial);
        const response = await api.patch(`${this.baseUrl}/${id}`, editorialData);
        return adaptEditorial(response.data.data || response.data);
    }

    static async removeEditorial(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    static async getEditorialsForSelect(): Promise<{ value: string; label: string }[]> {
        try {
            const editorials = await this.getEditorials();
            return editorials.map(editorial => ({
                value: editorial.id || '',
                label: editorial.name
            }));
        } catch (error) {
            console.error('Error fetching editorials for select:', error);
            return [];
        }
    }
}

// Funciones de conveniencia
export const getEditorials = () => EditorialService.getEditorials();
export const getEditorialById = (id: string) => EditorialService.getEditorialById(id);
export const createEditorial = (editorial: Omit<Editorial, 'id'>) => EditorialService.createEditorial(editorial);
export const updateEditorial = (id: string, editorial: Partial<Editorial>) => EditorialService.updateEditorial(id, editorial);
export const removeEditorial = (id: string) => EditorialService.removeEditorial(id);
export const getEditorialsForSelect = () => EditorialService.getEditorialsForSelect();