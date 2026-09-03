import type { Listing } from "../models.ts";

export interface Provider {
    processDescription(description: string): Promise<Listing>;
}