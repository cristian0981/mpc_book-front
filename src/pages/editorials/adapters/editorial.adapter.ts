import type { EditorialApiResponse } from "@/api/types/editorial-api-response.interface";
import type { Editorial } from "../types/editorial";


export const adaptEditorial = (editorialApiResponse: EditorialApiResponse): Editorial => {
    return {
        id: editorialApiResponse.id,
        name: editorialApiResponse.name
    };
};

export const adaptEditorials = (editorialsApiResponse: EditorialApiResponse[]): Editorial[] => {
    return editorialsApiResponse.map(adaptEditorial);
};