import { Injectable } from '@angular/core';

import { Loc } from '../locations.model';
import { Driver } from './drivers.model'
import { Car } from './car.model'
import { Subject } from 'rxjs'

// Local Drivers Storage
@Injectable()
export class DriversService {
	driversChanged = new Subject<Driver[]>();

	currentDriverId = 0;
	private drivers: Driver[] = [];

	constructor() {}

  // Set Local Drivers
	setDrivers(drivers: Driver[]){
		this.drivers = drivers;
		this.driversChanged.next(this.drivers.slice());
	}

  // Get Local Drivers
	getDrivers() {
		return this.drivers.slice();
	}

  // Get Specific Local Driver
	getDriver(id: string) : Driver {
		return this.drivers[id];
	}

  // Get Specific Driver Location
	getDriverLocation(id:string): {lat: number, lng: number}{
		return this.drivers[0].lkl;
	}

  // Adds a Driver Locally
	addDrivers(driver: Driver) {
		this.drivers.push(driver);
		this.driversChanged.next(this.drivers.slice());
	}

  // Updates a Driver Locally
	updateDriver(index: number, driver: Driver) {
		this.drivers[index] = driver;
		this.driversChanged.next(this.drivers.slice());
	}

  // Deletes a Driver Locally
	deleteDriver(index: number) {
		this.drivers.splice(index, 1);
		this.driversChanged.next(this.drivers.slice());
	}


}
