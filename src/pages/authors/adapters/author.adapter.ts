import type { AuthorApiResponse } from "@/api/types/author-api-response.interface";
import type { Author } from "../types/author";

export const adaptAuthor = (authorApiResponse: AuthorApiResponse): Author => {
    return {
        id: authorApiResponse.id,
        name: authorApiResponse.name
    };
};

export const adaptAuthors = (authorsApiResponse: AuthorApiResponse[]): Author[] => {
    return authorsApiResponse.map(adaptAuthor);
};