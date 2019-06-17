import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { quartil } from '../../utils/utils.functions';
import { AuthService } from '../../providers/auth.service';
import { Chart } from 'chart.js';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  matriz=[[16,	37,	44,	13,	31,	8],
  [26,	58,	70,	33,	25,	11],
  [31,	53,	55,	17,	47,	13],
  [25,	47,	47,	15,	32,	10],
  [14,	59,	63,	37,	28,	17],
  [9,	37,	49,	43,	23,	6]]
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  
  values=[21,34,30,29,33,27]
  
  
  constructor(public navCtrl: NavController, private authService: AuthService) {
    this.convert2object(this.matriz)
  
  }
  ionViewDidLoad(){
    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }

  });
  }
  convert2object(matriz:number[][]){
    var list=[]
    matriz.forEach((array,index)=>array.forEach((item,i)=>{
      var obj={};
      obj['ventaid']=i;
      obj['semana']=index+1;
      obj['productid']=i+1;
      obj['weekday']=7;
      obj['monto']=item;
      list.push(obj);
    }))
    console.log(list)
  }

  get userName(): String {
    let user = this.authService.loggedUser;
    return user.user ? `${user.user.name} ${user.user.lastname || ""}` : ""
  }
}
