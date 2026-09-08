import { inject, Injectable } from '@angular/core';
import { ListingResponse } from './models';
import { catchError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssistantService {
  private http = inject(HttpClient);
  constructor() {}

  public getListingSuggestion(description: string): Observable<ListingResponse>{
    return this.http.post<ListingResponse>(`${environment.apiBaseUrl}` + '/api/assistant', {
      description: description,
    }).pipe(catchError((err: HttpErrorResponse) =>{
      const message = err.status === 502 ? err.error : "Something went wrong. Please try again.";
      throw new Error(message);
    }))
  }
}
