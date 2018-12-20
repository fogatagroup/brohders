import { NgModule } from '@angular/core';
import { ShopsComponent } from './shops/shops';
import { IonicModule } from 'ionic-angular/module';
import { CommonModule } from '@angular/common/src/common_module';
import { PipesModule } from '../pipes/pipes.module';
@NgModule({
	declarations: [ShopsComponent],
	imports: [IonicModule, PipesModule],
	exports: [ShopsComponent]
})
export class ComponentsModule {}
