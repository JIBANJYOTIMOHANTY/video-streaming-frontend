import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  email: string;
  totalVideos?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'video_stream_user';
  private readonly USERS_DB_KEY = 'video_stream_users_db';

  currentUserSignal = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor(private router: Router) {
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

  private getUsersDb(): User[] {
    const db = localStorage.getItem(this.USERS_DB_KEY);
    return db ? JSON.parse(db) : [];
  }

  private saveUsersDb(db: User[]) {
    localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(db));
  }

  register(username: string, email: string, password: string): { success: boolean; message: string } {
    const db = this.getUsersDb();
    if (db.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already exists' };
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      username,
      email
    };

    db.push(newUser);
    // In a real app we'd hash the password, here we just mock
    localStorage.setItem(`pwd_${newUser.email}`, password);
    this.saveUsersDb(db);

    return { success: true, message: 'Registration successful' };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const db = this.getUsersDb();
    const user = db.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    const storedPassword = localStorage.getItem(`pwd_${user.email}`);
    if (storedPassword !== password) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Set user and simulated JWT token
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem('jwt_token', 'mock_jwt_token_for_' + user.id);
    this.currentUserSignal.set(user);

    return { success: true, message: 'Login successful' };
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('jwt_token');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }
}
