import type { Author } from "../types/author";
import type { AuthorApiResponse } from "@/api/types/author-api-response.interface";

export const adaptAuthorToApi = (author: Author): Partial<AuthorApiResponse> => {
    return {
        id: author.id,
        name: author.name
    };
};