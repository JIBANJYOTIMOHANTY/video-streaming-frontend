import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoService, Video } from '../../services/video.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-videos.component.html',
  styleUrl: './my-videos.component.css'
})
export class MyVideosComponent {
  myVideos = computed(() => {
    const user = this.authService.currentUserSignal();
    return user ? this.videoService.getMyVideos(user.id) : [];
  });

  constructor(
    private videoService: VideoService,
    private authService: AuthService
  ) {
    this.videoService.fetchVideos();
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this video?')) {
      this.videoService.deleteVideo(id);
    }
  }
}
