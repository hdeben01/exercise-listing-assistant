import { describe, expect, it } from 'vitest';
import { MockProvider } from './mockProvider.ts';

describe('MockProvider', () => {
    const provider = new MockProvider();

    const possibleStrings = Array.from(MockProvider.RESPONSES.values()).filter(
        (val): val is string => typeof val === 'string'
    );
    const possibleErrors = Array.from(MockProvider.RESPONSES.values()).filter(
        (val): val is Error => val instanceof Error
    );

    it('for any arbitrary string input, only returns one of the possible responses or throws a mock error', async () => {
        const testInputs = [
            'completely random product',
            'another arbitrary string that is not in the map',
            '',
            '    ',
            '1234567890',
            '!@#$%^&*()_+~`',
            'a'.repeat(500),
        ];

        for (let i = 0; i < 50; i++) {
            testInputs.push(`fuzzed-input-${i}-${Math.random()}`);
        }

        for (const input of testInputs) {
            try {
                const result = await provider.processDescription(input);
                expect(possibleStrings).toContain(result);
            } catch (err) {
                expect(err).toBeInstanceOf(Error);
                expect(possibleErrors.map(e => e.message)).toContain((err as Error).message);
            }
        }
    });

});

