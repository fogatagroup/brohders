import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { AlertController } from 'ionic-angular';
import { serverUrl } from '../config/config';
import { HttpService } from './http.service';
import { LoggedUser } from '../models/logged-user';
import { ApiResponse } from '../models/response';
import { now, addMinutes } from '../utils/date.utils';
import { Guid } from 'guid-typescript';
import { User } from '../models/user';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { Page } from 'ionic-angular/navigation/nav-util';


@Injectable()
export class AuthService {
    loggedUser: LoggedUser;
    constructor(private http: HttpService, private alertCtrl:AlertController, /*private navCtrl: NavController*/) { }

    login(params: any): Promise<any>{
        const data = {
            username: params.user,
            password_hash: params.pass,
            imei: params.imei
        }
        return new Promise((resolve, reject) => {
            this.http.login(`users/login`,data).subscribe( response => {
                let expires = addMinutes(now(), 720).getDate();
                let entity = response.json();
                this.loggedUser = {
                    user: {...entity.user, role: entity.role},
                    token: Guid.create(),
                    expires: expires
                };
                sessionStorage.setItem("brohders-user", JSON.stringify(this.loggedUser));
                console.log(this.loggedUser);
                resolve();
            }, err => {
                console.log(err);
                reject();
            })
        })
    }

    getLoggerUser(): User | null {
        let user = sessionStorage.getItem("brohders-user");
        let loggedUser = null;
        try {
            loggedUser = JSON.parse(user) as LoggedUser;
        } catch(err){
            return null;
        }
        return loggedUser.user || loggedUser;
    }

    logout(): Promise<any> {
        return new Promise(res => {
            sessionStorage.setItem("brohders-user", "");
            this.loggedUser = new LoggedUser();
            res();
        })
    }

    isAuthenticated():Boolean {
        let user = sessionStorage.getItem("brohders-user");
        try {
            let parsedUser = JSON.parse(user);
            console.log("USER:", parsedUser);
            this.loggedUser = parsedUser as LoggedUser;
            return parsedUser;
        } catch {
            return false;
        }
    }

    isAuthorized(pageName: string){
        let name = pageName.toLowerCase().replace(/page/g, "")
        console.log("CHECKING AUTH FOR", name);
        try {
            let page = this.loggedUser.user.role.pages.find(p => name == p);
            return !(!page);
        } catch(err){
            console.log("PAGE AUTH ERROR:", err);
            return false;
        }
    }
    /*
    pushNavigate(page: Page){
        if(this.isAuthorized(page.name)){
            this.navCtrl.push(page);
        } else {
            let alert = this.alertCtrl.create({
                title: 'Autorización',
                subTitle: 'No tiene permisos para acceder a esa página',
                buttons: ['Aceptar']
            });
            alert.present();
        }
    }

    rootNavigate(page: Page){
        if(this.isAuthorized(page.name)){
            this.navCtrl.setRoot(page);
        } else {
            let alert = this.alertCtrl.create({
                title: 'Autorización',
                subTitle: 'No tiene permisos para acceder a esa página',
                buttons: ['Aceptar']
            });
            alert.present();
        }
    }
    */
}