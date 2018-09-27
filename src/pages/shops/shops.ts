import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Shop } from '../../models/shops';
import { shops } from '../../data/shops';
import { TastingsPage } from '../tastings/tastings';

@Component({
  selector: 'page-shops',
  templateUrl: 'shops.html'
})
export class ShopsPage {
  private loading:boolean=false;
  private shopList:Shop[]=[];

  constructor(public navCtrl: NavController) {
    this.shopList=shops;
  }

  onClickItem(event, item:Shop){
    console.log("are you kidding me")
    this.navCtrl.push(TastingsPage, {
      item: item
    });
  }

}
