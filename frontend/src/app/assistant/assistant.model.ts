export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface ListingSuggestion {
  title: string;
  tags: string[];
  priceRange: PriceRange;
}

export type AssistantStatus = 'idle' | 'loading' | 'success' | 'error';
