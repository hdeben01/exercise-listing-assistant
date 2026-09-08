import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  signal,
  viewChild,
  inject
} from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AssistantStatus, ListingResponse } from '../api/models'
import { AssistantService } from '../api/assistant-service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-assistant',
  imports: [ReactiveFormsModule],
  templateUrl: './assistant.html',
  styleUrl: './assistant.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Assistant {
  private assistantService = inject(AssistantService);
  protected readonly promptInputRef = viewChild<ElementRef<HTMLTextAreaElement>>('promptInput');

  // Input state
  protected readonly description = new FormControl("",
    { nonNullable: true, validators: [Validators.required] }
  );

  // Status state: 'idle' | 'loading' | 'success' | 'error'
  protected readonly status = signal<AssistantStatus>('idle');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly suggestion = signal<ListingResponse | null>(null);
  protected readonly mockMode = signal<boolean>(false);

  protected readonly mockDescriptions = [
    {
      simulation: 'Success case A',
      type: 'success' as const,
      text: 'Vintage leather jacket, worn once, size M',
    },
    {
      simulation: 'Success case B',
      type: 'success' as const,
      text: 'Selling old Pokemon cards from attic, around 50 cards, mostly base set, some holos played condition',
    },
    {
      simulation: 'Missing bracket in JSON',
      type: 'error' as const,
      text: 'Nintendo Switch OLED white model with Mario Kart 8 and Super Smash Bros, barely used, comes with carrying case',
    },
    {
      simulation: 'Min price > Max price',
      type: 'error' as const,
      text: 'Ikea desk lamp, working perfectly, minor scratch on base',
    },
    {
      simulation: 'API error like service unavailability',
      type: 'error' as const,
      text: 'Old bicycle for parts, flat tires, rusty chain',
    },
  ];

  constructor() {
    this.mockMode.set(environment.mode === "mock");
    afterNextRender(() => {
      const textarea = this.promptInputRef()?.nativeElement;
      if (textarea) {
        this.adjustHeight(textarea);
      }
    });
  }

  protected selectMockDescription(text: string): void {
    this.description.setValue(text);
    const textarea = this.promptInputRef()?.nativeElement;
    if (textarea) {
      this.adjustHeight(textarea);
    }
    this.onSubmit();
  }

  protected onInputResize(event: Event): void {
    this.adjustHeight(event.target as HTMLTextAreaElement);
  }

  private adjustHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    if (!textarea.value.trim()) {
      textarea.style.height = '48px';
      return;
    }
    textarea.style.height = `${Math.max(48, textarea.scrollHeight)}px`;
  }

  protected onSubmit(): void {
    if (this.description.invalid) {
      return;
    }

    this.status.set('loading');
    this.assistantService.getListingSuggestion(this.description.value).subscribe({
      next: (listingResponse) => {
        this.status.set('success');
        //Clean the input
        this.description.setValue("");
        this.adjustHeight(this.promptInputRef()?.nativeElement!);
        console.log(JSON.stringify(listingResponse, null, 2));
        this.suggestion.set({
          title: listingResponse.title,
          tags: listingResponse.tags,
          minPrice: listingResponse.minPrice,
          maxPrice: listingResponse.maxPrice,
        })
      },
      error: (err: Error) => {
        this.status.set('error');
        if (err.message) {
          this.errorMessage.set(err.message);
        }
        console.log(err);
      },
    })
  }

  protected copyTitle(): void {
  }
}