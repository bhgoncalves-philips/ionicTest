import { LocationProvider } from './../../providers/location/location';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public locationTracker: LocationProvider) {

  }

  start(){
    this.locationTracker.startTracking();
  }
 
  stop(){
    this.locationTracker.stopTracking();
  }

  ionViewDidEnter(){
    this.locationTracker.startTracking();
  }




}
