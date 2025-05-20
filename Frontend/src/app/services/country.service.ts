import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = `${environment.apiUrl}/countries`;

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCountryDetails(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`);
  }
}
