import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarPedidoPage } from './modificar-pedido.page';

describe('ModificarPedidoPage', () => {
  let component: ModificarPedidoPage;
  let fixture: ComponentFixture<ModificarPedidoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModificarPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
