import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteccionPortuariaComponent } from './proteccion-portuaria.component';

describe('ProteccionPortuariaComponent', () => {
  let component: ProteccionPortuariaComponent;
  let fixture: ComponentFixture<ProteccionPortuariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProteccionPortuariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteccionPortuariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
