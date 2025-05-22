import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = `${environment.apiUrl}/countries`;
  private countriesCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any[]> {
    if (this.countriesCache) {
      return of(this.countriesCache);
    }

    return this.http.get<any[]>(this.apiUrl, {
      withCredentials: true,
      headers: {
        'x-csrf-token': this.getCsrfToken()
      }
    }).pipe(
        tap((data: any[]) => {
          this.countriesCache = data;
        })
    );
  }

  getCountryDetails(name: string): Observable<any> {
    if (this.countriesCache) {
      const country = this.countriesCache.find(c => c.name === name);
      return of(country || null);
    }

    return this.http.get<any>(`${this.apiUrl}/${name}`, {
      withCredentials: true,
      headers: {
        'x-csrf-token': this.getCsrfToken()
      }
    });
  }

  clearCache(): void {
    this.countriesCache = null;
  }

  private getCsrfToken(): string {
    const name = 'csrf_token=';
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(name)) {
        return c.substring(name.length);
      }
    }
    return '';
  }
}
