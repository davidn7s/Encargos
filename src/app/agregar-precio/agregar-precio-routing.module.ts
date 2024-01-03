import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarPrecioPage } from './agregar-precio.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarPrecioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarPrecioPageRoutingModule {}
