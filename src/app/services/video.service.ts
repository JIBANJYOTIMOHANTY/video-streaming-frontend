import { Injectable, signal } from '@angular/core';
import { Observable, Subscriber, Subject } from 'rxjs';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  userId: string;
  status: 'Processing' | 'Ready';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private readonly VIDEOS_KEY = 'video_stream_videos_db';

  private initialVideos: Video[] = [
    {
      id: 'vid_1',
      title: 'Big Buck Bunny',
      description: 'A large and lovable rabbit deals with three bullying rodents in this classic open-source animated short film.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574717024453-354056afd6fc?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      views: 1240,
      userId: 'system',
      status: 'Ready',
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString() // 3 days ago
    },
    {
      id: 'vid_2',
      title: 'Elephants Dream',
      description: 'A surreal journey of two characters in a mechanical world, exploring the boundaries of technology and human nature.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      views: 843,
      userId: 'system',
      status: 'Ready',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
    },
    {
      id: 'vid_3',
      title: 'Sintel - CGI Animation',
      description: 'The story of a lonely young woman who befriended a baby dragon, and her epic quest to rescue him after he was captured.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      views: 2901,
      userId: 'system',
      status: 'Ready',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
    }
  ];

  videosSignal = signal<Video[]>([]);

  constructor() {
    this.loadVideos();
    // Periodically run checking of processing videos to advance their status to 'Ready'
    setInterval(() => this.processVideos(), 3000);
  }

  private loadVideos() {
    const stored = localStorage.getItem(this.VIDEOS_KEY);
    if (stored) {
      this.videosSignal.set(JSON.parse(stored));
    } else {
      this.videosSignal.set(this.initialVideos);
      this.saveVideos(this.initialVideos);
    }
  }

  private saveVideos(videos: Video[]) {
    localStorage.setItem(this.VIDEOS_KEY, JSON.stringify(videos));
    this.videosSignal.set(videos);
  }

  getVideos(): Video[] {
    return this.videosSignal().filter(v => v.status === 'Ready');
  }

  getVideoById(id: string): Video | undefined {
    return this.videosSignal().find(v => v.id === id);
  }

  getMyVideos(userId: string): Video[] {
    return this.videosSignal().filter(v => v.userId === userId);
  }

  incrementViews(id: string) {
    const videos = this.videosSignal().map(v => {
      if (v.id === id) {
        return { ...v, views: v.views + 1 };
      }
      return v;
    });
    this.saveVideos(videos);
  }

  deleteVideo(id: string) {
    const videos = this.videosSignal().filter(v => v.id !== id);
    this.saveVideos(videos);
  }

  searchVideos(query: string): Video[] {
    if (!query || query.trim() === '') {
      return this.getVideos();
    }
    const q = query.toLowerCase();
    return this.getVideos().filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q)
    );
  }

  uploadVideo(
    title: string,
    description: string,
    thumbnailUrl: string,
    userId: string,
    videoFile: File
  ): Observable<number> {
    const progress$ = new Subject<number>();
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        progress$.next(progress);
        progress$.complete();
        clearInterval(interval);

        // Upload complete, add video to database with status 'Processing'
        const newVideo: Video = {
          id: 'vid_' + Math.random().toString(36).substr(2, 9),
          title,
          description,
          thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
          // Since it's mock, we'll reuse the Big Buck Bunny or a simple sample for playback
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          views: 0,
          userId,
          status: 'Processing',
          createdAt: new Date().toISOString()
        };

        const currentVideos = [...this.videosSignal(), newVideo];
        this.saveVideos(currentVideos);
      } else {
        progress$.next(progress);
      }
    }, 250);

    return progress$;
  }

  private processVideos() {
    let changed = false;
    const now = new Date();
    const updated = this.videosSignal().map(v => {
      if (v.status === 'Processing') {
        const createdTime = new Date(v.createdAt).getTime();
        // Set processing duration to 12 seconds
        if (now.getTime() - createdTime > 12000) {
          changed = true;
          return { ...v, status: 'Ready' as const };
        }
      }
      return v;
    });

    if (changed) {
      this.saveVideos(updated);
    }
  }
}
