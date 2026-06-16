import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoService } from '../services/video.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  title = '';
  description = '';
  thumbnailUrl = '';
  selectedVideoFile: File | null = null;
  videoFileName = signal<string | null>(null);

  isUploading = signal(false);
  uploadProgress = signal(0);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(
    private videoService: VideoService,
    private authService: AuthService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideoFile = file;
      this.videoFileName.set(file.name);
    }
  }

  onSubmit() {
    const user = this.authService.currentUserSignal();
    if (!user) {
      this.errorMessage.set('You must be logged in to upload videos.');
      return;
    }

    if (!this.title || !this.description || !this.selectedVideoFile) {
      this.errorMessage.set('Title, Description and Video File are required.');
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isUploading.set(true);
    this.uploadProgress.set(0);

    this.videoService.uploadVideo(
      this.title,
      this.description,
      this.thumbnailUrl,
      user.id,
      this.selectedVideoFile
    ).subscribe({
      next: (progress) => {
        this.uploadProgress.set(progress);
      },
      error: (err) => {
        this.errorMessage.set('Failed to upload video.');
        this.isUploading.set(false);
      },
      complete: () => {
        this.isUploading.set(false);
        this.successMessage.set('Video uploaded successfully! It is now being processed.');
        // Reset form
        this.title = '';
        this.description = '';
        this.thumbnailUrl = '';
        this.selectedVideoFile = null;
        this.videoFileName.set(null);

        // Redirect after a short delay
        setTimeout(() => {
          this.router.navigate(['/my-videos']);
        }, 2000);
      }
    });
  }
}
