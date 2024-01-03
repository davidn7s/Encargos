import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarPrecioPageRoutingModule } from './agregar-precio-routing.module';

import { AgregarPrecioPage } from './agregar-precio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarPrecioPageRoutingModule
  ],
  declarations: [AgregarPrecioPage]
})
export class AgregarPrecioPageModule {}
