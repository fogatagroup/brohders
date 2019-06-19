import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { HttpService } from '../../providers/http.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Role } from '../../models/roles';
import { updateDate } from 'ionic-angular/util/datetime-util';
import { Device } from '../../models/device';

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  users: User[];
  roles: Role[];
  devices: Device[];
  selectedUser: User;
  order: string = 'Z-A';
  constructor(public navCtrl: NavController,  private http: HttpService, private alertCtrl: AlertController) {

  }

  ngOnInit(): void {
    this.fetch();
    this.fetchRoles();
    this.fetchDevices();
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
            this.http.delete("users", id).subscribe(r => {
              this.refresh();
            })
          }
        }
      ]
    });
    alert.present();
  }

  fetchRoles(){
    this.http.get("roles").subscribe(res => {
      this.roles = res.json() as Role[];
    })
  }

  fetchDevices(){
    this.http.get("devices").subscribe(res => {
      this.devices = res.json() as Device[];
    })
  }

  fetch(){
    this.http.get("users").subscribe(res => {
      this.users = res.json() as User[];
    })
  }

  refresh(){
    this.fetch();
    this.selectedUser = null
  }

  add(){
    this.selectedUser = new User();
  }

  select(user: User){
    this.selectedUser = {...user};
  }

  saveForm(){
    let user = this.users.find(p => p.userid == this.selectedUser.userid);
    let updatedUser = {
      name: this.selectedUser.name,
      lastname: this.selectedUser.lastname,
      password_hash: this.selectedUser.password_hash,
      roleid: this.selectedUser.roleid,
      deviceid: this.selectedUser.deviceid
    } as User;
    if(user){
      this.http.patch<User>("users", user.userid, updatedUser).subscribe(res => {
        this.refresh();
      })
    } else {
      updatedUser.username = this.selectedUser.username; 
      this.http.post("users", updatedUser).subscribe(res => {
        this.refresh();
      })
    }
  }

  cancelForm(){
    this.selectedUser = null;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
  }
  changeOrder(){
    if(this.order == 'Z-A'){
      this.users.sort( (a, b) =>{
        if (a.username > b.username){
          return 1;
        }
        if (a.username < b.username) {
          return -1;
        }
    })
      this.order = 'A-Z';
    }else {
      this.users.sort( (a, b) =>{
        if (a.username < b.username){
          return 1;
        }
        if (a.username > b.username) {
          return -1;
        }
    })
      this.order = 'Z-A';
    }
  }
}
