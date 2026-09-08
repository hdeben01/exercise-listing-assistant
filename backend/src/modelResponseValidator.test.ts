import { ModelResponseError, validateModelResponse } from "./modelResponseValidator.ts";

describe("modelResponseValidator", () => {

    it("returns a valid ListingResponse from a valid model response", () =>{
        const validListingResponse = {"title":"Vintage Black Leather Jacket - Size M - Excellent Condition","tags":["vintage leather jacket","black leather coat","leather jacket m","autumn fashion","biker jacket"],"minPrice":45,"maxPrice":85};
        const modelResponse = `{"title":"Vintage Black Leather Jacket - Size M - Excellent Condition","tags":["vintage leather jacket","black leather coat","leather jacket m","autumn fashion","biker jacket"],"minPrice":45,"maxPrice":85}`;
        expect(validateModelResponse(modelResponse)).toEqual(validListingResponse);
    })

    it("throws a ModelResponseError when passing an undefined string", () => {
        expect(() => validateModelResponse(undefined)).toThrow(ModelResponseError);
    });

    it("throws when passing invalid JSON syntax", () => {
        expect(() => validateModelResponse("invalid-json{")).toThrow(ModelResponseError);
    });

    it("throws when missing required schema fields", () => {
        const missingPrice = JSON.stringify({
            title: "Test item",
            tags: ["one", "two"]
        });
        expect(() => validateModelResponse(missingPrice)).toThrow(ModelResponseError);
    });

    it("throws when minPrice is greater than maxPrice", () => {
        const invalidRange = JSON.stringify({
            title: "Test item",
            tags: ["one", "two"],
            minPrice: 100,
            maxPrice: 20
        });
        expect(() => validateModelResponse(invalidRange)).toThrow(ModelResponseError);
    });

    describe("Price Edge Cases & Boundaries", () => {
        it("throws when minPrice or maxPrice is negative", () => {
            const negativeMin = JSON.stringify({
                title: "Test item",
                tags: ["one", "two"],
                minPrice: -10,
                maxPrice: 50
            });
            const negativeMax = JSON.stringify({
                title: "Test item",
                tags: ["one", "two"],
                minPrice: 10,
                maxPrice: -1
            });
            expect(() => validateModelResponse(negativeMin)).toThrow(ModelResponseError);
            expect(() => validateModelResponse(negativeMax)).toThrow(ModelResponseError);
        });

        it("accepts zero as a valid non-negative price boundary", () => {
            const freeItem = JSON.stringify({
                title: "Free sofa",
                tags: ["sofa", "furniture", "couch"],
                minPrice: 0,
                maxPrice: 0
            });
            const result = validateModelResponse(freeItem);
            expect(result.minPrice).toBe(0);
            expect(result.maxPrice).toBe(0);
        });

        it("accepts equal minPrice and maxPrice for fixed-price items", () => {
            const fixedPrice = JSON.stringify({
                title: "Fixed price item",
                tags: ["vintage", "rare", "collectible"],
                minPrice: 50,
                maxPrice: 50
            });
            const result = validateModelResponse(fixedPrice);
            expect(result.minPrice).toBe(50);
            expect(result.maxPrice).toBe(50);
        });

        it("throws when minPrice or maxPrice is not a number", () => {
            const stringPrice = JSON.stringify({
                title: "Test item",
                tags: ["one"],
                minPrice: "45",
                maxPrice: 80
            });
            const nullPrice = JSON.stringify({
                title: "Test item",
                tags: ["one"],
                minPrice: 10,
                maxPrice: null
            });
            const boolPrice = JSON.stringify({
                title: "Test item",
                tags: ["one"],
                minPrice: false,
                maxPrice: 50
            });
            expect(() => validateModelResponse(stringPrice)).toThrow(ModelResponseError);
            expect(() => validateModelResponse(nullPrice)).toThrow(ModelResponseError);
            expect(() => validateModelResponse(boolPrice)).toThrow(ModelResponseError);
        });
    });

    describe("Tag Normalization & Validation", () => {
        it("normalizes tags by trimming whitespace and converting to lowercase", () => {
            const input = JSON.stringify({
                title: "Vintage Leather Jacket",
                tags: ["  VINTAGE Leather  ", " Biker Jacket ", "OUTERWEAR"],
                minPrice: 30,
                maxPrice: 60
            });
            const result = validateModelResponse(input);
            expect(result.tags).toEqual(["vintage leather", "biker jacket", "outerwear"]);
        });

        it("throws when tags array contains non-string elements", () => {
            const mixedTags = JSON.stringify({
                title: "Test item",
                tags: ["shoes", 42, null, true],
                minPrice: 10,
                maxPrice: 20
            });
            expect(() => validateModelResponse(mixedTags)).toThrow(ModelResponseError);
        });

        it("throws when tags is not an array", () => {
            const stringTags = JSON.stringify({
                title: "Test item",
                tags: "vintage, jacket",
                minPrice: 10,
                maxPrice: 20
            });
            const objectTags = JSON.stringify({
                title: "Test item",
                tags: { tag1: "vintage" },
                minPrice: 10,
                maxPrice: 20
            });
            expect(() => validateModelResponse(stringTags)).toThrow(ModelResponseError);
            expect(() => validateModelResponse(objectTags)).toThrow(ModelResponseError);
        });

        it("throws when tags array size is less than 3 or more than 5", () => {
            const tooFewZero = JSON.stringify({
                title: "Test item",
                tags: [],
                minPrice: 10,
                maxPrice: 20,
            });
            const tooFewTwo = JSON.stringify({
                title: "Test item",
                tags: ["vintage", "leather"],
                minPrice: 10,
                maxPrice: 20,
            });
            const tooManySix = JSON.stringify({
                title: "Test item",
                tags: ["one", "two", "three", "four", "five", "six"],
                minPrice: 10,
                maxPrice: 20,
            });

            expect(() => validateModelResponse(tooFewZero)).toThrow(ModelResponseError);
            expect(() => validateModelResponse(tooFewTwo)).toThrow(ModelResponseError);
            expect(() => validateModelResponse(tooManySix)).toThrow(ModelResponseError);
        });
    });

    describe("Title Validation", () => {
        it("throws when title is empty or whitespace-only", () => {
            const emptyTitle = JSON.stringify({
                title: "",
                tags: ["one"],
                minPrice: 10,
                maxPrice: 20
            });
            const whitespaceTitle = JSON.stringify({
                title: "   ",
                tags: ["one"],
                minPrice: 10,
                maxPrice: 20
            });
            expect(() => validateModelResponse(emptyTitle)).toThrow(ModelResponseError);
            expect(() => validateModelResponse(whitespaceTitle)).toThrow(ModelResponseError);
        });

        it("throws when title is not a string", () => {
            const numericTitle = JSON.stringify({
                title: 12345,
                tags: ["one"],
                minPrice: 10,
                maxPrice: 20
            });
            const objectTitle = JSON.stringify({
                title: { text: "Cool item" },
                tags: ["one"],
                minPrice: 10,
                maxPrice: 20
            });
            expect(() => validateModelResponse(numericTitle)).toThrow(ModelResponseError);
            expect(() => validateModelResponse(objectTitle)).toThrow(ModelResponseError);
        });
    });

    describe("Payload & JSON Boundaries", () => {
        it("throws when JSON root is not an object", () => {
            expect(() => validateModelResponse("null")).toThrow(ModelResponseError);
            expect(() => validateModelResponse("true")).toThrow(ModelResponseError);
            expect(() => validateModelResponse("123")).toThrow(ModelResponseError);
            expect(() => validateModelResponse("[]")).toThrow(ModelResponseError);
            expect(() => validateModelResponse('"just a string"')).toThrow(ModelResponseError);
        });

        it("throws when input string is empty or whitespace-only", () => {
            expect(() => validateModelResponse("")).toThrow(ModelResponseError);
            expect(() => validateModelResponse("   ")).toThrow(ModelResponseError);
        });

        it("safely strips extra unexpected fields from the model response", () => {
            const payloadWithExtra = JSON.stringify({
                title: "Vintage Leather Jacket",
                tags: ["vintage", "leather", "jacket"],
                minPrice: 40,
                maxPrice: 80,
                reasoning: "High-value second hand item",
                confidence: 0.95,
                notes: { condition: "good" }
            });
            const result = validateModelResponse(payloadWithExtra);
            expect(result).toEqual({
                title: "Vintage Leather Jacket",
                tags: ["vintage", "leather", "jacket"],
                minPrice: 40,
                maxPrice: 80
            });
        });
    });
});