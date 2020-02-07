import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: import('@angular/common/http').HttpRequest<any>,
    next: import('@angular/common/http').HttpHandler
  ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError( error => {
        if (error.status === 401) {
          return throwError(error.error.title);
        }
        if (error instanceof HttpErrorResponse) {
          const applicationError = error.headers.get('Application-Error');
          if (applicationError) {
            return throwError(applicationError);
          }
        }
        const servError = error.error;
        let modalStateErrors = '';
        if (servError.errors && typeof servError.errors === 'object') {
          for (const key in servError.errors) {
            if (servError.errors[key]) {
              modalStateErrors += servError.errors[key] + '\n';
            }
          }
        }
        return throwError(modalStateErrors || servError || 'Server Error');
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
