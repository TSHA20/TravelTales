import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const csrfToken = this.getCsrfToken();

    const modifiedReq = req.clone({
      withCredentials: true,
      setHeaders: csrfToken ? { 'x-csrf-token': csrfToken } : {}
    });

    return next.handle(modifiedReq);
  }

  private getCsrfToken(): string | null {
    const name = 'csrf_token=';
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(name)) {
        return c.substring(name.length);
      }
    }
    return null;
  }
}
