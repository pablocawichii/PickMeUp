import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import firebase from 'firebase/app'
import { Router } from '@angular/router'
import { DriverStorageService } from '../drivers/drivers-database.service'

const priv = ["anon", "driver", "cust"];	
@Injectable({
  providedIn: 'root'
})

// Authentication according to the Firebase Authentication Services Documentation.
export class AuthenticationService {
  userData: Observable<firebase.User>;
  data: firebase.User
  // Save current privilege of user on instance
  currentPriv = "anon"

  constructor(private angularFireAuth: AngularFireAuth, private router: Router, private dService: DriverStorageService) {
    this.userData = angularFireAuth.authState;
    this.userData.subscribe(data=> {
    	this.data = data;
    })
    // Update user location on DB only if driver As only driver location stored.
    setInterval( () => {
      	if(this.currentPriv == 'driver') {
  			this.dService.updateDriverLocation(this.data.uid)
  		}
  	},5000);
  }

  setPriv(priv: string) {
  	this.currentPriv = priv;

  }

  /* Sign up */
  SignUp(email: string, password: string) {
    this.angularFireAuth
      
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        console.log('Successfully signed up!', res);
		this.router.navigate(['/'])
      })
      .catch(error => {
        console.log('Something is wrong:', error.message);
      });    
  }

  /* Sign in */
  SignIn(email: string, password: string) {
    this.angularFireAuth
      
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('Successfully signed in!');
		this.router.navigate(['/'])
      })
      .catch(err => {
        console.log('Something is wrong:',err.message);
      });
  }

  /* Sign out */
  SignOut() {
  	this.currentPriv = 'anon'
    this.angularFireAuth
      
      .signOut();
  }  

}
