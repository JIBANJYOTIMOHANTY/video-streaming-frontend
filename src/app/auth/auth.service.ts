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

  constructor(private commonService: CommonService, private router: Router) {
    this.loadCurrentUser();
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
}
