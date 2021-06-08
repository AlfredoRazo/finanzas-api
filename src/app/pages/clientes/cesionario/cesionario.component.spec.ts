import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CesionarioComponent } from './cesionario.component';

describe('CesionarioComponent', () => {
  let component: CesionarioComponent;
  let fixture: ComponentFixture<CesionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CesionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CesionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
