export interface ListingRequest {
    description: string;
}

export interface ListingResponse{
    title: string,
    tags: string[],
    minPrice: number,
    maxPrice: number,
}

export type AssistantStatus = 'idle' | 'loading' | 'success' | 'error';