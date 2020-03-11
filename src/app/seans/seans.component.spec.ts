import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeansComponent } from './seans.component';

describe('SeansComponent', () => {
  let component: SeansComponent;
  let fixture: ComponentFixture<SeansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
