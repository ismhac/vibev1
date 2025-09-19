import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { TranslationService } from '../../../core/translate/translation.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private router = inject(Router);
  private translationService = inject(TranslationService);
  private authService = inject(AuthService);

  currentLanguage = 'en';
  showLanguageMenu = false;
  showAdminMenu = false;
  isAuthenticated = false;
  currentUser: any = null;

  constructor() {
    // Subscribe to authentication state
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * Check if the given route is currently active
   * @param route - The route path to check
   * @returns true if the route is active, false otherwise
   */
  isRouteActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  /**
   * Toggle the language menu visibility
   */
  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
    this.showAdminMenu = false; // Close admin menu when opening language menu
  }

  /**
   * Toggle the admin menu visibility
   */
  toggleAdminMenu(): void {
    this.showAdminMenu = !this.showAdminMenu;
    this.showLanguageMenu = false; // Close language menu when opening admin menu
  }

  /**
   * Switch the application language
   * @param language - The language code to switch to
   */
  switchLanguage(language: string): void {
    this.currentLanguage = language;
    this.translationService.setLanguage(language);
    this.showLanguageMenu = false;
  }

  /**
   * Translate a key using the translation service
   * @param key - The translation key
   * @returns The translated string
   */
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Check if user has admin or editor role
   * @returns true if user has admin/editor role
   */
  isAdminOrEditor(): boolean {
    return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'editor');
  }

  /**
   * Navigate to admin dashboard
   */
  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    console.log('Navigating to login page...');
    this.router.navigate(['/login']).then(success => {
      console.log('Navigation result:', success);
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
