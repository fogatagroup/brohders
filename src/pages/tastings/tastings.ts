import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Shelve, Stock } from '../../models/shelves';
import { Tastings, Tasting_Increase } from '../../models/tastings';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Product } from '../../models/products';
import { products } from '../../data/products';
import { weekdays } from '../../config/config';
import { HttpService } from '../../providers/http.service';
import { round } from '../../utils/math.utils'

@Component({
  selector: 'page-tastings',
  templateUrl: 'tastings.html'
})
export class TastingsPage implements OnInit {
  
  private loading:boolean=false;
  private selectedItem: any;
  private selectedItemEdit: any;
  private shelveList:Shelve[]=[];
  private tastingList:Tastings[]=[];
  private aumentoList:Tasting_Increase[]=[];
  private stockList:Stock[];
  private shelvesForm: FormGroup;
  private tastingsForm: FormGroup;
  private increaseForm: FormGroup;
  private stockForm: FormGroup;
  private generalForm: FormGroup;
  private products:Product[]=[];
  private weekdays=weekdays;
  private selectedTastings:Tastings[]=[];
  private isValue:boolean=false;
  private day:number;
  public shop: string = 'general';
  public round = round;


  constructor(public navCtrl: NavController, public navParams: NavParams,private fb: FormBuilder, public loadingCtrl: LoadingController, private http: HttpService) {
    this.selectedItem = navParams.get('item');
    this.selectedItemEdit = {...this.selectedItem};
    //this.getData();
  }

  ngOnInit(): void {
    this.getData(); 
  }

  private buildForms(){
    //BUILD SHELVES DISABLED -> this.buildShelvesForm()
    //BUILD AUMENTOS DISABLED -> this.buildAumentoForm();
    var object2={};
    this.stockList.forEach(t=>{
      object2[t.stockid]=new FormControl('', [Validators.required]);
    })
    this.stockForm=this.fb.group(object2);
    this.stockList.forEach(t=>{
      var obj1={};
      obj1[t.stockid]=t.cantity;
      this.stockForm.patchValue(obj1);
    })

    this.generalForm = this.fb.group({
      name: new FormControl('', [Validators.required]).setValue(this.selectedItem.name),
      description: new FormControl('', [Validators.required]).setValue(this.selectedItem.description)
    })
  }

  getData(){
    this.http.get("products").subscribe(res => {
      this.products = res.json() as Product[];
      this.buildForms();
    })
    this.fetchTastings();
    this.fetchTastingIncreases();
    this.fetchShelves();
    
    this.stockList=JSON.parse(localStorage.getItem("Stock"));
  }

  private fetchTastingIncreases(){
    this.http.get(`shops/${this.selectedItem.shopid}/tasting-increases`).subscribe(res => {
      this.aumentoList = res.json() as Tasting_Increase[]
    })
  }

  private fetchShelves(){
    this.http.get(`shops/${this.selectedItem.shopid}/shelves`).subscribe(res => {
      this.shelveList = res.json() as Shelve[]
    })
  }

  private fetchTastings(){
    this.http.get(`shops/${this.selectedItem.shopid}/tastings`).subscribe(res => {
      this.tastingList = res.json() as Tastings[];
    })
  }

  showLoading() {
    let loading = this.loadingCtrl.create({
      content: 'Enviando...',
      dismissOnPageChange: true
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 200);
  }

  buildShelvesForm(){
    var object={};
    let productsNotShelved = this.products.filter(p => this.shelveList.map(a => a.productid).indexOf(p.productid) == -1);
    console.log("PRODUCTS NOT SHELVED", productsNotShelved);
    productsNotShelved.forEach((p,i) => {
      this.shelveList.push({
        shelveid: 0 - i,
        productid: p.productid,
        size: 0,
        porcentage: 0
      } as Shelve)
    });
    this.shelveList.forEach(t=>{
      object[t.shelveid+"size"]=new FormControl('', [Validators.required]);
      object[t.shelveid+"porcentage"]=new FormControl('', [Validators.required]);
    })
    this.shelvesForm=this.fb.group(object);
    this.shelveList.forEach(t=>{
      var obj1={};
      obj1[t.shelveid+"size"]=t.size;
      this.shelvesForm.patchValue(obj1);
      var obj1={};
      obj1[t.shelveid+"porcentage"]=t.porcentage;
      this.shelvesForm.patchValue(obj1);
    })
  }

  buildAumentoForm(){
    /**
     * INIT AUMENTO 
     */
    var object1={};
    let productsNotIncreased = this.products.filter(p => this.aumentoList.map(a => a.productid).indexOf(p.productid) == -1);
    console.log("PRODUCTS NOT INCREASED", productsNotIncreased);
    productsNotIncreased.forEach((p,i) => {
      this.aumentoList.push({
        tastingincreaseid: 0 - i,
        productid: p.productid,
        increment: 0
      } as Tasting_Increase)
    });
    this.aumentoList.forEach(t=>{
      object1[t.tastingincreaseid]=new FormControl('', [Validators.required]);
    })
    this.increaseForm=this.fb.group(object1);
    this.aumentoList.forEach(t=>{
      var obj1={};
      obj1[t.tastingincreaseid]=t.increment;
      this.increaseForm.patchValue(obj1);
    })
    //--END AUMENTO 

  }


  convertIdToName(id:number){
    return this.products.filter(t=>t.productid==id)[0].name;
  }

  onFormSubmit(value){
    this.showLoading()
    this.shelveList.forEach(t=>{
      t.size=parseInt(value[t.shelveid+"size"]);
      t.porcentage=parseInt(value[t.shelveid+"porcentage"]);
    })
    for(let i = 0; this.shelveList.length > i; i++){
      let a = this.shelveList[i];
      if(a.shelveid <= 0){
        let newShelve = {
          productid: a.productid,
          size: a.size,
          porcentage: a.porcentage
        } as Shelve
        this.http.post(`shops/${this.selectedItem.shopid}/shelves`, newShelve).subscribe(res=>{
          console.log("SAVED SHELVE", res.json().shelveid);
          this.shelveList[i] = res.json();
        });
      } else {
        console.log("PATCHING SHELVE");
        this.http.patchAll<Shelve>(`shops/${this.selectedItem.shopid}/shelves/${a.productid}`, a).subscribe(res => {
          console.log("PATCHED", res.json().count);
        });
      }
    }
    console.log(this.shelveList);
    this.fetchShelves();
    this.shop = "";
  }

  onForm(value){
    this.showLoading()
    console.log(this.tastingsForm.value);
    this.selectedTastings.forEach(t=>{
      if(value[t.tastingid]!=undefined){
        t.isactive=value[t.tastingid];
      }
    })
    for(let i = 0; this.selectedTastings.length > i; i++){
      let s = this.selectedTastings[i];
      let newTasting = {
        productid: s.productid,
        weekday: s.weekday,
        isactive: s.isactive
      }
      if(s.tastingid <= 0){
        let newTasting = {
          productid: s.productid,
          weekday: s.weekday,
          isactive: s.isactive
        }
        this.http.post(`shops/${this.selectedItem.shopid}/tastings`, newTasting).subscribe(res=>{
          console.log("SAVED", res.json().tastingid);
          this.selectedTastings[i] = res.json();
        });
      } else {
        console.log("PATCHING TASTING");
        this.http.patchAll<Tastings>(`shops/${this.selectedItem.shopid}/tastings/${s.productid}`, s).subscribe(res => {
          console.log("PATCHED", res.json().count);
        });
      }
    }
    console.log(this.selectedTastings);
    this.fetchTastings();
    this.isValue = false;
    this.day = null;
  }

  onFormIncrease(value){
    this.showLoading();
    this.aumentoList.forEach(t=>{
      if(value[t.tastingincreaseid]!=undefined){
        t.increment=value[t.tastingincreaseid];
      }
    })
    for(let i = 0; this.aumentoList.length > i; i++){
      let a = this.aumentoList[i];
      if(a.tastingincreaseid <= 0){
        let newTasting = {
          productid: a.productid,
          increment: a.increment
        } as Tasting_Increase
        this.http.post(`shops/${this.selectedItem.shopid}/tasting-increases`, newTasting).subscribe(res=>{
          console.log("SAVED INCREMENT", res.json().tastingincreaseid);
          this.aumentoList[i] = res.json();
        });
      } else {
        console.log("PATCHING INCREMENT");
        this.http.patchAll<Tasting_Increase>(`shops/${this.selectedItem.shopid}/tasting-increases/${a.productid}`, a).subscribe(res => {
          console.log("PATCHED", res.json().count);
        });
      }
    }
    console.log(this.aumentoList);
    this.fetchTastingIncreases();
    this.shop = "";
  }

  onFormStock(value){
    this.showLoading();
    this.stockList.forEach(t=>{
      if(value[t.stockid]!=undefined){
        t.cantity=value[t.stockid];
      }
    })
    localStorage.setItem("Stock",JSON.stringify(this.stockList));
    this.getData();
  }

  onChangeDay(value){
    console.log(this.tastingList);
    this.selectedTastings=this.tastingList.filter(t=>t.weekday==value);
    let tastingsNotCreated = this.products.filter(p => this.selectedTastings.map(t => t.productid).indexOf(p.productid) == -1);
    tastingsNotCreated.forEach((p,i) => {
      this.selectedTastings.push({
        tastingid: 0 - i,
        weekday: value,
        productid: p.productid,
        isactive: false
      } as Tastings)
    })
    var object={};
    this.selectedTastings.forEach(t=>{
      object[t.tastingid]=new FormControl('', [Validators.required]);
    })

    this.tastingsForm=this.fb.group(object);
    this.selectedTastings.forEach(t=>{
      var obj1={};
      obj1[t.tastingid]=t.isactive;
      this.tastingsForm.patchValue(obj1);
    })
    console.log(this.selectedTastings);
    this.isValue=true;

  }

  onSaveGeneral(){
    this.showLoading();
    this.http.put("shops",this.selectedItemEdit.shopid, {
      name: this.selectedItemEdit.name,
      description: this.selectedItemEdit.description
    }).subscribe(res => {
      this.selectedItem.name = this.selectedItemEdit.name;
      this.selectedItem.description = this.selectedItemEdit.description;
      this.navCtrl.pop();
    })
  }
}
