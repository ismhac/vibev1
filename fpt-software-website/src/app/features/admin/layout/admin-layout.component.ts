import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isMobile = false;
  private resizeListener?: () => void;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
    
    // Check if mobile on init and resize
    this.checkMobile();
    this.resizeListener = () => this.checkMobile();
    window.addEventListener('resize', this.resizeListener);

    // Listen to router events and scroll to top on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToTop();
      });
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  logout(): void {
    this.authService.logout();
  }

  get userName(): string {
    return this.currentUser?.fullName || 'Unknown User';
  }

  get userRole(): string {
    return this.currentUser?.role || 'Unknown';
  }

  get userEmail(): string {
    return this.currentUser?.email || 'Unknown Email';
  }

  /**
   * Scroll to top of the page
   */
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
