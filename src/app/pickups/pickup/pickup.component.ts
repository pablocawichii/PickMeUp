import { Component, OnInit, ViewChild } from '@angular/core';

import { PickupsService } from '../pickups.service';
import { Pickup } from '../pickup.model';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { map, filter, take, tap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { PickupStorageService } from '../pickups-database.service'
import { AuthenticationService } from '../../shared/authentication.service'

import { DriversService } from '../../drivers/drivers.service'
import { DriverStorageService } from '../../drivers/drivers-database.service'

import { GoogleMap, MapMarker, MapDirectionsService } from '@angular/google-maps'


@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.css']
})
// A single Pickup Page
export class PickupComponent implements OnInit {
	pickup: Pickup = new Pickup({lat: 0, lng: 0}, new Date());
	id: string;
  dlo;
  vchanges;

  @ViewChild('map', { static: false }) map: GoogleMap

  center: google.maps.LatLngLiteral = {
  	lat: 17.25053108195495, 
  	lng: -88.76979103434168
  }; 
  zoom = 14;

  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions = [{lat: 0, lng: 0}, {lat: 0, lng: 0}];
  directionsResults$: Observable<google.maps.DirectionsResult|undefined>;

  lat;
  lng;

  constructor(private pickupsService: PickupsService,
  			  private route: ActivatedRoute,
              private router: Router,
              private mapDirectionsService: MapDirectionsService,
              private pickupsStorageService: PickupStorageService,
              public auth: AuthenticationService,
              private dService: DriversService,
              private drivStorageService: DriverStorageService
              ) { 

  }

  ngOnInit() {
    // Get id from route
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
      )

    // Update Drivers every 5 seconds.
    setInterval(() => {this.drivStorageService.getDrivers()}, 5000)
    // Get changes from pickups service
    this.pickupsService.getPick(this.id)
    .subscribe((p)=> {
            // Apply Changes to map
            p.forEach((k, ind) => {
              this.pickup[k.key] = k.payload.val()
              if(p.length == ind + 1) {
                console.log(this.pickup)
                if(this.auth.currentPriv == 'driver' || this.pickup.status == 'claimed') {
                    this.markerPositions[0] = this.pickup.location;
                    this.markerPositions[1] = this.dService.getDriverLocation('0');
                    this.getDirections();
                } else {
                  this.markerPositions[0] = this.pickup.location;
                  this.markerPositions[1] = {lat: 0, lng: 0}
                  this.directionsResults$ = null 
                }
              }
            })
            // this.getData()
            
        })
  

    
      
  }

  // Depracated Function
  getData() {
    if(this.auth.currentPriv == 'driver' || this.pickup.status == 'claimed') {
        this.pickupsService.getAllPickups().pipe(
          map((pick) => pick.filter((p) => p.id == this.id)),
          tap(p => {
            this.markerPositions[0] = {lat: p[0].location.lat, lng: p[0].location.lng};
            this.markerPositions[1] = this.dService.getDriverLocation('0');
            this.getDirections();
          })
        
        ).subscribe((p) => {

        })
    } else {
      this.pickupsService.getAllPickups().pipe(
          map((pick) => pick.filter((p) => p.id == this.id)),
          tap(p => {
            this.markerPositions[0] = {lat: p[0].location.lat, lng: p[0].location.lng};
          })

        ).subscribe((p) => {
          
        })
    }

  }

  // Gets the directions between two locations
  getDirections() {
      const request: google.maps.DirectionsRequest = {
        destination: this.markerPositions[0],
        origin: this.markerPositions[1],
        travelMode: google.maps.TravelMode.DRIVING,
      };
      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
  
  }

  // Sends claim request to db
  claim() {
    this.pickupsStorageService.pickupDriver(this.id, this.auth.data.uid)
  }
  
  // Sends unclaim request to db
  unclaim() {
    this.pickupsStorageService.unclaimPickup(this.id)
  }

  // Sends change in status to db
  retrieved() {
    this.pickupsStorageService.retrieved(this.id)
  }
  
  // Sends change in status to db
  delivered() {
    this.pickupsStorageService.delivered(this.id)
    this.router.navigate(['/'])
  }
}

