import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(email: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, username, password }, {
      withCredentials: true
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, {
      withCredentials: true
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      withCredentials: true,
      headers: {
        'x-csrf-token': this.getCsrfToken()
      }
    });
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/profile`, {
      withCredentials: true,
      headers: { 'x-csrf-token': this.getCsrfToken() }
    }).pipe(
        tap(() => this.isAuthenticatedSubject.next(true)),
        catchError(() => {
          this.isAuthenticatedSubject.next(false);
          return of(false);
        }),
        map(() => true)
    );
  }

  logout(): void {
    // Optionally implement logout endpoint later
    this.isAuthenticatedSubject.next(false);
  }

  loginSuccess(): void {
    this.isAuthenticatedSubject.next(true);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Helper to get CSRF token from cookie
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
