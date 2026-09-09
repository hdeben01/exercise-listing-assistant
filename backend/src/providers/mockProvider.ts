import type { Provider } from "./provider.ts";

export class MockProvider implements Provider {
    private static instance: MockProvider

    static readonly RESPONSES: Map<string, string | Error> = new Map<string, string | Error>([
        // Correct
        [
            "Vintage leather jacket, worn once, size M",
            `{"title":"Vintage Black Leather Jacket - Size M - Excellent Condition","tags":["vintage leather jacket","black leather coat","leather jacket m","autumn fashion","biker jacket"],"minPrice":45,"maxPrice":85}`
        ],
        // Correct
        [
            "Selling old Pokemon cards from attic, around 50 cards, mostly base set, some holos played condition",
            `{"title": "Vintage Pokemon Card Collection - 50 Cards Base Set Mixed Holos","tags": ["pokemon cards","base set","trading cards","tcg","collectible"],"minPrice": 30,"maxPrice": 85}`
        ],
        // Missing bracket in JSON
        [
            "Nintendo Switch OLED white model with Mario Kart 8 and Super Smash Bros, barely used, comes with carrying case",
            `{"title": "Nintendo Switch OLED White Console Bundle with 2 Games & Case", "tags": ["nintendo switch", "gaming bundle"], "minPrice": 300, "maxPrice": 380`
        ],
        // minPrice > maxPrice
        [
            "Ikea desk lamp, working perfectly, minor scratch on base",
            `{"title": "Ikea Desk Lamp - Working Condition", "tags": ["desk lamp", "ikea", "lighting"], "minPrice": 50, "maxPrice": 20}`
        ],
        // Service Unavailable
        [
            "Old bicycle for parts, flat tires, rusty chain",
            new Error("Gemini API Error: 503 Service Unavailable / Rate limit exceeded")
        ]
    ]);

    constructor() {}

    static getInstance(): Provider {
        if(!MockProvider.instance){
            MockProvider.instance = new MockProvider;
        }
        return MockProvider.instance;
    }

    async processDescription(description: string): Promise<string> {
        let response = MockProvider.RESPONSES.get(description);
        // Added a bit of delay for mock provided
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!response) {
            const values = Array.from(MockProvider.RESPONSES.values());
            response = values[Math.floor(Math.random() * values.length)];
        }

        if (response instanceof Error) {
            throw response;
        }

        return response as string;
    }
}