import { HomePage } from './../home/home';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('email') email: any;
  public username: string;
  public password: string;
  public error: string;

  constructor(private navCtrl: NavController,private  auth: AuthProvider,private toast: ToastController) {
  }

  ionViewDidLoad(): void {  
    setTimeout(() => {
      this.email.setFocus();
    }, 500);
  }

  /**
   * login
   */
  public login() {
    if(this.username=="medlog" && this.password=="foobarlong"){
      this.navCtrl.setRoot(HomePage);
    }
    else{
      this.toast.create({
        message: 'Usuário ou senha inválidos',
        duration: 3000,
        position: 'bottom'
      }).present();
    }
    //this.auth.login(this.username, this.password);
  }
} 