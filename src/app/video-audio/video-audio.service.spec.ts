import { TestBed } from '@angular/core/testing';

import { VideoAudioService } from './video-audio.service';

describe('VideoAudioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoAudioService = TestBed.get(VideoAudioService);
    expect(service).toBeTruthy();
  });
});
