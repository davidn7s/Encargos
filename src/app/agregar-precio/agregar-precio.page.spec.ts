import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AgregarPrecioPage } from './agregar-precio.page';

describe('AgregarPrecioPage', () => {
  let component: AgregarPrecioPage;
  let fixture: ComponentFixture<AgregarPrecioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AgregarPrecioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
