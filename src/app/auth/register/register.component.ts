import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isLoading.set(true);

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.status === 'success') {
          this.successMessage.set('Account created successfully! Redirecting...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.errorMessage.set(res.message || 'Registration failed');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg = err.message || 'Registration failed';
        this.errorMessage.set(errorMsg);
      }
    });
  }
}
