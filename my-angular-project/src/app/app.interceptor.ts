import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorService } from './error/error.service';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  API = '/api';
  apiUrl = environment.apiUrl;

  constructor(private errorService: ErrorService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('intercept');
    let modifiedReq = req;
    //if (req.url.startsWith(this.API)) {
      modifiedReq = req.clone({
        url: req.url.replace(this.API, this.apiUrl),
        withCredentials: true
      });
   // }

    return next.handle(modifiedReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.errorService.setError(err);
          this.router.navigate(['/error']);
        }
        return throwError(err);
      })
    );
  }
}

export const appInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AppInterceptor,
  multi: true
};
