import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {

  constructor(
    private userSer: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authServ: AuthService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userSer.getUser(this.authServ.decodedToken.nameid).pipe(
      catchError(error => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }

}
