import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTherapistComponent } from './profile-therapist.component';

describe('ProfileTherapistComponent', () => {
  let component: ProfileTherapistComponent;
  let fixture: ComponentFixture<ProfileTherapistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTherapistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTherapistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
