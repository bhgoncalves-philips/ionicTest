import { LocationProvider } from './../../providers/location/location';
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  checkedIn: boolean = false;
  constructor(public navCtrl: NavController, public locationTracker: LocationProvider,private toast: ToastController) {

  }

  start(){
    this.locationTracker.startTracking();
    this.checkedIn = !this.checkedIn;
    this.toast.create({
      message: 'Você fez check-in na unidade de saúde',
      duration: 3000,
      position: 'bottom'
    }).present();
  }
 
  stop(){
    this.locationTracker.stopTracking();
    this.checkedIn=!this.checkedIn;
    this.toast.create({
      message: 'Você fez check-out na unidade de saúde',
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  ionViewDidEnter(){
    this.locationTracker.startTracking();
  }




}
