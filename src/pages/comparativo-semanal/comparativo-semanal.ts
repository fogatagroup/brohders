import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { HttpService } from '../../providers/http.service';
import { AuthService } from '../../providers/auth.service';
import { FormBuilder } from '@angular/forms';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Sale } from '../../models/sales';
import { Transaction } from '../../models/transaction';
import { User } from '../../models/user';
import { Product } from '../../models/products';
import { ExcelService } from '../../providers/excel.service';

/**
 * Generated class for the ComparativoSemanalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class Week {
  start: moment.Moment;
  end: moment.Moment;
}

class UserSale {
  userid: number;
  username: string;
  forecast: number;
  sale: number;
}

@Component({
  selector: 'page-comparativo-semanal',
  templateUrl: 'comparativo-semanal.html',
})
export class ComparativoSemanalPage {

  weeks: Week[];
  selectedWeek: Week;
  transactions: Transaction[];
  sales: Sale[];
  users: User[];
  products: Product[];
  userSales: UserSale[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpService, private auth: AuthService, private fb: FormBuilder, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private excel: ExcelService) {
    this.doWeeks();
    this.getData();
  }

  private getData(): void {
    this.http.get("users").subscribe(res => {
      this.users = res.json() as User[];
    })
    this.http.get("products").subscribe(res => {
      this.products = res.json() as Product[];
    })
  }

  private doWeeks(): void {
    let end = moment().clone().endOf('week');
    let start = moment().clone().startOf('week');
    let weeksBehind = 6;
    this.weeks = [];
    let i = 1;
    this.weeks.push({
      start: start.clone(), 
      end: end.clone()
    });

    
    do {
      this.weeks.push({
        start: start.clone().subtract(i, 'weeks'), 
        end: end.clone().subtract(i, 'weeks')
      })
      i++;
    } while(weeksBehind > i);
    console.log("WEEKS", this.weeks.map(w => {
      return `${w.start.format("DD/MM/YYYY")}-${w.end.format("DD/MM/YYYY")}`
    }))
  }

  onChangeWeek(): void {
    console.log(this.selectedWeek);
    let loading = this.loadingCtrl.create({
      content: "Verificando ventas"
    });
    loading.present();
    let filter = {
      where: {
        transactiondate:{
          inq: []
        },
        type: 'sale'
      }
    }
    let currDate = this.selectedWeek.start.clone();
    do {
      console.log("ADDING", currDate.format("DD/MM/YYYY"));
      filter.where.transactiondate.inq.push(currDate.format("YYYY-MM-DD"));
      currDate.add(1, 'days');
    }
    while(!currDate.isSameOrAfter(this.selectedWeek.end))
    console.log("FILTERING", JSON.stringify(filter));
    this.http.get(`transactions?filter=${JSON.stringify(filter)}`).subscribe(res => {
      this.transactions = res.json() as Transaction[];
      let tranFilter = {
        where: {
          transactionid: {
            inq: []
          }
        }
      }
      for(let i = 0; this.transactions.length > i; i++){
        tranFilter.where.transactionid.inq.push(this.transactions[i].transactionid);
      }
      this.http.get(`sales?filter=${JSON.stringify(tranFilter)}`).subscribe(res => {
        this.sales = res.json() as Sale[];
        this.userSales = [];
        for(let i = 0; this.sales.length > i; i++){
          let userSale = this.userSales.find(u => u.userid == this.sales[i].userid);
          if(!userSale){
            let user = this.users.find(u => u.userid == this.sales[i].userid);
            this.userSales.push({
              userid: user.userid,
              username: user.username,
              forecast: this.sales[i].forecast || 0,
              sale: this.sales[i].dispatch,
            })
          } else {
            userSale.forecast+= this.sales[i].forecast || 0;
            userSale.sale+= this.sales[i].dispatch;
          }
        }
        console.log("VENTAS USUARIOS: ", this.userSales);
        loading.dismiss();
      })
    })
  }

  export(): void {
    this.excel.exportAsExcelFile(this.userSales, `ventaspronostico${this.selectedWeek.start.format('DD/MM/YYYY')}-${this.selectedWeek.end.format('DD/MM/YYYY')}`)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComparativoSemanalPage');
  }

}
