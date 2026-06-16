import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UploadComponent } from './upload.component';
import { provideRouter } from '@angular/router';
import { VideoService } from '../services/video.service';
import { AuthService } from '../auth/auth.service';
import { signal } from '@angular/core';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadComponent],
      providers: [
        provideRouter([]),
        {
          provide: VideoService,
          useValue: {
            uploadVideo: () => {}
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

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
