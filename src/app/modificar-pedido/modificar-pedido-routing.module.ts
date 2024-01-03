import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarPedidoPage } from './modificar-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarPedidoPageRoutingModule {}
