import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProductService } from '../../providers/products.service';
import { Product } from '../../models/products';
import { products } from '../../data/products';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
  providers: [ProductService]
})
export class ProductsPage implements OnInit{
  private loading:boolean=false;
  private productsList:Product[]=[];

  constructor(public navCtrl: NavController,  private api: ProductService) {

  }

  ngOnInit(): void {
    this.productsList=products;
    console.log(this.productsList)
  }
}