import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    // Add a tiny mock latency for realism and nice spinner
    setTimeout(() => {
      const res = this.authService.login(this.email, this.password);
      this.isLoading.set(false);

      if (res.success) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage.set(res.message);
      }
    }, 800);
  }
}
