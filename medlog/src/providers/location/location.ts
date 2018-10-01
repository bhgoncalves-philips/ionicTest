import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { BaseApiProvider } from './../base-api/base-api';

/*
  Generated class for the LocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {

  constructor(public baseApi: BaseApiProvider,
    private geolocation: Geolocation,
    private backgroundGeolocation: BackgroundGeolocation,
    private zone: NgZone) {
  }
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  private _url = "position_logs/";


  startTracking() {
    this.getForegroundPosition();
    this.getBackgroundPosition();
  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();

  }

  getLocation() {
    if (this.backgroundGeolocation.Mode == this.backgroundGeolocation.Mode.FOREGROUND) {
      this.getForegroundPosition();
    }
  }

  getForegroundPosition() {
    // Foreground Tracking
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      console.log(position);
      this.sendLocation(position.coords.latitude, position.coords.longitude);
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    });
  }

  getBackgroundPosition() {
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      this.sendLocation(location.latitude, location.longitude)

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();
  }

  public sendLocation(lat, long) {
    this.baseApi.post(this._url,
      {
        health_professional: 2,
        latitude: lat,
        longitude: long
      }
    ).subscribe(
      data => {
        console.log("successo")
      },
      error => {
        console.log(error);
      }
    );
  }
}
