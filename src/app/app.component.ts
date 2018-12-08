import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { TastingsPage } from '../pages/tastings/tastings';
import { ShopsPage } from '../pages/shops/shops';
import { ProductsPage } from '../pages/products/products';
import { shelves } from '../data/shelves';
import { tastings } from '../data/tastings';
import { incremento } from '../data/increase';
import { PronosticoPage } from '../pages/pronostico/pronostico';
import { stock } from '../data/stock';
import { LoginFlatPage } from '../pages/login-flat-page/login-flat-page';
import { AuthService } from '../providers/auth.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private auth: AuthService, private alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage, icon:'home' },
      { title: 'Pronóstico', component: PronosticoPage, icon: 'analytics'},
    /*   { title: 'Degustaciones', component: TastingsPage, icon:'pizza'},
      { title: 'Ventas', component: HomePage, icon:'cash'}, */
      { title: 'Tiendas', component: ShopsPage, icon: 'basket'},
      { title: 'Productos', component: ProductsPage, icon: 'pricetags'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.rootPage = this.auth.isAuthenticated() ? HomePage : LoginFlatPage;
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      localStorage.setItem("Shelves",JSON.stringify(shelves));
      localStorage.setItem("Tastings",JSON.stringify(tastings));
      localStorage.setItem("Increase",JSON.stringify(incremento));
      localStorage.setItem("Stock",JSON.stringify(stock));
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  onLogout() {
    const confirm = this.alertCtrl.create({
      title: 'Salir',
      message: '¿Está seguro que desea salir?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Ok',
          handler: () => {
            this.auth.logout().then(_ => {
              this.nav.setRoot(LoginFlatPage);
            })
          }
        }
      ]
    });
    confirm.present();
  }
}
