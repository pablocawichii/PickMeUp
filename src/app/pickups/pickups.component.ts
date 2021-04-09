/*IMPORTS FILES - NEEDED FOR SAVING AND PULLING DATA*/
import { Component, OnInit } from '@angular/core';
import { Pickup } from './pickup.model';
import { PickupsService } from './pickups.service';
import { PickupStorageService } from './pickups-database.service'
import { AuthenticationService } from '../shared/authentication.service'
import { Subscription, Observable } from 'rxjs'

@Component({
  selector: 'app-pickups',
  templateUrl: './pickups.component.html',
  styleUrls: ['./pickups.component.css']
})
export class PickupsComponent implements OnInit {
	pickups: Pickup[];
	listOfPickups;
	currentDate: Date;

  subscription: Subscription;

  constructor(private pickupsService: PickupsService, private pickupsStorageService: PickupStorageService, public auth: AuthenticationService) { }

  ngOnInit() {
  	this.pickupsService.initOb();
  	this.listOfPickups = this.pickupsService.getUnclaimedPickups();
  	this.currentDate = new Date();
  	this.subscription = this.pickupsService.pickupsChanged.subscribe(pickups => {
      this.pickups = pickups;
    });
    this.pickupsStorageService.getPickups()
  	
  }

  /*READS GPS*/
  newPickup() {
    /*IF THE GPS IS ENABLED - ALLOWS TO MAKE A NEW REQUEST*/
    if (navigator.geolocation) {
      	navigator.geolocation.getCurrentPosition(position => {
	      	let nPickup = new Pickup({lat: position.coords.latitude, lng: position.coords.longitude}, new Date() );
		  	this.pickupsStorageService.addPickup(nPickup);
    	})
    } 
    /*IF NOT ENABLED - ALERTS THE USER THAT GPS MUST BE TURNED ON TO MAKE A REQUEST*/
    else {
		alert("Cannot retrieve location. Please allow location.")
    }
  }

}
