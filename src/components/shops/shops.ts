import { Component, Input, Output } from '@angular/core';
import { Shop } from '../../models/shops';
import { HttpService } from '../../providers/http.service';
import { EventEmitter } from '@angular/core';

/**
 * Generated class for the ShopsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'shops',
  templateUrl: 'shops.html'
})
export class ShopsComponent {

  @Input() clientid: number;
  @Output() onSelectShop: EventEmitter<Shop> = new EventEmitter<Shop>();
  
  shops: Shop[];
  selectedItem: Shop;

  constructor(private http: HttpService) {}

  ngOnInit(){
    this.clientid && this.http.get(`clients/${this.clientid}/shops`).subscribe(resp => this.shops = resp.json() as Shop[]);
  }

  refresh(){
    this.clientid && this.http.get(`clients/${this.clientid}/shops`).subscribe(resp => this.shops = resp.json() as Shop[]);
    this.selectedItem = null;
  }

  add(){
    this.selectedItem = new Shop();
  }

  cancelForm(){
    this.selectedItem = null;
  }

  saveForm(){
    let shop = {
      name: this.selectedItem.name,
      description: this.selectedItem.description
    }
    this.http.post(`clients/${this.clientid}/shops`, shop).subscribe(r => {
      this.selectedItem = r.json();
      this.refresh();
    })
  }

  onClickItem(event, item:Shop){
    console.log("Selected", item);
    this.onSelectShop.emit(item);
  }

}
