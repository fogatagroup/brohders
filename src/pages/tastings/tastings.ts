import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Shelve, Stock } from '../../models/shelves';
import { Tastings, Tasting_Increase } from '../../models/tastings';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Product } from '../../models/products';
import { products } from '../../data/products';
import { weekdays } from '../../config/config';
import { HttpService } from '../../providers/http.service';

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


  constructor(public navCtrl: NavController, public navParams: NavParams,private fb: FormBuilder, public loadingCtrl: LoadingController, private http: HttpService) {
    this.selectedItem = navParams.get('item');
    this.selectedItemEdit = {...this.selectedItem};
    this.getData();
  }

  ngOnInit(): void {
    var object={};
    this.shelveList.filter(t=>t.shopid==this.selectedItem.shopid);
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
    var object1={};
    this.aumentoList.filter(t=>t.shopid==this.selectedItem.shopid);
    this.aumentoList.forEach(t=>{
      object1[t.tastingincreaseid]=new FormControl('', [Validators.required]);
    })
    this.increaseForm=this.fb.group(object1);
    this.aumentoList.forEach(t=>{
      var obj1={};
      obj1[t.tastingincreaseid]=t.increment;
      this.increaseForm.patchValue(obj1);
    })
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
    this.products=products;
    this.shelveList=JSON.parse(localStorage.getItem('Shelves'));
    this.tastingList=JSON.parse(localStorage.getItem('Tastings'));
    this.aumentoList=JSON.parse(localStorage.getItem('Increase'));
    this.stockList=JSON.parse(localStorage.getItem("Stock"));
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


  convertIdToName(id:number){
    return this.products.filter(t=>t.productid==id)[0].name;
  }

  onFormSubmit(value){
    this.showLoading()
    this.shelveList.forEach(t=>{
      t.size=parseInt(value[t.shelveid+"size"]);
      t.porcentage=parseInt(value[t.shelveid+"porcentage"]);
    })
    localStorage.setItem("Shelves",JSON.stringify(this.shelveList));
    this.getData();
  }

  onForm(value){
    this.showLoading()
    this.tastingList.forEach(t=>{
      if(value[t.tastingid]!=undefined){
        t.isactive=value[t.tastingid];
      }
    })
    localStorage.setItem("Tastings",JSON.stringify(this.tastingList));
    this.getData();
  }

  onFormIncrease(value){
    this.showLoading();
    this.aumentoList.forEach(t=>{
      if(value[t.tastingincreaseid]!=undefined){
        t.increment=value[t.tastingincreaseid];
      }
    })
    localStorage.setItem("Increase",JSON.stringify(this.aumentoList));
    this.getData();
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
    console.log(value,"hola soy el value")
    this.tastingList=JSON.parse(localStorage.getItem('Tastings'));
    this.selectedTastings=this.tastingList.filter(t=>t.weekday==value);
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
