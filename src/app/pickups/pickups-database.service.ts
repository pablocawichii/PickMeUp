import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, tap, toArray, filter } from 'rxjs/operators'
import { DriversService } from '../drivers/drivers.service'
import { PickupsService } from './pickups.service'
import { Pickup } from './pickup.model'
import { Router } from '@angular/router'

import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';


export const firebaseConfig = {
    apiKey: "AIzaSyA0BcUcu4V8aHT_gM-32BhRcmqji4z-xts",
    authDomain: "some-app.firebaseapp.com",
    databaseURL: "https://some-app.firebaseio.com",
    storageBucket: "some-app.appspot.com",
    messagingSenderId: "290354329699"
};



@Injectable({providedIn: 'root'})
export class PickupStorageService {


	constructor(private router: Router, private http: HttpClient, private driversService: DriversService, private pickupsService: PickupsService, db: AngularFireDatabase) {
		// initializeApp(firebaseConfig);

		// database().ref().on('value', snapshot => console.log(snapshot.val()));
	}

  // Save local pickups to db
	savePickups() {
		const pickups = this.pickupsService.getPickups();
		this.http.put('https://pickmeup-307305-default-rtdb.firebaseio.com/pickups.json',
			pickups
			).subscribe((response)=>{
				console.log(response)
			})
	}

  // Adds one pickup to db
	addPickup(pickup: Pickup) {
		this.http.post('https://pickmeup-307305-default-rtdb.firebaseio.com/pickups.json',
			pickup
			).subscribe((response : {name: string})=>{
				console.log(response)
				this.router.navigate (['/pickups/'+response.name])
			})
	}

  // Gets all pickups from db
	getPickups(){
		this.http.get<Pickup[]>('https://pickmeup-307305-default-rtdb.firebaseio.com/pickups.json')
		.pipe(			
			// map(
			// 	// pickups.map(p => {
			// 	// 	console.log(p)
			// 	// })
			// )
		)
		.subscribe(pickups => {
			console.log(pickups)
			// this.pickupsService.setPickups(pickups);
		})
	}	

  // Update a specific pickup
	updatePickup(id: number, pickup: Pickup){
		this.http.put('https://pickmeup-307305-default-rtdb.firebaseio.com/pickups/' + id + '.json'
			, pickup)
		.subscribe(res => {
			console.log(res)
		})
	}

  // Adds the driver for the pickup
	pickupDriver(id: string, driverId: string) {
		this.http.patch('https://pickmeup-307305-default-rtdb.firebaseio.com/pickups/' + id + '.json'
			, {driver: driverId, status: 'claimed'})
		.subscribe(res => {
			console.log(res)
		})
	}

  // Removes the driver for the pickup
	unclaimPickup(id: string) {
		this.http.patch('https://pickmeup-307305-default-rtdb.firebaseio.com/pickups/' + id + '.json'
			, {driver: null, status: 'unclaimed'})
		.subscribe(res => {
			console.log(res)
		})
	}
  
  // Change status to retrieved
	retrieved(id: string) {
		this.http.patch('https://pickmeup-307305-default-rtdb.firebaseio.com/pickups/' + id + '.json'
			, {status: 'retrieved'})
		.subscribe(res => {
			console.log(res)
		})
	}

  // Change status to delivered
	delivered(id: string) {
		this.http.patch('https://pickmeup-307305-default-rtdb.firebaseio.com/pickups/' + id + '.json'
			, {status: 'delivered'})
		.subscribe(res => {
			console.log(res)
		})
	}


}


export class AppComponent {


}
