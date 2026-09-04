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
    { nonNullable: true, validators: [Validators.maxLength(500)] }
  );

  // Status state: 'idle' | 'loading' | 'success' | 'error'
  protected readonly status = signal<AssistantStatus>('idle');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly suggestion = signal<ListingResponse | null>(null);
  protected readonly submitted = signal(false);

  constructor() {
    afterNextRender(() => {
      const textarea = this.promptInputRef()?.nativeElement;
      if (textarea) {
        this.adjustHeight(textarea);
      }
    });
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
    this.submitted.set(true);
    if (this.description.invalid) {
      return;
    }

    this.status.set('loading');
    this.assistantService.getListingSuggestion(this.description.value).subscribe({
      next: (listingResponse) => {
        this.status.set('success');
        //Clean the input
        this.description.setValue("");
        this.suggestion.set({
          title: listingResponse.title,
          tags: listingResponse.tags,
          minPrice: listingResponse.minPrice,
          maxPrice: listingResponse.maxPrice,
        })
      },
      error: (err) => {
        this.status.set('error');
        console.log(err);
      }
    })
  }

  protected copyTitle(): void {
  }
}