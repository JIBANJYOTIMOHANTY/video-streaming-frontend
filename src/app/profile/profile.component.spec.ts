import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../auth/auth.service';
import { VideoService } from '../services/video.service';
import { signal } from '@angular/core';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            currentUserSignal: signal({ id: 'usr_1', username: 'TestUser', email: 'test@example.com' })
          }
        },
        {
          provide: VideoService,
          useValue: {
            getMyVideos: () => []
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
