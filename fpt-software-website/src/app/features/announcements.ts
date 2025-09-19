import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import {
  AnnouncementsService,
  Announcement,
} from '../core/services/announcements.service';
import { TranslationService } from '../core/translate/translation.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzSpinModule,
    NzAlertModule,
    NzIconModule,
    NzEmptyModule,
    NzPaginationModule,
    NzTagModule,
  ],
  templateUrl: './announcements.html',
  styleUrl: './announcements.scss',
})
export class Announcements implements OnInit {
  private announcementsService = inject(AnnouncementsService);
  private translationService = inject(TranslationService);

  announcements: Announcement[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 1;
  pageSize = 6;
  total = 0;

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  /**
   * Load announcements from the API
   */
  private loadAnnouncements(): void {
    this.loading = true;
    this.error = null;

    this.announcementsService
      .getAnnouncements(this.currentPage, this.pageSize)
      .subscribe({
        next: response => {
          this.announcements = response.data;
          this.total = response.total;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading announcements:', error);
          this.error = 'Failed to load announcements. Please try again later.';
          this.loading = false;
        },
      });
  }

  /**
   * Handle page change for pagination
   * @param page - The new page number
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAnnouncements();
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Retry loading announcements
   */
  retry(): void {
    this.loadAnnouncements();
  }

  /**
   * Get priority color for announcement
   * @param priority - The priority level
   * @returns Color class for the priority tag
   */
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  }

  /**
   * Format date for display
   * @param date - The date to format
   * @returns Formatted date string
   */
  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Translate a key using the translation service
   * @param key - The translation key
   * @returns The translated string
   */
  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
