import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.status === 'success') {
          this.router.navigate(['/']);
        } else {
          this.errorMessage.set(res.message || 'Login failed');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg = err.message || 'Invalid username or password';
        this.errorMessage.set(errorMsg);
      }
    });
  }
}
