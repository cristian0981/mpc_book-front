import type { EditorialApiResponse } from "@/api/types/editorial-api-response.interface";
import type { Editorial } from "../types/editorial";


export const adaptEditorialToApi = (editorial: Editorial): Partial<EditorialApiResponse> => {
    return {
        id: editorial.id,
        name: editorial.name
    };
};