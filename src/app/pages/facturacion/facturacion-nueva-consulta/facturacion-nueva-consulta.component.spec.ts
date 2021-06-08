import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionNuevaConsultaComponent } from './facturacion-nueva-consulta.component';

describe('FacturacionNuevaConsultaComponent', () => {
  let component: FacturacionNuevaConsultaComponent;
  let fixture: ComponentFixture<FacturacionNuevaConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturacionNuevaConsultaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionNuevaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
