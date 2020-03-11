import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusabalDialogComponent } from './reusabal-dialog.component';

describe('ReusabalDialogComponent', () => {
  let component: ReusabalDialogComponent;
  let fixture: ComponentFixture<ReusabalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReusabalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusabalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
