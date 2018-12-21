import { NgModule } from '@angular/core';
import { ShopsComponent } from './shops/shops';
import { IonicModule } from 'ionic-angular/module';
import { CommonModule } from '@angular/common/src/common_module';
import { PipesModule } from '../pipes/pipes.module';
import { UserShopsComponent } from './user-shops/user-shops';
@NgModule({
	declarations: [ShopsComponent,
    UserShopsComponent],
	imports: [IonicModule, PipesModule],
	exports: [ShopsComponent,
    UserShopsComponent]
})
export class ComponentsModule {}
