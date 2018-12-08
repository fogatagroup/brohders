import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { AlertController } from 'ionic-angular';
import { serverUrl } from '../config/config';


@Injectable()
export class HttpService {


  constructor(private http: Http, private alertCtrl:AlertController) { }

  get(url: string): Observable<any> {
    var headers = new Headers({ 'Content-Type': 'application/json', 'method':'GET'});
    return this.http.get(`${serverUrl}/${url}`, { headers: headers })
      .map(response => response)
      .catch(
        error => {
          console.log(error)
            let alert = this.alertCtrl.create({
                title: 'Problemas de Conexión',
                subTitle: 'Intente recargar la página',
                buttons: ['Aceptar']
              });
              alert.present();
            return Observable.throw(error)
            }
        )
  }
  put(url: string, body: any) {
    var headers = new Headers({ 'Content-Type': 'application/json'});
    return this.http.put(`${serverUrl}/${url}`, body, { headers: headers })
      .map(response => response)
      .catch(
        error => {
            let alert = this.alertCtrl.create({
                title: 'Problemas de Conexión',
                subTitle: 'Intente recargar la página',
                buttons: ['Aceptar']
              });
              alert.present();
            return Observable.throw(error)
            }
        )
  }
  post(url: string, body: any) {
    var headers = new Headers({ 'Content-Type': 'application/json'});
    return this.http.post(`${serverUrl}/${url}`, body, { headers: headers })
      .map(response => response)
      .catch(
        error => {
            let alert = this.alertCtrl.create({
                title: 'Problemas de Conexión',
                subTitle: 'Intente recargar la página',
                buttons: ['Aceptar']
              });
              alert.present();
            return Observable.throw(error)
            }
        )
  }
  delete(url: string) {
    var headers = new Headers({ 'Content-Type': 'application/json'});
    return this.http.delete(`${serverUrl}/${url}`, { headers: headers })
      .map(response => response)
      .catch(
        error => {
            let alert = this.alertCtrl.create({
                title: 'Problemas de Conexión',
                subTitle: 'Intente recargar la página',
                buttons: ['Aceptar']
              });
              alert.present();
            return Observable.throw(error)
            }
        )
  }
}