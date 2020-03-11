import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserForAdminPanelComponent } from './user-for-admin-panel.component';

describe('UserForAdminPanelComponent', () => {
  let component: UserForAdminPanelComponent;
  let fixture: ComponentFixture<UserForAdminPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserForAdminPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserForAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
