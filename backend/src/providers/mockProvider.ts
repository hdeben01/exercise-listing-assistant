import type { Listing } from "../models.ts";
import type { Provider } from "./provider.ts";

export class MockProvider implements Provider{
    constructor(){

    }
    async processDescription(description: string): Promise<string> {
        return `{"title":"Vintage Black Leather Jacket - Size M - Excellent Condition","tags":["vintage leather jacket","black leather coat","leather jacket m","autumn fashion","biker jacket"],"minPrice":45,"maxPrice":85}`
    }
}