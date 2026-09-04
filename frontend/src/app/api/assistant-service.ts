import { inject, Injectable } from '@angular/core';
import { ListingResponse } from './models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssistantService {
  private http = inject(HttpClient);
  constructor() {}

  public getListingSuggestion(description: string): Observable<ListingResponse>{
    return this.http.post<ListingResponse>(`${environment.apiBaseUrl}` + '/assistant', {
      description: description,
    })
  }
}
