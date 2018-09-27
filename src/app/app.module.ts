import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProductsPage } from '../pages/products/products';
import { ShopsPage } from '../pages/shops/shops';
import { TastingsPage } from '../pages/tastings/tastings';
import { HttpService } from '../providers/http.service';
import { HttpModule } from '@angular/http';
import { PronosticoPage } from '../pages/pronostico/pronostico';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ProductsPage,
    ShopsPage,
    TastingsPage,
    PronosticoPage

  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ProductsPage,
    ShopsPage,
    TastingsPage,
    PronosticoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
