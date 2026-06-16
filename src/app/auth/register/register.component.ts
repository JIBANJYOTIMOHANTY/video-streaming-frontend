import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

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

    setTimeout(() => {
      const res = this.authService.register(this.username, this.email, this.password);
      this.isLoading.set(false);

      if (res.success) {
        this.successMessage.set('Account created successfully! Redirecting...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        this.errorMessage.set(res.message);
      }
    }, 800);
  }
}
