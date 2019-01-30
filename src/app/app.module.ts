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
import { ExistenciasPage } from '../pages/existencias/existencias';
import { ComparativoSemanalPage } from '../pages/comparativo-semanal/comparativo-semanal';
import { ExcelService } from '../providers/excel.service';
import { TransaccionesUsuarioPage } from '../pages/transacciones-usuario/transacciones-usuario';

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
    DevicesPage,
    ExistenciasPage,
    ComparativoSemanalPage,
    TransaccionesUsuarioPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    ComponentsModule,
    PipesModule,
    IonicModule.forRoot(MyApp, {
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthShortNames: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'],
      dayNames: ['domingo', 'lunes', 'martes', 'mi\u00e9rcoles', 'jueves', 'viernes', 's\u00e1bado'],
      dayShortNames: ['dom', 'lun', 'mar', 'mi\u00e9', 'jue', 'vie', 's\u00e1b']
    }),
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
    DevicesPage,
    ExistenciasPage,
    ComparativoSemanalPage,
    TransaccionesUsuarioPage
  ],
  providers: [
    Uid,
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    HttpService,
    AuthService,
    ExcelService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
