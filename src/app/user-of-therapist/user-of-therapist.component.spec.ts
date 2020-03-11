import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOfTherapistComponent } from './user-of-therapist.component';

describe('UserOfTherapistComponent', () => {
  let component: UserOfTherapistComponent;
  let fixture: ComponentFixture<UserOfTherapistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOfTherapistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOfTherapistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
