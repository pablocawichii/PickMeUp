import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { GoogleMap, MapMarker } from '@angular/google-maps'

import { Subscription, Observable } from 'rxjs'

import { Loc } from '../locations.model'
import { LocationsService } from '../locations.service'
import { DataStorageService } from '../data-storage.service'
import { DriverStorageService } from '../drivers/drivers-database.service'
import { DriversService } from '../drivers/drivers.service'


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

	@ViewChild('map', { static: false }) map: GoogleMap

  center: google.maps.LatLngLiteral = {
  	lat: 17.25053108195495, 
  	lng: -88.76979103434168
  }; 
  zoom = 14;

  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions = [];
  userPosition : {lat: number, lng: number};

  lat;
  lng;

	subscription: Subscription;
  
  constructor(private locationsService: LocationsService, private dsService: DataStorageService, private drivStorageService: DriverStorageService, private driversService: DriversService) { }

  // No longer allows users to add markers to map
  addMarker(event: google.maps.MapMouseEvent) {
    // this.locationsService.addLocation(event.latLng.toJSON())
    // this.markerPositions.push(event.latLng.toJSON());
    console.log(event.latLng.toJSON())
  }


  ngOnInit() {
    this.getUserLocation();
    this.drivStorageService.getDrivers();
    
    // Update Drivers when drivers change
    this.subscription = this.driversService.driversChanged.subscribe(
      // Update Driver Locations on Map 
      (drivers) => {
        this.markerPositions = []
        drivers.forEach(d => {
          this.markerPositions.push(d.lkl)
        })
      }
    )

    // Update Drivers every 5 seconds
    setInterval(
      () => {
        this.drivStorageService.getDrivers();
      }
      , 5000)


    // Depracated Movement Simulation
    // setInterval(
    // 	() => {
    // 		for (var i = this.markerPositions.length - 1; i >= 0; i--) {
  		// 		var x = Math.floor(Math.random() * 4);
  		// 		var tempLat = this.markerPositions[i].lat
  		// 		var tempLng = this.markerPositions[i].lng

  		// 		if (x === 0) {
  		// 			tempLat = tempLat + 0.0001 
  		// 		} else if (x === 1) {
  		// 			tempLat = tempLat - 0.0001
  		// 		} else if (x === 2) {
  		// 			tempLng = tempLng + 0.0001
  		// 		} else {
  		// 			tempLng = tempLng - 0.0001
  		// 		}

  		// 		this.locationsService.updateLocation(i, {lat: tempLat, lng: tempLng})
  		// 	}


    // 	}
    // 	,1000);

  	// )


  }

  ngOnDestroy() {
  	this.subscription.unsubscribe();
  }

  save(){
  	this.dsService.saveData();
  }

  // Get current User location to show on map.
  getUserLocation() {
    // get Users current position

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.userPosition = {lat: position.coords.latitude, lng: position.coords.longitude};
      })
    }else{
      console.log("User not allowed")
    }
  }

  mapMarkerClick(event: google.maps.MapMouseEvent) {
    console.log(this.map)
  }

}
