import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonService } from '../common-service/common-service';

export interface User {
  id: string;
  username: string;
  email: string;
  totalVideos?: number;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface LoginResponseData {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'video_stream_user';

  currentUserSignal = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  private lastActivity = Date.now();
  private readonly REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor(private commonService: CommonService, private router: Router) {
    this.loadCurrentUser();
    this.setupActivityListener();
  }

  private loadCurrentUser() {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        this.currentUserSignal.set(JSON.parse(userJson));
      } catch (e) {
        localStorage.removeItem(this.USER_KEY);
      }
    }
  }

  register(username: string, email: string, password: string): Observable<ApiResponse<any>> {
    return this.commonService.post<ApiResponse<any>>('auth/register', {
      username,
      email,
      password
    }, { skipAuth: true });
  }

  login(username: string, password: string): Observable<ApiResponse<LoginResponseData>> {
    return this.commonService.post<ApiResponse<LoginResponseData>>('auth/login', {
      username,
      password
    }, { skipAuth: true }).pipe(
      tap(res => {
        if (res.status === 0 && res.data) {
          const user: User = {
            id: 'usr_' + res.data.username,
            username: res.data.username,
            email: ''
          };
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          // CommonService will automatically save the token to 'token' inside saveTokenIfPresent,
          // but we can also set jwt_token as backup to satisfy existing interceptor fallback.
          localStorage.setItem('jwt_token', res.data.token);
          this.currentUserSignal.set(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('token');
    this.currentUserSignal.set(null);
    this.router.navigate(['/']);
  }

  refreshToken(token: string): Observable<ApiResponse<LoginResponseData>> {
    return this.commonService.post<ApiResponse<LoginResponseData>>(`auth/refresh?token=${token}`, {}, { skipAuth: true });
  }

  private setupActivityListener() {
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const onUserActivity = () => {
      const now = Date.now();
      const token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
      
      if (token && this.isLoggedIn() && (now - this.lastActivity > this.REFRESH_INTERVAL)) {
        this.lastActivity = now;
        this.refreshToken(token).subscribe({
          next: (res) => {
            if (res.status === 0 && res.data) {
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('jwt_token', res.data.token);
            }
          },
          error: (err) => {
            console.error('Failed to refresh token during activity:', err);
          }
        });
      }
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, onUserActivity);
    });
  }
}
