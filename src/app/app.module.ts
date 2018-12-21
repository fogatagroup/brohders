import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';

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
import { ClientsPage } from '../pages/clients/clients';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';
import { UsersPage } from '../pages/users/users';
import { DevicesPage } from '../pages/devices/devices';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ProductsPage,
    ClientsPage,
    ShopsPage,
    TastingsPage,
    PronosticoPage,
    LoginFlatPage,
    UsersPage,
    DevicesPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    ComponentsModule,
    PipesModule,
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
    ClientsPage,
    LoginFlatPage,
    UsersPage,
    DevicesPage
  ],
  providers: [
    Uid,
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    HttpService,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
