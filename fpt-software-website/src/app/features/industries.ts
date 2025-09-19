import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import {
  IndustriesService,
  Industry,
} from '../core/services/industries.service';
import { TranslationService } from '../core/translate/translation.service';

@Component({
  selector: 'app-industries',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzGridModule,
    NzSpinModule,
    NzAlertModule,
    NzIconModule,
    NzEmptyModule,
    NzPaginationModule,
  ],
  templateUrl: './industries.html',
  styleUrl: './industries.scss',
})
export class Industries implements OnInit {
  private industriesService = inject(IndustriesService);
  private translationService = inject(TranslationService);

  industries: Industry[] = [];
  loading = true;
  error: string | null = null;

  // Pagination properties
  currentPage = 1;
  pageSize = 9;
  total = 0;

  ngOnInit(): void {
    this.loadIndustries();
  }

  /**
   * Load industries from the API
   */
  private loadIndustries(): void {
    this.loading = true;
    this.error = null;

    this.industriesService
      .getIndustries(this.currentPage, this.pageSize)
      .subscribe({
        next: response => {
          this.industries = response.data;
          this.total = response.total;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading industries:', error);
          this.error = 'Failed to load industries. Please try again later.';
          this.loading = false;
        },
      });
  }

  /**
   * Navigate to industry detail page
   * Navigation will be handled by routerLink in template
   */
  navigateToDetail(): void {
    // Navigation will be handled by routerLink in template
  }

  /**
   * Retry loading industries
   */
  retry(): void {
    this.loadIndustries();
  }

  /**
   * Handle page change event
   * @param page - The new page number
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadIndustries();
  }

  /**
   * Template for pagination total display
   */
  totalTemplate = (total: number, range: [number, number]) => {
    return `${range[0]}-${range[1]} of ${total} items`;
  };

  /**
   * Translate a key using the translation service
   * @param key - The translation key
   * @returns The translated string
   */
  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
