import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cacnelregistration = new EventEmitter();
  model: any = {};

  constructor(
    private authServ: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authServ.register(this.model).subscribe(() => {
      this.alertify.success('registration successful');
    }, error => {
      this.alertify.error(error);
    });
  }

  cancel() {
    this.cacnelregistration.emit(false);
  }

}
