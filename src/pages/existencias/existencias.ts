import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Shelve, Stock } from '../../models/shelves';
import { Tastings, Tasting_Increase } from '../../models/tastings';
import { sales } from '../../data/sales';
import { weekdays } from '../../config/config';
import { products } from '../../data/products';
import { quartil,lir,lsr, final_result } from '../../utils/utils.functions';
import { isDifferent } from '@angular/core/src/render3/util';
import { HttpService } from '../../providers/http.service';
import { AuthService } from '../../providers/auth.service';
import { User } from '../../models/user';
import { Shop } from '../../models/shops';
import { Sale } from '../../models/sales';
import { Product } from '../../models/products';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import * as moment from 'moment';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Transaction } from '../../models/transaction';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

/**
 * Generated class for the ExistenciasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-existencias',
  templateUrl: 'existencias.html',
})
export class ExistenciasPage {

  public shelveList:Shelve[] = [];
  private tastingList:Tastings[];
  private aumentoList:Tasting_Increase[];
  private sales: Sale[];
  private products:Product[];
  private loading:boolean=false;
  private weekdays=weekdays;
  private stockList:Stock[];
  private pronostico:{productid:number;value:number}[]=[];
  private user: User;
  public shops: Shop[];
  public selectedShop: Shop | null;
  public productForm: FormGroup;
  public ventaForm: FormGroup;
  public calculado: boolean = false;
  private diaCalculado: moment.Moment;
  private currentSales: Sale[];
  public comentarioVenta: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpService, private auth: AuthService, private fb: FormBuilder, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.getData();
  }

  ngOnInit(): void {
  }
  
  refresh(): void {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  getData(){
    this.user = this.auth.getLoggerUser();
    this.http.get(`users/${this.user.userid}/shops`).subscribe(res => {
      this.shops = res.json() as Shop[];
    })
    this.http.get(`products`).subscribe(res => {
      this.products = res.json() as Product[];
    })
    //this.shelveList=JSON.parse(localStorage.getItem('Shelves'));
    //this.tastingList=JSON.parse(localStorage.getItem('Tastings'));
    //this.aumentoList=JSON.parse(localStorage.getItem('Increase'));
    //this.stockList=JSON.parse(localStorage.getItem("Stock"));
  }

  selectShop(){
    this.http.get(`shops/${this.selectedShop.shopid}/shelves`).subscribe(r => {
      let shelves = r.json() as Shelve[];
      let formObject = {};
      shelves.forEach(p => {
        formObject[p.productid] = new FormControl('',[Validators.required, Validators.min(0)]);
      })
      this.productForm = this.fb.group(formObject);
      this.shelveList = shelves;
    })
  }

  checkIfValid(form: FormGroup){
    for(let c in form.controls){
      console.log(c + " is valid: " + form.controls[c].valid);
    }
    console.log("FORM IS ", form.valid);
  }

  convert(day){
    if(day==0){
      return 7;
    }else{
      return day;
    }
  }

  convertIdToName(id:number){
    return this.products.filter(t=>t.productid==id)[0].name;
  }

  isDistinctSale(){
    let isEqual = false;
    for(let c in this.ventaForm.value){
      let p = this.pronostico.find(p => p.productid == Number(c));
      if(this.ventaForm.value[c] != p.value){
        return true;
      }
    }
    return false;
  }

  saveSale(value1, comentario){
    this.diaCalculado = moment(value1.year+'-'+value1.month+'-'+value1.day, 'YYYY-MM-DD'); 
    if(this.diaCalculado){
      this.comentarioVenta = comentario;
      let loading = this.loadingCtrl.create({
        content: "Verificando ventas/existencia..."
      })
      loading.present();
      let diaSemanaActual = this.diaCalculado.day();
      //Generamos las ventas a guardar
      this.currentSales = this.shelveList.map(p => {
        let existencia = this.productForm.value[Object.keys(this.productForm.value).find(k => Number(k) == p.productid)];
        return {
          forecast: 0, 
          monto: 0,
          stock: Number(existencia), 
          dispatch: 0, 
          semana: this.diaCalculado.month() == 11 && this.diaCalculado.week() == 1 && !this.diaCalculado.day() ? 52 : this.diaCalculado.week() - (!this.diaCalculado.day() ? 1 : 0),
          year: this.diaCalculado.month() == 11 /*DICIEMBRE */ && this.diaCalculado.week() == 1 && this.diaCalculado.day() ?  this.diaCalculado.year() + 1 : this.diaCalculado.year(), 
          productid: p.productid,
          userid: this.user.userid,
          weekday: !diaSemanaActual ? 7 : diaSemanaActual} as Sale
      })

      let filter = {
        where: {
          shopid: this.selectedShop.shopid,
          week: this.diaCalculado.month() == 11 && this.diaCalculado.week() == 1 && !this.diaCalculado.day() ? 52 : this.diaCalculado.week() - (!this.diaCalculado.day() ? 1 : 0),
          year: this.diaCalculado.month() == 11 /*DICIEMBRE */ && this.diaCalculado.week() == 1 && this.diaCalculado.day() ?  this.diaCalculado.year() + 1 : this.diaCalculado.year(),
          weekday: !diaSemanaActual ? 7 : diaSemanaActual
        },
        limit: 1
      }
      console.log(filter);
      let sameDaySale = null as Transaction;
      this.http.get(`transactions?filter=${JSON.stringify(filter)}`).subscribe(res => {
        let data = res.json();
        sameDaySale = data.length ? data[0] as Transaction : null;
        console.log("VENTA/EXISTENCIA MISMO DIA: ", sameDaySale);
        if(sameDaySale){
          let alert = this.alertCtrl.create({
            title: 'Existencia creada',
            message: 'Ya hay existencia creada para esta fecha y tienda. Verifique e intente de nuevo',
            buttons: [
              {
                text: 'Aceptar',
                role: 'cancel'
              }
            ]
          });
          loading.dismiss();
          alert.present();
        } else {
          loading.dismiss();
          this.checkPrevDaySale();
        }
      })
    }
  }

  private checkPrevDaySale(){
    let loading = this.loadingCtrl.create({
      content: "Verificando existencia día anterior"
    })
    loading.present();
    let diaAnterior = this.diaCalculado.clone().subtract(1, 'day');
      let diaDeSemana = diaAnterior.day();
      let filterAnterior = {
        where: {
          shopid: this.selectedShop.shopid,
          week: diaAnterior.month() == 11 && diaAnterior.week() == 1 && !diaAnterior.day() ? 52 : diaAnterior.week() - (!diaAnterior.day() ? 1 : 0),
          year: diaAnterior.month() == 11 /* DICIEMBRE */ && diaAnterior.week() == 1 && diaAnterior.day() ?  diaAnterior.year() + 1 : diaAnterior.year(),
          weekday: !diaDeSemana ? 7 : diaDeSemana
        },
        limit: 1
      }
      let lastSale = null as Transaction;
      console.log("FILTRO ANTERIOR:", filterAnterior);
      this.http.get(`transactions?filter=${JSON.stringify(filterAnterior)}`).toPromise().then(res => {
        let data = res.json();
        lastSale = data.length ? data[0] as Transaction : null;
        if(lastSale){
          this.http.get(`sales?filter=${JSON.stringify({where: {transactionid: lastSale.transactionid}})}`).subscribe(res => {
            let sales = res.json() as Sale[];
            for(let i  = 0; sales.length > i; i++){
              let currentSale = this.currentSales.find(p => p.productid == sales[i].productid);
              sales[i].monto = sales[i].stock + sales[i].dispatch - currentSale.stock;
              this.http.patch<Sale>('sales',sales[i].ventaid, sales[i]).toPromise().then(p => {
                console.log(`UPDATED SALE ${sales[i].ventaid}`)
              })
            }
            loading.dismiss();
            this.checkout();
          })
        } else {
          let alertNoSale = this.alertCtrl.create({
            title: 'Dia anterior',
            subTitle: `No se encontró data del dia anterior ${diaAnterior.format("DD/MM/YYYY")} por lo que no se podrá actualizar`,
            buttons: [{
              text: 'Aceptar',
              handler: () => {
                this.checkout();
              }
            }, {
              text: 'Cancelar la transacción',
              role: 'cancel'
            }]
          });
          loading.dismiss();
          alertNoSale.present();
        }
      }, () => {
        loading.dismiss();
      })
  }

  private checkout(){
    if(this.currentSales.length){
      let loading = this.loadingCtrl.create({
        content: "Guardando venta..."
      })
      loading.present();
      let transaction: Transaction = {
        userid: this.user.userid,
        shopid: this.selectedShop.shopid,
        created: moment().format("YYYY-MM-DD"),
        type: 'existencia',
        week: this.diaCalculado.month() == 11 && this.diaCalculado.week() == 1 && !this.diaCalculado.day() ? 52 : this.diaCalculado.week() - (!this.diaCalculado.day() ? 1 : 0),
        year: this.diaCalculado.month() == 11 /*DICIEMBRE */ && this.diaCalculado.week() == 1 && this.diaCalculado.day() ?  this.diaCalculado.year() + 1 : this.diaCalculado.year(),
        weekday: this.diaCalculado.day() ? this.diaCalculado.day() : 7,
        transactiondate: this.diaCalculado.format("YYYY-MM-DD"),
        ventaactualizada: false,
        comentario: this.comentarioVenta
      }
      console.log("Existencia", transaction);
      console.log("DETALLES A GUARDAR", this.currentSales);
      this.http.post(`transactions`,transaction).subscribe(async res => {
        let transactionCreated = res.json() as Transaction;
        console.log("CREADA TRANSACCION", transactionCreated);
        for(let i = 0; this.currentSales.length > i; i++){
          await this.http.post(`sales`, {...this.currentSales[i], transactionid: transactionCreated.transactionid}).subscribe(res => {
            console.log(`INGRESADA Transacccion ${res.json().ventaid}`);
          });
        }
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: "Éxito",
          subTitle: "La existencia ha sido ingresada",
          buttons: [{
            text: "Aceptar",
            handler: () => {
              this.refresh();
            }
          }]
        })
        alert.present();
      })
    }
  }

}
