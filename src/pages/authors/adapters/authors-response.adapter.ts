
import type { AuthorApiResponse } from '@/api/types/author-api-response.interface';
import type { Author } from '../types/author';
import { adaptAuthors } from './author.adapter';

export const adaptAuthorsResponse = (authorsApiResponse: AuthorApiResponse[]): Author[] => {
    return adaptAuthors(authorsApiResponse);
};