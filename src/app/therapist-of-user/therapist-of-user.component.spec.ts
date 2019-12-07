import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistOfUserComponent } from './therapist-of-user.component';

describe('TherapistOfUserComponent', () => {
  let component: TherapistOfUserComponent;
  let fixture: ComponentFixture<TherapistOfUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TherapistOfUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapistOfUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
