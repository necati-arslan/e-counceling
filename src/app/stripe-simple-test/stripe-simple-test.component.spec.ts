import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeSimpleTestComponent } from './stripe-simple-test.component';

describe('StripeSimpleTestComponent', () => {
  let component: StripeSimpleTestComponent;
  let fixture: ComponentFixture<StripeSimpleTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeSimpleTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeSimpleTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
