import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// Face of app
export class AppComponent implements OnInit {
  title = 'PickMeUp';

  constructor(){

  }

  ngOnInit(): void {}

}
