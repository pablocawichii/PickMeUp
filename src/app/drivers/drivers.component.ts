/*IMPORTS FROM FILES - NEEDED FOR THE DISPLAYING THE DATA FROM THE DATABASE*/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Subscription, Observable } from 'rxjs'
import { NgForm } from '@angular/forms'
import { DriversService } from './drivers.service'
import { DriverStorageService } from './drivers-database.service'
import { Driver } from './drivers.model'
import { Router } from '@angular/router'


@Component({
  selector: 'app-driver',
  templateUrl: './drivers.component.html',
  styleUrls: []
})
export class DriverComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  @ViewChild('f', {static: false}) ndForm: NgForm;
  drivers: Driver[]
  
  
  constructor(private dsService: DriversService, private dstorage: DriverStorageService) { }

  /*GETS THE DATA OF THE DRIVER FROM THE DATABASE*/
  ngOnInit() {
    this.subscription = this.dsService.driversChanged.subscribe(drivers => {
      this.drivers = drivers;
    });
    this.dstorage.getDrivers()
  }
  
  /*ADD A DRIVER TO THE DATABASE - CREATES VARIABLES FIRST*/
  addNewDriver(form: NgForm){
      const value = form.value;
      const newDriver = new Driver(value.email, value.name, value.status); /*DRIVER OBJECT - STORES THE EMAIL, NAME AND STATUS*/

      this.dsService.addDrivers(newDriver);

      this.dstorage.saveAllDrivers();

      this.clear()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

   /*CLEARS THE FORM FIELD*/
  clear() {
    this.ndForm.reset();
  }

  /*SAVES THE DATA FROM THE WEBPAGE TO THE DATABASE*/
  save() {
    this.dstorage.saveAllDrivers();
  }

}
