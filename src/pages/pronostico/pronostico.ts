import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Shelve, Stock } from '../../models/shelves';
import { Tastings, Tasting_Increase } from '../../models/tastings';
import { sales } from '../../data/sales';
import { weekdays } from '../../config/config';
import { products } from '../../data/products';
import { quartil,lir,lsr, final_result } from '../../utils/utils.functions';
import { isDifferent } from '@angular/core/src/render3/util';

@Component({
  selector: 'page-pronostico',
  templateUrl: 'pronostico.html'
})
export class PronosticoPage implements OnInit{
  private shelveList:Shelve[];
  private tastingList:Tastings[];
  private aumentoList:Tasting_Increase[];
  private sales=sales;
  private products=products;
  private loading:boolean=false;
  private weekdays=weekdays;
  private stockList:Stock[];
  private pronostico:{productid:number;value:number}[]=[];
  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.getData();
  }

  ngOnInit(): void {
  }
  
  getData(){
    this.shelveList=JSON.parse(localStorage.getItem('Shelves'));
    this.tastingList=JSON.parse(localStorage.getItem('Tastings'));
    this.aumentoList=JSON.parse(localStorage.getItem('Increase'));
    this.stockList=JSON.parse(localStorage.getItem("Stock"));
  }
  calculate(value1,value2){
    this.loading=true;
    ///LOS DE LA FECHAAAAA=======================================================
    var resultFecha:{productid:number;value:number,weekday:number}[]=[];
    var day=this.convert(new Date(value1.year+'-'+value1.month+'-'+value1.day).getDay());
    //para cada producto
    this.products.forEach(p=>{
      var salesFilter=sales.filter(t=>t.productid==p.productid&&day==t.weekday);
      var values=[];
      salesFilter.forEach(t=>values.push(t.monto));
      var cuartil1=Math.round(quartil(values,1));
      var mediana=Math.round(quartil(values,2));
      var cuartil3=Math.round(quartil(values,3));
      var lirvalue= Math.round(lir(cuartil1,mediana));
      var lsrvalue=Math.round(lsr(mediana,cuartil3));
      //para cada venta de ese producto en ese dia para cada semana
      var suma=0;
      var cont=0;
      salesFilter.forEach(val=>{
        suma=suma+final_result(val.monto,lirvalue,lsrvalue);
        if(final_result(val.monto,lirvalue,lsrvalue)!=0)
          cont++;
      })
      var resul= Math.ceil(suma/cont);
      resultFecha.push({productid:p.productid,value:resul,weekday:day});
    })
    //============================================================================
    //PRODUCTOOO PARA
    var resultPara:{productid:number;value:number,weekday:number}[]=[];
    value2.forEach(element => {
      //para cada producto
      this.products.forEach(p=>{
        var salesFilter=sales.filter(t=>t.productid==p.productid&&element==t.weekday);
        var values=[];
        salesFilter.forEach(t=>values.push(t.monto));
        var cuartil1=Math.round(quartil(values,1));
        var mediana=Math.round(quartil(values,2));
        var cuartil3=Math.round(quartil(values,3));
        var lirvalue= Math.round(lir(cuartil1,mediana));
        var lsrvalue=Math.round(lsr(mediana,cuartil3));
        console.log('values',values);
        console.log(cuartil1,mediana,cuartil3,lirvalue,lsrvalue)
        //para cada venta de ese producto en ese dia para cada semana
        var suma=0;
        var cont=0;
        salesFilter.forEach(val=>{
          suma=suma+final_result(val.monto,lirvalue,lsrvalue);
          if(final_result(val.monto,lirvalue,lsrvalue)!=0)
            cont++;
        })
        var resul= Math.ceil(suma/cont);
        resultPara.push({productid:p.productid,value:resul,weekday:element});
      })
    });
    //=============================================================================
    console.log(resultPara);
    console.log(resultFecha)

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
    /* console.log(totalPara,"total")
    //restar existencia y listo!!!!:)*/
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
    this.products.forEach(p=>{
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

  
}
