import { Component } from '@angular/core';
import { Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Shop } from '../../models/shops';
import { HttpService } from '../../providers/http.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the UserShopsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user-shops',
  templateUrl: 'user-shops.html'
})
export class UserShopsComponent {

  @Input() userid: number;
  
  shops: Shop[];
  selectedItem: Shop;
  usershops: Shop[];

  constructor(private http: HttpService, private alertCtrl: AlertController) {}

  ngOnInit(){
    this.userid && this.http.get(`users/${this.userid}/shops`).subscribe(resp => this.usershops = resp.json() as Shop[]);
    this.http.get("shops").subscribe(res => this.shops = res.json() as Shop[]);
  }

  refresh(){
    this.userid && this.http.get(`users/${this.userid}/shops`).subscribe(resp => this.usershops = resp.json() as Shop[]);
    this.selectedItem = null;
  }

  add(){
    this.selectedItem = new Shop();
  }

  cancelForm(){
    this.selectedItem = null;
  }

  saveForm(){
    let shop = {
      shopid: this.selectedItem.shopid
    }
    this.http.post(`users/${this.userid}/shops`, shop).subscribe(r => {
      this.selectedItem = r.json();
      this.refresh();
    })
  }

  deleteShop(id: number){
    let alert = this.alertCtrl.create({
      title: 'Elminar registro',
      message: '¿Está seguro de eliminar la tienda para este usuario? Esta acción es irreversible',
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Si',
          handler: () => {
            this.http.delete(`users/${this.userid}/shops/`, id).subscribe(r => {
              this.refresh();
            })
          }
        }
      ]
    });
    alert.present();
  }

 

}
