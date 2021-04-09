// Car Model as used throughout system
export class Car {
	public model: String;
	public year: Number;
	public brand: String;
	public color: String;

	constructor(model: String, year: Number, brand: String, color: String){
		this.model = model;
		this.year = year;
		this.brand = brand;
		this.color = color;
	}
}
