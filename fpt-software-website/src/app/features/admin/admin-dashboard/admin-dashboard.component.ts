import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  get userRole(): string {
    return this.currentUser?.role || 'Unknown';
  }

  get userName(): string {
    return this.currentUser?.fullName || 'Unknown User';
  }

  get userEmail(): string {
    return this.currentUser?.email || 'Unknown Email';
  }

  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  navigateToIndustries(): void {
    this.router.navigate(['/admin/industries']);
  }

  navigateToAnnouncements(): void {
    this.router.navigate(['/admin/announcements']);
  }

  navigateToAnalytics(): void {
    // Placeholder for analytics - could navigate to a specific analytics page
    console.log('Navigate to Analytics');
  }
}
