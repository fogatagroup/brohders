import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProductService } from '../../providers/products.service';
import { Product } from '../../models/products';
import { products } from '../../data/products';
import { HttpService } from '../../providers/http.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage implements OnInit{
  private loading:boolean=false;
  private productsList:Product[]=[];
  private selectedProduct:Product = null;
  order: string = 'Z-A';

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
            this.http.delete("products", id).subscribe(r => {
              this.refresh();
            })
          }
        }
      ]
    });
    alert.present();
  }

  fetch(){
    this.http.get("products").subscribe(res => {
      this.productsList = res.json() as Product[];
      console.log(this.productsList);
      
    })
  }

  refresh(){
    this.fetch();
    this.selectedProduct = null
  }

  add(){
    this.selectedProduct = new Product();
  }

  select(prod: Product){
    this.selectedProduct = {...prod};
  }

  saveForm(){
    let prod = this.productsList.find(p => p.productid == this.selectedProduct.productid);
    let updatedProd = {
      name: this.selectedProduct.name,
      description: this.selectedProduct.description
    }
    if(prod){
      this.http.put("products", prod.productid, updatedProd).subscribe(res => {
        this.refresh();
      })
    } else {
      this.http.post("products", updatedProd).subscribe(res => {
        this.refresh();
      })
    }
  }

  cancelForm(){
    this.selectedProduct = null;
  }
  changeOrder(){
    if(this.order == 'Z-A'){
      this.productsList.sort( (a, b) =>{
        if (a.name > b.name){
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
    })
      this.order = 'A-Z';
    }else {
      this.productsList.sort( (a, b) =>{
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