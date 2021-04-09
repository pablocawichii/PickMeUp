import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, tap } from 'rxjs/operators'
import { DriversService } from './drivers.service'
import { Driver } from './drivers.model'
import { Loc } from '../locations.model'

// Driver DB Connection
@Injectable({providedIn: 'root'})
export class DriverStorageService {

	constructor(private http: HttpClient, private driversService: DriversService) {
	}


  // Updates all driveres according to local system
	saveAllDrivers() {
		const drivers = this.driversService.getDrivers();
		this.http.put('https://pickmeup-307305-default-rtdb.firebaseio.com/drivers.json',
			drivers
			).subscribe((response)=>{
				console.log(response)
			})
	}

  //  Adds new driver
	saveDriver(driver: Driver){
		const regex = /[.]/ig;
		this.http.put('https://pickmeup-307305-default-rtdb.firebaseio.com/drivers/'+ driver.email.replace(regex, '') +'.json',
			driver
			).subscribe((response)=>{
				console.log(response)
			})
	}
	
  // Adds new driver by post request
	saveDriverPost(driver: Driver){
		this.http.post('https://pickmeup-307305-default-rtdb.firebaseio.com/drivers.json',
			driver
			).subscribe((response)=>{
				console.log(response)
				if(!!response){
					this.getDrivers()
				}
			})

	}

  // Returns a specific driver
	getDrivers(){
		this.http.get<Driver[]>('https://pickmeup-307305-default-rtdb.firebaseio.com/drivers.json')
		.pipe(
			map(drivers => {
				return drivers.map(driver=> {
					return {...driver, cars: driver.cars ? driver.cars : []} 
				})
				}
			)
		).subscribe(drivers => {
			this.driversService.setDrivers(drivers);
		})
	}

  // Update driver to current location
	updateDriverLocation(uid: string) {
		let location;
		 if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(position => {

	        location = {lat: position.coords.latitude, lng: position.coords.longitude};
			this.http.patch('https://pickmeup-307305-default-rtdb.firebaseio.com/drivers/' + 0 + '.json'
				, {lkl: location})
			.subscribe(res => {
				console.log(res)
			})
		})
	    }else{
	      console.log("User not allowed")
	    }

	}

  // Retrieves Driver Location from DB
	getDriverLocation(uid: string) {
		this.http.get('https://pickmeup-307305-default-rtdb.firebaseio.com/drivers/' + 0 + '.json')
		.subscribe(res => {
			console.log(res)
		})
	}

  
  // Updates Driver in DB
	updateDriverNonLocation(id: string, driver: Driver){
		console.log(driver)
		this.http.put('https://pickmeup-307305-default-rtdb.firebaseio.com/drivers/' + 0 + '.json'
			, driver)
		.subscribe(res => {
			console.log(res)
		})
	}


	// fetchData() {
	// 	return this.http.get<Loc[]>('https://pickmeup-307305-default-rtdb.firebaseio.com/locations.json')
	// 	.pipe(
	// 		map(locations => {
	// 			return locations.map(recipe=> {
	// 				return {} // {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
	// 			});
	// 		}
	// 	),
	// 		tap((locations: Loc[]) => {
	// 			this.locationsService.setLocations(locations)
	// 		})
	// 	)
	// }


}
