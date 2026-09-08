import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Assistant } from './assistant';
import { ListingResponse } from '../api/models';

describe('Assistant', () => {
  let component: Assistant;
  let fixture: ComponentFixture<Assistant>;
  let httpTesting: HttpTestingController;

  const sampleListing: ListingResponse = {
    title: 'Vintage Black Leather Jacket - Size M - Excellent Condition',
    tags: ['vintage leather jacket', 'black leather coat', 'leather jacket m'],
    minPrice: 45,
    maxPrice: 85,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Assistant],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Assistant);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create with initial idle state', () => {
    expect(component).toBeTruthy();
    expect(component['status']()).toBe('idle');
    expect(component['description'].value).toBe('');
    expect(component['suggestion']()).toBeNull();
  });

  it('should not let user click suggestions button when the input is empty and make no request', () => {
    component['description'].setValue('');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.prompt-submit-btn');
    expect(button.disabled).toBe(true);

    component['onSubmit']();
    httpTesting.expectNone('http://localhost:3000/api/assistant');
    expect(component['status']()).toBe('idle');
  });

  it('should enable suggestions button when valid description is entered', () => {
    component['description'].setValue('Vintage leather jacket, worn once, size M');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.prompt-submit-btn');
    expect(button.disabled).toBe(false);
  });

  it('should send POST request and update signals upon receiving 200 OK response', () => {
    const promptText = 'Vintage leather jacket, worn once, size M';
    component['description'].setValue(promptText);
    component['onSubmit']();

    expect(component['status']()).toBe('loading');

    const req = httpTesting.expectOne('http://localhost:3000/api/assistant');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ description: promptText });


    req.flush(sampleListing);

    expect(component['status']()).toBe('success');
    expect(component['suggestion']()).toEqual(sampleListing);
  });

  it('should handle 502 Bad Gateway error and set error state', () => {
    const errorBody = 'There was an error generating suggestions. Please try again';
    component['description'].setValue('Nintendo Switch OLED with Mario Kart');
    component['onSubmit']();

    const req = httpTesting.expectOne('http://localhost:3000/api/assistant');
    req.flush(errorBody, {
      status: 502,
      statusText: 'Bad Gateway',
    });

    expect(component['status']()).toBe('error');
    expect(component['errorMessage']()).toBe(errorBody);
    expect(component['suggestion']()).toBeNull();
  });

  it('should handle 500 Internal Server Error and set error state', () => {
    component['description'].setValue('Old bicycle for parts, flat tires');
    component['onSubmit']();

    const req = httpTesting.expectOne('http://localhost:3000/api/assistant');
    req.flush('Internal error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(component['status']()).toBe('error');
    expect(component['errorMessage']()).toBe('Something went wrong. Please try again.');
  });

  it('should prefill description and trigger submission when selecting a mock scenario', () => {
    const scenario = component['mockDescriptions'][0];
    component['selectMockDescription'](scenario.text);

    expect(component['description'].value).toBe(scenario.text);
    expect(component['status']()).toBe('loading');

    const req = httpTesting.expectOne('http://localhost:3000/api/assistant');
    expect(req.request.body).toEqual({ description: scenario.text });
    req.flush(sampleListing);

    expect(component['status']()).toBe('success');
  });

  it('should remove the results card after submitting a new request', () => {
    // Setup an initial state with an existing suggestion
    component['suggestion'].set(sampleListing);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.results-card')).toBeTruthy();

    // Submit a new description
    component['description'].setValue('Second hand bicycle in good condition');
    component['onSubmit']();
    fixture.detectChanges();

    // Card should be removed immediately while loading
    expect(component['suggestion']()).toBeNull();
    expect(fixture.nativeElement.querySelector('.results-card')).toBeNull();

    // Complete the in-flight request
    const req = httpTesting.expectOne('http://localhost:3000/api/assistant');
    req.flush(sampleListing);
    fixture.detectChanges();

    // Card reappears with new suggestion
    expect(fixture.nativeElement.querySelector('.results-card')).toBeTruthy();
  });

  it('should show mock pills when in mock mode', () => {
    component['mockMode'].set(true);
    fixture.detectChanges();

    const chipsBar = fixture.nativeElement.querySelector('.mock-chips-bar');
    expect(chipsBar).toBeTruthy();

    const pills = fixture.nativeElement.querySelectorAll('.mock-chip');
    expect(pills.length).toBe(component['mockDescriptions'].length);
  });

  it('should not show mock pills when not in mock mode', () => {
    component['mockMode'].set(false);
    fixture.detectChanges();

    const chipsBar = fixture.nativeElement.querySelector('.mock-chips-bar');
    expect(chipsBar).toBeNull();
  });
});
