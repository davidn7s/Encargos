import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarPedidoPage } from './agregar-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarPedidoPageRoutingModule {}
