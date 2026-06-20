import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { GlobalLoader } from './global-loader/global-loader';
import { CommonService } from './common-service/common-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, GlobalLoader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private commonService = inject(CommonService);
  protected readonly title = signal('frontend');
  protected readonly isLoading = this.commonService.isLoadingSignal;
}
