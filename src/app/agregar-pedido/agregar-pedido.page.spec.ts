import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarPedidoPage } from './agregar-pedido.page';

describe('AgregarPedidoPage', () => {
  let component: AgregarPedidoPage;
  let fixture: ComponentFixture<AgregarPedidoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgregarPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
