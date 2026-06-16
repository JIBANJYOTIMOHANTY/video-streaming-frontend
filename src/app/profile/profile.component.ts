import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user = computed(() => this.authService.currentUserSignal());
  
  totalVideosCount = computed(() => {
    const u = this.user();
    if (!u) return 0;
    return this.videoService.getMyVideos(u.id).length;
  });

  constructor(
    private authService: AuthService,
    private videoService: VideoService
  ) {}
}
