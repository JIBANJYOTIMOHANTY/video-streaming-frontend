import { Component, signal, computed, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { VideoService, Video } from '../services/video.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchQuery = signal('');
  
  filteredVideos = computed(() => {
    return this.videoService.searchVideos(this.searchQuery());
  });

  constructor(private videoService: VideoService) {
    this.videoService.fetchVideos();
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
  }
}
