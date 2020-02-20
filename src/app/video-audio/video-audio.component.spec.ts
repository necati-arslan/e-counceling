import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAudioComponent } from './video-audio.component';

describe('VideoAudioComponent', () => {
  let component: VideoAudioComponent;
  let fixture: ComponentFixture<VideoAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
