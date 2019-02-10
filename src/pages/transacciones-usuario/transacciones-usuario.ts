import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../providers/http.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { User } from '../../models/user';
import { Shop } from '../../models/shops';
import { Product } from '../../models/products';
import { Transaction } from '../../models/transaction';
import { Sale } from '../../models/sales';
import { weekdays } from '../../config/config'
import { ExcelService } from '../../providers/excel.service';

/**
 * Generated class for the TransaccionesUsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class UserTransaction {
  semana: number;
  tienda: string;
  producto: string;
  diaSemana: string;
  existencia: number;
  entrega: number;
  pronostico: number;
  venta: number;
  anio: number;
}

@Component({
  selector: 'page-transacciones-usuario',
  templateUrl: 'transacciones-usuario.html',
})
export class TransaccionesUsuarioPage {

  users: User[];
  shops: Shop[];
  products: Product[];
  sales: Sale[] = [];
  selectedUser: User;
  userTransactions: UserTransaction[] = [];
  hasta: number = 100;
  selectedShop: Shop;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpService, private loading: LoadingController, private excel: ExcelService) {
    this.getData();
  }

  private getData(): void {
    this.http.get('users').subscribe(res => this.users = res.json() as User[]);
    this.http.get('products').subscribe(res => this.products = res.json() as Product[]);
    this.http.get('shops').subscribe(res => this.shops = res.json() as Shop[]);
  }

  searchUserTransactions(): void {
    if(this.hasta && this.selectedUser){
      let loading = this.loading.create({
        content: "Cargando datos"
      });
      loading.present();
      this.userTransactions = [];
      let filter = {
        where: {
          userid: this.selectedUser.userid
        },
        order: ['year DESC', 'semana DESC', 'weekday DESC', 'shopid DESC', 'productid DESC'],
        limit: this.hasta
      }
      if(this.selectedShop){
        filter.where['shopid'] = this.selectedShop.shopid;
      }
      this.http.get(`sales?filter=${JSON.stringify(filter)}`).subscribe(res => {
        this.sales = res.json() as Sale[];
        this.sales.forEach(s => {
          console.log("SALE ", s);
          let weekday = weekdays.find(w => w.value == s.weekday);
          let product = this.products.find(p => p.productid == s.productid);
          console.log("PRODUCT", product);
          let shop = this.shops.find(sh => sh.shopid == s.shopid);
          console.log("SHOP ", shop);
          this.userTransactions.push({
            semana: s.semana,
            tienda: shop.name,
            producto: product.name,
            diaSemana: weekday.day,
            existencia: s.stock,
            entrega: s.dispatch,
            pronostico: Math.round(Number(s.forecast) * 100)/100,
            venta: s.monto,
            anio: s.year
          })
        })
        loading.dismiss();
      });
    }
  }

  export(): void {
    this.excel.exportAsExcelFile(this.userTransactions, `transaccionesusuario-${this.selectedUser.username}`)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransaccionesUsuarioPage');
  }

}
