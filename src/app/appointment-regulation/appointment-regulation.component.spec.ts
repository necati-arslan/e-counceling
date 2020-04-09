import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRegulationComponent } from './appointment-regulation.component';

describe('AppointmentRegulationComponent', () => {
  let component: AppointmentRegulationComponent;
  let fixture: ComponentFixture<AppointmentRegulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentRegulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentRegulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
