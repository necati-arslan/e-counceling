import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistCardComponent } from './therapist-card.component';

describe('TherapistCardComponent', () => {
  let component: TherapistCardComponent;
  let fixture: ComponentFixture<TherapistCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TherapistCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
