import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'upload',
    canActivate: [authGuard],
    loadComponent: () => import('./upload/upload.component').then(m => m.UploadComponent)
  },
  {
    path: 'watch/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./video/video-player/video-player.component').then(m => m.VideoPlayerComponent)
  },
  {
    path: 'my-videos',
    canActivate: [authGuard],
    loadComponent: () => import('./video/my-videos/my-videos.component').then(m => m.MyVideosComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
