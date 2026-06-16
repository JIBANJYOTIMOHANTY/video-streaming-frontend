import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MyVideosComponent } from './my-videos.component';
import { provideRouter } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { AuthService } from '../../auth/auth.service';
import { signal } from '@angular/core';

describe('MyVideosComponent', () => {
  let component: MyVideosComponent;
  let fixture: ComponentFixture<MyVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyVideosComponent],
      providers: [
        provideRouter([]),
        {
          provide: VideoService,
          useValue: {
            getMyVideos: () => []
          }
        },
        {
          provide: AuthService,
          useValue: {
            currentUserSignal: signal({ id: 'usr_1', username: 'TestUser', email: 'test@example.com' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
