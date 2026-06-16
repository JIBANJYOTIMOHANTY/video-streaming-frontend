import { Component, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoService, Video } from '../../services/video.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent {
  videoId = signal<string | null>(null);
  
  video = computed(() => {
    const id = this.videoId();
    return id ? this.videoService.getVideoById(id) : null;
  });

  recommendedVideos = computed(() => {
    const currentId = this.videoId();
    return this.videoService.getVideos().filter(v => v.id !== currentId).slice(0, 4);
  });

  constructor(private route: ActivatedRoute, private videoService: VideoService) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.videoId.set(id);
        // Increment views
        this.videoService.incrementViews(id);
      }
    });
  }
}
