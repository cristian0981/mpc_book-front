import type { EditorialApiResponse } from "@/api/types/editorial-api-response.interface";

import type { Editorial } from '../types/editorial';
import { adaptEditorials } from './editorial.adapter';

export const adaptEditorialsResponse = (editorialsApiResponse: EditorialApiResponse[]): Editorial[] => {
    return adaptEditorials(editorialsApiResponse);
};
