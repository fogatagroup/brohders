import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AlertController } from 'ionic-angular';
import { serverUrl } from '../config/config';


@Injectable()
export class HttpService {


  constructor(private http: Http, private alertCtrl:AlertController) { }

  get(url: string): Observable<any> {
    console.log("GETTING:", url);
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
  put(url: string, id: number, body: any) {
    var headers = new Headers({ 'Content-Type': 'application/json'});
    return this.http.put(`${serverUrl}/${url}/${id}`, body, { headers: headers })
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

  login(url: string, body: any) {
    var headers = new Headers({ 'Content-Type': 'application/json'});
    return this.http.post(`${serverUrl}/${url}`, body, { headers: headers })
      .map(response => response)
      .catch(
        error => {
            let alert = this.alertCtrl.create({
                title: error.status == 500 ? 'Problemas de conexión' : "Credenciales incorrectas",
                subTitle: error.status == 500 ? 'Intente nuevamente' : "Intente nuevamente o contacte a su administrador",
                buttons: ['Aceptar']
              });
              alert.present();
              return Observable.throw(error)
            }
        )
  }


  delete(url: string, id: number) {
    
    var headers = new Headers({ 'Content-Type': 'application/json'});
    return this.http.delete(`${serverUrl}/${url}/${id}`, { headers: headers })
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

  patch<T>(url: string, id: number, body: Partial<T>) {
    var headers = new Headers({ 'Content-Type': 'application/json'});
    return this.http.patch(`${serverUrl}/${url}/${id}`, body, { headers: headers })
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