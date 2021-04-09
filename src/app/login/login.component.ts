import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(public authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit(){
  	if(this.authenticationService.currentPriv != 'anon'){
		this.router.navigate(['/'])
  	}
  }

  // Signs up user
  signUp() {
    this.authenticationService.SignUp(this.email, this.password);
    this.email = ''; 
    this.password = '';
  }

  // Signs In user
  signIn() {
    this.authenticationService.setPriv('driver')
    this.authenticationService.SignIn(this.email, this.password);
    this.email = ''; 
    this.password = '';
  }

  // Signs out user
  signOut() {
    this.authenticationService.setPriv('anon')
    this.authenticationService.SignOut();
  }

  setPriv(priv: string) {
  	this.authenticationService.setPriv(priv);
  }
}
