import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CommonService } from '../common-service/common-service';
import { environment } from '../environments/environment';

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

interface VideoApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface BackendVideo {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  userId: string;
  status: 'READY' | 'PROCESSING';
  views: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private http = inject(HttpClient);
  videosSignal = signal<Video[]>([]);

  constructor(private commonService: CommonService) {
    this.fetchVideos();
  }

  fetchVideos() {
    this.commonService.get<VideoApiResponse<BackendVideo[]>>('videos').subscribe({
      next: (res) => {
        if (res.status === 0 && res.data) {
          const mapped = res.data.map(v => this.mapBackendVideo(v));
          this.videosSignal.set(mapped);
        }
      },
      error: (err) => {
        console.error('Failed to fetch videos from server:', err);
      }
    });
  }

  private resolveVideoUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const gatewayBase = environment.apiUrl.replace('/api/v1', '');
    return `${gatewayBase}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  private mapBackendVideo(v: BackendVideo): Video {
    return {
      id: v.id.toString(),
      title: v.title,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
      videoUrl: this.resolveVideoUrl(v.videoUrl),
      views: v.views,
      userId: v.userId,
      status: v.status === 'READY' ? 'Ready' : 'Processing',
      createdAt: v.createdAt || new Date().toISOString()
    };
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
    this.commonService.post<VideoApiResponse<BackendVideo>>(`videos/${id}/view`, {}).subscribe({
      next: (res) => {
        if (res.status === 0 && res.data) {
          const updatedVideo = this.mapBackendVideo(res.data);
          this.videosSignal.update(videos =>
            videos.map(v => v.id === id ? updatedVideo : v)
          );
        }
      },
      error: (err) => {
        console.error('Failed to increment views on server:', err);
      }
    });
  }

  deleteVideo(id: string) {
    this.commonService.delete<VideoApiResponse<void>>(`videos/${id}`).subscribe({
      next: (res) => {
        if (res.status === 0) {
          this.videosSignal.update(videos => videos.filter(v => v.id !== id));
        }
      },
      error: (err) => {
        console.error('Failed to delete video on server:', err);
      }
    });
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
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('title', title);
    formData.append('description', description);

    const req = new HttpRequest('POST', `${environment.apiUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    const progress$ = new Subject<number>();

    this.http.request<any>(req).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          progress$.next(percentDone);
        } else if (event.type === HttpEventType.Response) {
          const body = event.body;
          const videoUrl = body.videoUrl;

          // Register video metadata in video-service
          this.commonService.post<any>('videos', {
            title,
            description,
            videoUrl,
            thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
            userId,
            status: 'Processing'
          }).subscribe({
            next: () => {
              this.fetchVideos();
              progress$.complete();
            },
            error: (err) => {
              progress$.error(err);
            }
          });
        }
      },
      error: (err) => {
        progress$.error(err);
      }
    });

    return progress$.asObservable();
  }
}
