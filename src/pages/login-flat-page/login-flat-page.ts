import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginService } from '../../providers/login-service';
import { ToastService } from '../../providers/toast-service'
import { AuthService } from '../../providers/auth.service';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'login-flat-page',
  templateUrl: 'login-flat-page.html',
  providers: [
    LoginService, ToastService
  ]
})
export class LoginFlatPage {

    data : {};
    events: {};
    public username: string;
    public password: string;
    

    public isUsernameValid: boolean;
    public isPasswordValid: boolean;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public service: LoginService, private toastCtrl: ToastService, private auth: AuthService) { 
        this.isUsernameValid= true;
        this.isPasswordValid = true;
        this.data = this.service.getDataForLoginFlat();
        this.events =  {
          "onLogin" : this.onLogin
        }
    }

    onEvent = (event: string): void => {
        if (event == "onLogin" && !this.validate()) {
            return ;
        }
        if (this.events[event]) {
            this.events[event]({
                'user': this.username,
                'pass': this.password
            });
        }        
    }

    onLogin = (params): void => {
      this.toastCtrl.presentToast('Ingresando');
      this.auth.login(params).then(_ => {
        this.navCtrl.setRoot(HomePage);
      }, _ => {
        this.toastCtrl.presentToast("Error al ingresar")
      })
    };

    validate():boolean {
        this.isUsernameValid = true;
        this.isPasswordValid = true;
        if (!this.username ||this.username.length == 0) {
            this.isUsernameValid = false;
        }

        if (!this.password || this.password.length == 0) {
            this.isPasswordValid = false;
        }
        
        return this.isPasswordValid && this.isUsernameValid;
    }
}
