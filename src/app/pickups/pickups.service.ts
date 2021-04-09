import { Injectable } from '@angular/core';
import { map, tap, toArray } from 'rxjs/operators'

import { Pickup } from './pickup.model';
import { Subject, Observable } from 'rxjs'

import { AngularFireDatabase } from '@angular/fire/database';

// Local Instance of DB
@Injectable()
export class PickupsService {
	pickupsChanged = new Subject<Pickup[]>();

	dbPickups: Observable<any[]>;
	private pickups: Pickup[] = [];


	constructor(private db: AngularFireDatabase) {

	}

  // Make DB pickups into Pickup Model
	initOb() {
		this.dbPickups = this.db.list('pickups').snapshotChanges().pipe(
			map(pickups=>
				pickups.map(p => {
					let k = { ...p.payload.val() as Pickup}
					let x : Pickup = { id: p.payload.key, ...k }
					x.dateTimeSeconds = (new Date(x.dateTime).valueOf())
					return (
						x
					)}
					
				)
			)
			);
	}

  // Retrieve Pickups from db
	getAllPickups(){
		return this.db.list('pickups').snapshotChanges()
		.pipe(
			map(pickups=>
				pickups.map(p => {
					let k = { ...p.payload.val() as Pickup}
					let x : Pickup = { id: p.payload.key, ...k }
					x.dateTimeSeconds = (new Date(x.dateTime).valueOf())
					return (
						x
					)}
				)
			)
			)
	}

  // retrieve pickup from db
	getPick(id: string){

		return this.db.list('pickups/'+id).snapshotChanges()
	}

  // Retrieve unclaimed pickups only
	getUnclaimedPickups() : Observable<any[]>{
		return this.db.list('pickups').snapshotChanges().pipe(
			map(pickups=>
				pickups.map(p => {
					let k = { ...p.payload.val() as Pickup}
					let x : Pickup = { id: p.payload.key, ...k }
					x.dateTimeSeconds = (new Date(x.dateTime).valueOf())
					return (
						x
					)}
				)
			),
  			map((pick) => pick.filter((p) => p.status == 'unclaimed')),
			)
	}

  // Set the local list of pickups
	setPickups(pickups: Pickup[]){
		this.pickups = pickups;
		console.log(this.pickups.valueOf())
		this.pickupsChanged.next(this.pickups.slice());
	}

  // return a reference to a pickup
	getRef(id: string) {
		let pickup;
		return this.db.list('pickups/'+id).snapshotChanges().pipe(			
				tap(s => {console.log(s); pickup = s; return pickup})
			)
		
	}

  // Get local instance of pickups
	getPickups() {
		return this.pickups.slice();
	}

  // Get specific local pickup
	getPickup(id: number) : Pickup {

		return this.pickups[id];
	}

  // Claim specific local pickup
	claimPickup(id:number, driverid: string) {
		this.pickups[id].status = 'claimed';
		this.pickups[id].driver = driverid
		this.pickupsChanged.next(this.pickups.slice());	
	}

  // Add pickup locally
	addPickup(pickup: Pickup) {
		this.pickups.push(pickup);
		this.pickupsChanged.next(this.pickups.slice());
	}

  // Update local pickup
	updatePickup(index: number, pickup: Pickup) {
		this.pickups[index] = pickup;
		this.pickupsChanged.next(this.pickups.slice());
	}

  // Delete pickup locally
	deletePickup(index: number) {
		this.pickups.splice(index, 1);
		this.pickupsChanged.next(this.pickups.slice());
	}


}
