import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cacnelregistration = new EventEmitter();
  model: any = {};

  constructor(private authServ: AuthService) { }

  ngOnInit() {
  }

  register() {
    this.authServ.register(this.model).subscribe(() => {
      console.log('registration successful..');
    }, error => {
      console.log(error);
    });
  }

  cancel() {
    this.cacnelregistration.emit(false);
  }

}
