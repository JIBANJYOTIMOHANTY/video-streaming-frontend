import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themeSignal = signal<'light' | 'dark'>('dark');

  constructor() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      this.themeSignal.set(saved);
    } else {
      // Default to dark mode
      this.themeSignal.set('dark');
    }

    effect(() => {
      const theme = this.themeSignal();
      localStorage.setItem('theme', theme);
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    });
  }

  toggleTheme() {
    this.themeSignal.update(t => t === 'dark' ? 'light' : 'dark');
  }
}
