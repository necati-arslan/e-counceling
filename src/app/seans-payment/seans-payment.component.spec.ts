import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeansPaymentComponent } from './seans-payment.component';

describe('SeansPaymentComponent', () => {
  let component: SeansPaymentComponent;
  let fixture: ComponentFixture<SeansPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeansPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeansPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
