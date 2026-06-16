import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMobileMenuOpen = signal<boolean>(false);

  constructor(
    protected authService: AuthService,
    protected themeService: ThemeService
  ) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  logout() {
    this.authService.logout();
    this.isMobileMenuOpen.set(false);
  }
}
