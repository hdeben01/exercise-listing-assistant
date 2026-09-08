import { GoogleGenAI, Type } from "@google/genai";
import type { Provider } from "./provider.ts";
import type { Listing } from "../models.ts";


export class GeminiProvider implements Provider{

    //Api key is retrieved from environment
    private ai: GoogleGenAI = new GoogleGenAI();
    constructor(){

    }

    async processDescription(description: string): Promise<string | undefined> {
        const response =  await this.ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: [
                {
                role: "user",
                parts: [
                    {
                    text: `Extract the property listing details from this description:\n\n${description}`,
                    },
                ],
                },
            ],
            config: {

                systemInstruction: `You are an expert marketplace selling assistant for Second hand products. Your goal is to help sellers optimize their listings to attract more buyers and sell faster.
                                    Given a rough item description from a seller, you must generate:
                                    1. "title": A clear, attractive, high-converting listing title (aim for 40-70 characters; include brand, model, size, or condition if inferrable).
                                    2. "tags": An array of exactly 3 to 5 relevant search tags/keywords in lowercase (no hashtags, just search terms buyers would type).
                                    3. "priceRange": A realistic second-hand marketplace price range in Euros (EUR), with:
                                    - "min": Lower bound integer estimate.
                                    - "max": Upper bound integer estimate (must be >= min).
                                    - "currency": Always "EUR".

                                    Rules & Guardrails:
                                    - Respond strictly with a valid JSON object matching the requested schema.
                                    - Do not include markdown code block formatting (e.g., do not wrap in \`\`\`json or \`\`\`), commentary, or conversational filler.
                                    - If the seller's input is extremely vague, make your best educated guess for a typical second-hand item and suggest a reasonable generic range.
                                    - Never output negative prices.

                                    Output Schema:
                                    {
                                    "title": string,
                                    "tags": string[],
                                    "priceRange": {
                                        "min": number,
                                        "max": number,
                                        "currency": "EUR"
                                    }
                                    }`,
                
                // Enforce JSON schema to match Listing
                responseMimeType: "application/json",
                responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    tags: { type: Type.ARRAY, 
                            items: 
                                {
                                    type: Type.STRING
                                } 
                    },
                    minPrice: { type: Type.NUMBER },
                    maxPrice: { type: Type.NUMBER },
                },
                required: ["title", "tags", "minPrice", "maxPrice"],
                },
            },
        });
        return response.text;
    }
}