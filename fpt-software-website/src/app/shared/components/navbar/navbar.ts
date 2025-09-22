import { Component, inject, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { TranslationService } from '../../../core/translate/translation.service';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

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
export class Navbar implements OnInit, OnDestroy {
  private router = inject(Router);
  private translationService = inject(TranslationService);
  private authService = inject(AuthService);
  private elementRef = inject(ElementRef);

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

  ngOnInit(): void {
    // Listen to router events and scroll to top on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToTop();
      });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Listen for clicks outside the component to close dropdowns
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showAdminMenu = false;
      this.showLanguageMenu = false;
    }
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
   * Check if current route is admin route
   */
  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  /**
   * Toggle the language menu visibility
   */
  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
    this.showAdminMenu = false; // Close admin menu when opening language menu
    if (this.showLanguageMenu) {
      this.positionLanguageDropdown();
    }
  }

  /**
   * Position language dropdown correctly
   */
  private positionLanguageDropdown(): void {
    setTimeout(() => {
      const languageButton = document.querySelector('.language-button') as HTMLElement;
      const languageDropdown = document.querySelector('.language-menu') as HTMLElement;
      
      if (languageButton && languageDropdown) {
        const rect = languageButton.getBoundingClientRect();
        languageDropdown.style.position = 'fixed';
        languageDropdown.style.top = `${rect.bottom + 8}px`;
        languageDropdown.style.left = `${rect.left}px`;
        languageDropdown.style.width = `${rect.width}px`;
      }
    }, 0);
  }

  /**
   * Toggle the admin menu visibility
   */
  toggleAdminMenu(): void {
    this.showAdminMenu = !this.showAdminMenu;
    this.showLanguageMenu = false; // Close language menu when opening admin menu
    if (this.showAdminMenu) {
      this.positionAdminDropdown();
    }
  }

  /**
   * Position admin dropdown correctly
   */
  private positionAdminDropdown(): void {
    setTimeout(() => {
      const adminButton = document.querySelector('.admin-button') as HTMLElement;
      const adminDropdown = document.querySelector('.admin-menu-items') as HTMLElement;
      
      if (adminButton && adminDropdown) {
        const rect = adminButton.getBoundingClientRect();
        adminDropdown.style.position = 'fixed';
        adminDropdown.style.top = `${rect.bottom + 8}px`;
        adminDropdown.style.left = `${rect.left}px`;
        adminDropdown.style.width = `${rect.width}px`;
      }
    }, 0);
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
    this.showAdminMenu = false;
    this.router.navigate(['/admin']).then(() => {
      this.scrollToTop();
    });
  }

  /**
   * Navigate to specific admin section
   */
  goToAdminSection(section: string): void {
    this.showAdminMenu = false;
    this.router.navigate(['/admin', section]).then(() => {
      this.scrollToTop();
    });
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    console.log('Navigating to login page...');
    this.router.navigate(['/login']).then(success => {
      console.log('Navigation result:', success);
      this.scrollToTop();
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']).then(() => {
      this.scrollToTop();
    });
  }

  /**
   * Scroll to top of the page
   */
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
