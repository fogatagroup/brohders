import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Device } from '../../models/device';
import { HttpService } from '../../providers/http.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the DevicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html',
})
export class DevicesPage {

  private loading:boolean=false;
  private items: Device[]=[];
  private selectedItem: Device = null;

  constructor(public navCtrl: NavController,  private http: HttpService, private alertCtrl: AlertController) {

  }

  ngOnInit(): void {
    this.fetch();
  }

  delete(id: number){
    let alert = this.alertCtrl.create({
      title: 'Elminar registro',
      message: '¿Está seguro de eliminar este registro? Esta acción es irreversible',
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Si',
          handler: () => {
            this.http.delete("devices", id).subscribe(r => {
              this.refresh();
            })
          }
        }
      ]
    });
    alert.present();
  }

  fetch(){
    this.http.get("devices").subscribe(res => {
      this.items = res.json() as Device[];
    })
  }

  refresh(){
    this.fetch();
    this.selectedItem = null
  }

  add(){
    this.selectedItem = new Device();
  }

  select(item: Device){
    this.selectedItem = {...item};
  }

  saveForm(){
    let item = this.items.find(p => p.deviceid == this.selectedItem.deviceid);
    let updatedItem = {
      serial: this.selectedItem.serial,
      description: this.selectedItem.description
    }
    if(item){
      this.http.put("devices", item.deviceid, updatedItem).subscribe(res => {
        this.refresh();
      })
    } else {
      this.http.post("devices", updatedItem).subscribe(res => {
        this.refresh();
      })
    }
  }

  cancelForm(){
    this.selectedItem = null;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicesPage');
  }

}
