import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { LoginService } from '../../providers/login-service';
import { ToastService } from '../../providers/toast-service'
import { AuthService } from '../../providers/auth.service';
import { HomePage } from '../home/home';
import { inforceDevice } from '../../config/config';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

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
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public service: LoginService, private toastCtrl: ToastService, private auth: AuthService,private uid: Uid, private androidPermissions: AndroidPermissions, private plt: Platform, private alert: AlertController) { 
        this.isUsernameValid= true;
        this.isPasswordValid = true;
        this.data = this.service.getDataForLoginFlat();
        this.events =  {
          "onLogin" : this.onLogin
        }
    }

    onEvent = async (event: string) => {
        if (event == "onLogin" && !this.validate()) {
            return ;
        }
        if (this.events[event]) {
            let loginData = {
                'user': this.username,
                'pass': this.password,
                'imei': null
            }; 
            if(inforceDevice && this.plt.is('mobileweb')){
                let notAllowed = this.alert.create({
                    title: "Denegado",
                    message: "Se ha denegado el acceso ya que no se permite el acceso a través de explorador"
                })
                notAllowed.present();
                return;
            } else if (inforceDevice && this.plt.is('mobile')){
                let response = await this.getImei();
                if(response.imei){
                    console.log(response.imei);
                    loginData.imei = response.imei;
                } else {
                    let alert = this.alert.create({
                        title: "Éxito",
                        message: response.msg
                    });
                    alert.present();
                    return;
                }
            } else {
                console.log("SKIPPING IMEI VALIDATION");
            }
            this.events[event](loginData);
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

    getImei(): Promise<{imei?: string, msg?: string}> {
        return new Promise( async (resolve, reject) => {
            const { hasPermission } = await this.androidPermissions.checkPermission(
                this.androidPermissions.PERMISSION.READ_PHONE_STATE
            );
             
            if (!hasPermission) {
                const result = await this.androidPermissions.requestPermission(
                    this.androidPermissions.PERMISSION.READ_PHONE_STATE
                );
                if (!result.hasPermission) {
                    reject({err: 'Permisos requeridos'});
                } else {
                    resolve({msg: "Permisos activados. Porfavor reinicie la aplicación"});
                }
            } else {
                console.log("IMEI", this.uid.IMEI);
                resolve({imei: this.uid.IMEI});
            }
            
        })    
    }
}
