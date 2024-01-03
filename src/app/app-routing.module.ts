import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'modificar-pedido',
    loadChildren: () => import('./modificar-pedido/modificar-pedido.module').then( m => m.ModificarPedidoPageModule)
  },
  {
    path: 'agregar-pedido',
    loadChildren: () => import('./agregar-pedido/agregar-pedido.module').then( m => m.AgregarPedidoPageModule)
  },
  {
    path: 'agregar-precio',
    loadChildren: () => import('./agregar-precio/agregar-precio.module').then( m => m.AgregarPrecioPageModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('./tab3/tab3.module').then( m => m.Tab3PageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
