import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { LoginFlatPage } from '../pages/login-flat-page/login-flat-page';
import { AuthService } from '../providers/auth.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ProductsPage,
    ShopsPage,
    TastingsPage,
    PronosticoPage,
    LoginFlatPage
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
    PronosticoPage,
    LoginFlatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpService,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
