import { AuthService } from 'src/app/_services/auth.service';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {

  pageNumber = 1;
  pageSize = 5;
  messageContainer = 'Unread';

  constructor(
    private userSer: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.userSer.getMessages(
      this.authService.decodedToken.nameid, this.pageNumber,
      this.pageSize, this.messageContainer).pipe(
      catchError(error => {
        this.alertify.error('Problem retrieving messages');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }

}
