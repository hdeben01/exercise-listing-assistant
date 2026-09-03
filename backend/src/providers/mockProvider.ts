import type { Listing } from "../models.ts";
import type { Provider } from "./provider.ts";

export class MockProvider implements Provider{
    constructor(){

    }
    processDescription(description: string): Promise<Listing> {
        throw new Error("Method not implemented.");
    }
}