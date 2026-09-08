import type { ListingResponse } from "./models.ts";

export class ModelResponseError extends Error {
    constructor(){
        super("ModelResponseError: response does not match the listing format");
        this.name = "ModelResponseError";
    }
}

/*Check that the aiResponse matches the Listing structure
  This should be ideally implemented in a service*/
export function validateModelResponse(aiResponse: string | undefined): ListingResponse {
    try {
        if (!aiResponse) throw new ModelResponseError();
        const objectAIResponse = JSON.parse(aiResponse);

        if (
            !objectAIResponse ||
            typeof objectAIResponse !== 'object' ||
            typeof objectAIResponse.title !== 'string' ||
            objectAIResponse.title.trim().length === 0 ||
            !Array.isArray(objectAIResponse.tags) ||
            typeof objectAIResponse.minPrice !== 'number' ||
            typeof objectAIResponse.maxPrice !== 'number' ||
            Number.isNaN(objectAIResponse.minPrice) ||
            Number.isNaN(objectAIResponse.maxPrice) ||
            objectAIResponse.minPrice < 0 ||
            objectAIResponse.maxPrice < 0
        ) {
            throw new ModelResponseError();
        }

        if(objectAIResponse.minPrice > objectAIResponse.maxPrice){
            throw new ModelResponseError();
        }

        const normalizedTags = objectAIResponse.tags.map((tag: unknown) => {
            if (typeof tag !== 'string') {
                throw new ModelResponseError();
            }
            return tag.trim().toLowerCase();
        });

        return {
            title: objectAIResponse.title,
            tags: normalizedTags,
            minPrice: objectAIResponse.minPrice,
            maxPrice: objectAIResponse.maxPrice,
        };
    } catch (e: any) {
        if (e instanceof ModelResponseError) {
            throw e;
        }
        throw new ModelResponseError();
    }
}