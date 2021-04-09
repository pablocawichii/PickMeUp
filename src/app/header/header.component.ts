import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router'
import { Location } from '@angular/common'

import { AuthenticationService } from '../shared/authentication.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html'
})

// This is the header navbar which is present on all pages.
export class HeaderComponent implements OnInit, OnDestroy {
	collapsed = true;
	isAuthenticated ;
	user;
	priv;

	constructor(private router: Router,public authenticationService: AuthenticationService, private location: Location) {}

	ngOnInit() {
		this.authenticationService.userData.subscribe(user => {
			this.user = user;
			this.priv = this.authenticationService.currentPriv
			this.isAuthenticated = !!user;
		});
	}

  // Logs out user
	onLogout() {
	    this.authenticationService.SignOut();
		this.router.navigate(['/'])
	}

	ngOnDestroy() {
	}

  // Allows User to return to previous pages
	goBack() {
		this.location.back()
	}
}
