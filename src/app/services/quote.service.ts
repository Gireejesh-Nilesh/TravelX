import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  constructor(private http: HttpClient) {}

  getQuote() {
    return this.http.get<any>('http://localhost:3000/quote');
  }
}
