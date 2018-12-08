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


@Injectable()
export class AuthService {
    loggedUser: LoggedUser;
    constructor(private http: HttpService, private alertCtrl:AlertController) { }

    login(params: any): Promise<any>{
        return new Promise((resolve, reject) => {
            this.http.post(`users/${params.user}/login`,params).subscribe(r => {
                this.loggedUser = r._body;
                sessionStorage.setItem("brohders-user", JSON.stringify(this.loggedUser));
                resolve();
            }, err => {
                console.log(err);
                reject();
            })
        })
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
            this.loggedUser = parsedUser as LoggedUser;
            return true;
        } catch {
            return false;
        }
    }
}