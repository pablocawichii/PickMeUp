import { Loc } from '../locations.model'
import { Car } from './car.model'
// Driver Model 
export class Driver {
	public uid?: string;
	public id: string;
	public email: string;
	public name: string;
	public lkl: Loc;
	public status: string;
	public cars: Car[];
	public currentCar: number;

	constructor(email: string, name: string, status: string) {
		this.email = email;
		this.name = name;
		this.lkl = {lat: 0, lng: 0};
		this.status = status;
		this.cars = []
		this.currentCar = -1;
	}
}
