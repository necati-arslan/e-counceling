import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeansForTherapistComponent } from './seans-for-therapist.component';

describe('SeansForTherapistComponent', () => {
  let component: SeansForTherapistComponent;
  let fixture: ComponentFixture<SeansForTherapistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeansForTherapistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeansForTherapistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
