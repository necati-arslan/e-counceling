import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionToTherapistComponent } from './question-to-therapist.component';

describe('QuestionToTherapistComponent', () => {
  let component: QuestionToTherapistComponent;
  let fixture: ComponentFixture<QuestionToTherapistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionToTherapistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionToTherapistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
