import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeSimpleTest2Component } from './stripe-simple-test2.component';

describe('StripeSimpleTest2Component', () => {
  let component: StripeSimpleTest2Component;
  let fixture: ComponentFixture<StripeSimpleTest2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeSimpleTest2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeSimpleTest2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
