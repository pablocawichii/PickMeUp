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
// Shows list of Drivers
export class DriverComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  @ViewChild('f', {static: false}) ndForm: NgForm;
  drivers: Driver[]
  
  constructor(private dsService: DriversService, private dstorage: DriverStorageService) { }

  ngOnInit() {
    this.subscription = this.dsService.driversChanged.subscribe(drivers => {
      this.drivers = drivers;
    });
    this.dstorage.getDrivers()
  }

  // Adds new Driver
  addNewDriver(form: NgForm){
      const value = form.value;
      const newDriver = new Driver(value.email, value.name, value.status);

      this.dsService.addDrivers(newDriver);

      this.dstorage.saveAllDrivers();

      this.clear()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clear() {
    this.ndForm.reset();
  }

  // Saves All Local Drivers to DB
  save() {
    this.dstorage.saveAllDrivers();
  }

}
