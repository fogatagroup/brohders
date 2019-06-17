import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Client } from '../../models/clients';
import { HttpService } from '../../providers/http.service';
import { TastingsPage } from '../tastings/tastings';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the ClientsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-clients',
  templateUrl: 'clients.html',
})
export class ClientsPage {

  clients: Client[];
  selectedClient: Client;
  order:string = 'Z-A';

  constructor(public navCtrl: NavController, public navParams: NavParams,private http: HttpService, private alertCtrl: AlertController) {
      this.refreshClients();
  }

  refreshClients() {
    this.http.get(`clients`).subscribe(response => {
      this.clients = response.json() as Client[];
      console.log("CLIENTES", this.clients);
    });
  }

  select(client: Client){
    this.selectedClient = {...client};
  }

  add(){
    this.selectedClient = new Client();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientsPage');
  }

  private resetPage() {
    this.refreshClients();
    this.selectedClient = null;
  }


  saveForm(){
    let client = this.clients.find(c => c.clientid == this.selectedClient.clientid);
    if(!client){
      this.http.post("clients", this.selectedClient).subscribe(r => {
        this.selectedClient = r.json();
        this.resetPage();
      });
    } else {
      client.name = this.selectedClient.name;
      client.description = this.selectedClient.description;
      this.http.put("clients", client.clientid, client).subscribe(r => {
        this.resetPage();
      });
    }
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
            this.http.delete("clients", id).subscribe(r => {
              this.resetPage();
            })
          }
        }
      ]
    });
    alert.present();
  }

  cancelForm(){
    this.selectedClient = null;
  }

  onShopSelect(item) {
    console.log("CLIENT:", item);
    this.navCtrl.push(TastingsPage, {
      item: item
    });
  }

  changeOrder(){
    if(this.order == 'Z-A'){
      this.clients.sort( (a, b) =>{
        if (a.name > b.name){
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
    })
      this.order = 'Z-A';
    }else {
      this.clients.sort( (a, b) =>{
        if (a.name < b.name){
          return 1;
        }
        if (a.name > b.name) {
          return -1;
        }
    })
      this.order = 'Z-A';
    }
  }
}
