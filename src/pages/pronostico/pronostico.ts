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
import Swal from 'sweetalert2'

@Component({
  selector: 'page-pronostico',
  templateUrl: 'pronostico.html'
})
export class PronosticoPage implements OnInit{
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
    let loading = this.loadingCtrl.create({
      content: "Cargando datos..."
    })
    loading.present();
    this.user = this.auth.getLoggerUser();
    this.http.get(`users/${this.user.userid}/shops`).subscribe(res => {
      this.shops = res.json() as Shop[];
      loading.dismiss();
    },
    (error)=>{
      loading.dismiss();
    })
    /*
    this.http.get(`sales`).subscribe(res => {
      this.sales = res.json() as Sale[];
    })
    */
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
      let formObject2 = {};
      shelves.forEach(p => {
        formObject[p.productid] = new FormControl('',[Validators.required, Validators.min(0)]);
        formObject2[p.productid] = new FormControl('',[Validators.required, Validators.min(0)]);
      })
      this.productForm = this.fb.group(formObject);
      this.ventaForm = this.fb.group(formObject2);
      this.shelveList = shelves;
    })
    //this.shelveList=JSON.parse(localStorage.getItem('Shelves'));
    //this.tastingList=JSON.parse(localStorage.getItem('Tastings'));
    //this.aumentoList=JSON.parse(localStorage.getItem('Increase'));
    this.http.get(`shops/${this.selectedShop.shopid}/tastings`).subscribe(r => {
      this.tastingList = r.json() as Tastings[];
    })
    this.http.get(`shops/${this.selectedShop.shopid}/tasting-increases`).subscribe(r => {
      this.aumentoList = r.json() as Tasting_Increase[];
    })
  }

  calculate(value1,value2){
    console.log(value1,'  ',value2);
    let loading = this.loadingCtrl.create({
      content: "Calculando pronóstico..."
    })
    loading.present();
    this.stockList = Object.keys(this.productForm.value).map(productid => {
      return {
        productid:  Number(productid),
        shopid: this.selectedShop.shopid,
        cantity: this.productForm.value[productid],
        isdeleted: false,
        isactive: true
      } as Stock
    })
    console.log(this.stockList);
    let weeks = [];
    let weeksToConsider = 6;
    let bufferWeeks = 1;
    this.diaCalculado = moment(value1.year+'-'+value1.month+'-'+value1.day, 'YYYY-MM-DD'); 
    let firstWeekDate = this.diaCalculado.clone().subtract(weeksToConsider + (bufferWeeks + (!this.diaCalculado.day() ? 1 : 0)), 'week').endOf('week');
    do {
      let dateToAdd = firstWeekDate.clone();
      dateToAdd.add(weeksToConsider, 'week');
      weeks.push({
        semana: dateToAdd.week(),
        year: dateToAdd.month() == 11 /*DICIEMBRE */ && dateToAdd.week() == 1 ?  dateToAdd.year() + 1 : dateToAdd.year()
      })
    } while(--weeksToConsider)
    let filter = {
      where: {
        or: weeks.map(w => {
          return {
            and: [{semana: w.semana}, {year: w.year}]
          }
        })
      }
    };
    let salesQuery = JSON.stringify(filter);/* ${salesQuery} */
    this.http.get(`shops/${this.selectedShop.shopid}/sales?filter=`).subscribe(res => {
      this.sales = res.json() as Sale[];
      this.loading=true;
      ///LOS DE LA FECHAAAAA=======================================================
      var resultFecha:{productid:number;value:number,weekday:number}[]=[];
      var day=this.convert(new Date(value1.year+'-'+value1.month+'-'+value1.day).getDay());
      //para cada producto
      console.log("--------------------------DIA para " + day);
      this.shelveList.forEach(p=>{
        var salesFilter=this.sales.filter(t=>t.productid==p.productid&&day==t.weekday);
        console.log("VENTAS:", this.sales);
        console.log("VENTAS FILTRADAS:", salesFilter);
        console.log("--------------------------PROD: para " + p.productid);
        let values: number[] = [];
        values= salesFilter.map(s => s.monto);
        console.log('CONSIDERADOS PARA DIA para ' + day + " Y PROD " + p.productid, values);
        var cuartil1=Math.round(quartil(values,1));
        var mediana=Math.round(quartil(values,2));
        var cuartil3=Math.round(quartil(values,3));
        var lirvalue= Math.round(lir(cuartil1,mediana));
        var lsrvalue=Math.round(lsr(mediana,cuartil3));
        console.log("DATOS PARA para " + day + " Y PROD " + p.productid, cuartil1,mediana,cuartil3,lirvalue,lsrvalue)
        //para cada venta de ese producto en ese dia para cada semana
        var suma=0;
        var cont=0;
        salesFilter.forEach(val=>{
          let finalResult = final_result(val.monto,lirvalue,lsrvalue);
          suma=suma+(finalResult || 0);
          if(finalResult!=null){
            cont++
          };
        })
        console.log("SUMA OBTENIDA PARA" + p.productid + " DIA " + day, suma);
        console.log("ELEMENTOS A CONSIDERAR PARA" + p.productid + " DIA " + day, cont)
        var resul= Math.ceil(suma/cont);
        console.log("PROMEDIO PARA" + p.productid + " DIA " + day, resul);
        resultFecha.push({productid:p.productid,value:resul,weekday:day});
      })
      //============================================================================
      //PRODUCTOOO PARA
      var resultPara:{productid:number;value:number,weekday:number}[]=[];
      value2.forEach(element => {
        console.log("--------------------------DIA " + element);
        //para cada producto
        this.shelveList.forEach(p=>{
          console.log("--------------------------PROD: " + p.productid);
          var salesFilter=this.sales.filter(t=>t.productid==p.productid&&element==t.weekday);
          var values=[];
          salesFilter.forEach(t=>values.push(t.monto));
          var cuartil1=Math.round(quartil(values,1));
          var mediana=Math.round(quartil(values,2));
          var cuartil3=Math.round(quartil(values,3));
          var lirvalue= Math.round(lir(cuartil1,mediana));
          var lsrvalue=Math.round(lsr(mediana,cuartil3));
          console.log('CONSIDERADOS PARA DIA ' + element + " Y PROD " + p.productid, values);
          console.log("DATOS PARA " + element + " Y PROD " + p.productid, cuartil1,mediana,cuartil3,lirvalue,lsrvalue)
          //para cada venta de ese producto en ese dia para cada semana
          var suma=0;
          var cont=0;
          salesFilter.forEach(val=>{
            let finalResult = final_result(val.monto,lirvalue,lsrvalue);
            suma=suma+(finalResult || 0);
            if(finalResult != null){
              cont++
            }
          })
          console.log("SUMA OBTENIDA PARA" + p.productid + " DIA " + element, suma);
          console.log("ELEMENTOS A CONSIDERAR PARA" + p.productid + " DIA " + element, cont)
          var resul= Math.ceil(suma/cont);
          console.log("PROMEDIO PARA" + p.productid + " DIA " + element, resul);
          resultPara.push({productid:p.productid,value:resul,weekday:element});
        })
      });
      //=============================================================================
      console.log("RESULTADO PARA", resultPara);
      console.log("RESULT FECHA", resultFecha)

      //hacer ingremento por degustacion
      resultFecha.forEach(t=>{
        if(this.tastingList.filter(e=>e.productid==t.productid&&e.weekday==t.weekday&&e.isactive).length>0){
          t.value=Math.ceil(t.value+t.value*(this.aumentoList.filter(e=>e.productid==t.productid)[0].increment/100));
        }
      })


      resultPara.forEach(t=>{
        if(this.tastingList.filter(e=>e.productid==t.productid&&e.weekday==t.weekday&&e.isactive).length>0){
          t.value=Math.ceil(t.value+t.value*(this.aumentoList.filter(e=>e.productid==t.productid)[0].increment/100));
        }
      })
      //sumar totales
      var totalPara=this.mergeData(resultPara);
      //hacer incremento de la estanteria
      totalPara.forEach(t=>{
        var item=this.shelveList.filter(e=>e.productid==t.productid)[0];
        t.value=t.value+(item.size*(item.porcentage/100));
      }) 
      
      //restar existencia y listo!!!!:)
      var totalResult=this.mergeData(resultFecha);
      var total=this.mergeData(totalResult.concat(totalPara));
      //console.log(total)
      total.forEach(t=>{
        if(this.stockList.filter(u=>u.productid==t.productid).length>0){
          t.value=t.value-this.stockList.filter(u=>u.productid==t.productid)[0].cantity;
          if(t.value<0){
            t.value=0;
          }
        }
      })
      this.pronostico=total;
      console.log('prono',this.pronostico)
      
      this.loading=false;
      this.calculado = true;
      loading.dismiss();
    })
    Swal.fire({
      type:'success',
      title:'Buen trabajo!',
      text:'Pronostico calculado exitosamente!'
    })
  }

  recalcular(): void {
    this.pronostico = [];
    for(let c in this.ventaForm.controls){
      this.ventaForm.controls[c].setValue("");
    }
    this.calculado = false;
    this.diaCalculado = null;
  }

  getPronostico(id: number): number {
    console.log("PROD:", id);
    let pron = this.pronostico.find(p => p.productid == id);
    return pron.value || null
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

  mergeData(array){
    var new_array:{productid:number;value:number}[]=[]
    this.shelveList.forEach(p=>{
      var valor=0;
      array.forEach(element => {
        if(element.productid==p.productid){
          valor=valor+element.value;
        }
      });
      new_array.push({productid:p.productid,value:valor});
    })
    return new_array;
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

  saveSale(comentario: string){
    if(this.diaCalculado && this.pronostico.length){
      this.comentarioVenta = comentario;
      let loading = this.loadingCtrl.create({
        content: "Verificando ventas/existencia..."
      })
      loading.present();
      let diaSemanaActual = this.diaCalculado.day();
      //Generamos las ventas a guardar
      this.currentSales = this.pronostico.map(p => {
        let existencia = this.productForm.value[Object.keys(this.productForm.value).find(k => Number(k) == p.productid)];
        let venta = this.ventaForm.value[Object.keys(this.ventaForm.value).find(k => Number(k) == p.productid)];
        return {
          forecast: !isNaN(p.value) ? p.value : Number(venta), 
          monto: 0, 
          stock: Number(existencia), 
          dispatch: Number(venta), 
          semana: this.diaCalculado.month() == 11 && this.diaCalculado.week() == 1 && !this.diaCalculado.day() ? 52 : this.diaCalculado.week() - (!this.diaCalculado.day() ? 1 : 0),
          year: this.diaCalculado.month() == 11 /*DICIEMBRE */ && this.diaCalculado.week() == 1 && this.diaCalculado.day() ?  this.diaCalculado.year() + 1 : this.diaCalculado.year(), 
          productid: p.productid,
          shopid: this.selectedShop.shopid,
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
  /*       if(sameDaySale){
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
        } else { */
          loading.dismiss();
          this.checkPrevDaySale();
        
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
    /*     if(lastSale){ */
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
      /*   } else {
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
        } */
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
        type: 'sale',
        week: this.diaCalculado.month() == 11 && this.diaCalculado.week() == 1 && !this.diaCalculado.day() ? 52 : this.diaCalculado.week() - (!this.diaCalculado.day() ? 1 : 0),
        year: this.diaCalculado.month() == 11 /*DICIEMBRE */ && this.diaCalculado.week() == 1 && this.diaCalculado.day() ?  this.diaCalculado.year() + 1 : this.diaCalculado.year(),
        weekday: this.diaCalculado.day() ? this.diaCalculado.day() : 7,
        transactiondate: this.diaCalculado.format("YYYY-MM-DD"),
        ventaactualizada: false,
        comentario: this.comentarioVenta
      }
      console.log("venta a guardar", transaction);
      console.log("DETALLES A GUARDAR", this.currentSales);
      this.http.post(`transactions`,transaction).subscribe(async res => {
        let transactionCreated = res.json() as Transaction;
        console.log("CREADA TRANSACCION", transactionCreated);
        for(let i = 0; this.currentSales.length > i; i++){
          await this.http.post(`sales`, {...this.currentSales[i], transactionid: transactionCreated.transactionid}).subscribe(res => {
            console.log(`INGRESADA VENTA ${res.json().ventaid}`);
          });
        }
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: "Venta guardada",
          subTitle: "La venta ha sido ingresada",
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
