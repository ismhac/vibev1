import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('fpt-software-website');
  isAdminRoute = signal(false);

  constructor(private router: Router) {
    // Listen to route changes to determine if we're on admin routes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isAdminRoute.set(event.url.startsWith('/admin'));
      });
  }
}
