import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule]
})
export class AdminLayoutComponent implements OnInit {
  currentUser: User | null = null;
  sidebarCollapsed = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
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
}
