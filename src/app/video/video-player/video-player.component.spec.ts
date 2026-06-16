import { TestBed, ComponentFixture } from '@angular/core/testing';
import { VideoPlayerComponent } from './video-player.component';
import { provideRouter } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { signal } from '@angular/core';

describe('VideoPlayerComponent', () => {
  let component: VideoPlayerComponent;
  let fixture: ComponentFixture<VideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayerComponent],
      providers: [
        provideRouter([]),
        {
          provide: VideoService,
          useValue: {
            getVideoById: () => undefined,
            getVideos: () => [],
            incrementViews: () => {}
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
