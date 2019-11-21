import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistComponent } from './therapist.component';

describe('TherapistComponent', () => {
  let component: TherapistComponent;
  let fixture: ComponentFixture<TherapistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TherapistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
