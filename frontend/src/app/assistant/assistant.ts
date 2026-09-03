import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  signal,
  viewChild,
} from '@angular/core';
import { AssistantStatus, ListingSuggestion } from './assistant.model';

@Component({
  selector: 'app-assistant',
  imports: [],
  templateUrl: './assistant.html',
  styleUrl: './assistant.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Assistant {
  protected readonly promptInputRef = viewChild<ElementRef<HTMLTextAreaElement>>('promptInput');

  // Input state
  protected readonly rawDescription = signal<string>(
    'Vintage leather jacket, worn once, size M, black color, perfect condition for autumn/winter.'
  );

  // Status state: 'idle' | 'loading' | 'success' | 'error'
  protected readonly status = signal<AssistantStatus>('idle');
  protected readonly errorMessage = signal<string | null>(null);

  // Suggested listing data (pre-populated with mock data for visual presentation)
  protected readonly suggestion = signal<ListingSuggestion | null>({
    title: 'Vintage Genuine Leather Biker Jacket - Size M (Mint Condition)',
    tags: ['leather jacket', 'vintage', 'biker', 'outerwear', 'size m'],
    priceRange: {
      min: 45,
      max: 75,
      currency: '€',
    },
  });

  constructor() {
    afterNextRender(() => {
      const textarea = this.promptInputRef()?.nativeElement;
      if (textarea) {
        this.adjustHeight(textarea);
      }
    });
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.rawDescription.set(target.value);
    this.adjustHeight(target);
  }

  private adjustHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    if (!textarea.value.trim()) {
      textarea.style.height = '48px';
      return;
    }
    textarea.style.height = `${Math.max(48, textarea.scrollHeight)}px`;
  }

  // Action placeholders for consumer implementation
  protected onSubmit(): void {
    // To be implemented by user logic
  }

  protected onReset(): void {
    this.rawDescription.set('');
    const textarea = this.promptInputRef()?.nativeElement;
    if (textarea) {
      textarea.value = '';
      this.adjustHeight(textarea);
    }
  }

  protected copyTitle(): void {
    // To be implemented by user logic
  }
}

