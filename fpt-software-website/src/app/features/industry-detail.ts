import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  IndustriesService,
  Industry,
} from '../core/services/industries.service';
import { TranslationService } from '../core/translate/translation.service';

@Component({
  selector: 'app-industry-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzSpinModule,
    NzAlertModule,
    NzIconModule,
  ],
  templateUrl: './industry-detail.html',
  styleUrl: './industry-detail.scss',
})
export class IndustryDetail implements OnInit {
  private industriesService = inject(IndustriesService);
  private translationService = inject(TranslationService);
  private route = inject(ActivatedRoute);

  industry: Industry | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadIndustry(id);
      }
    });
  }

  /**
   * Load industry details from the API
   */
  private loadIndustry(id: number): void {
    this.loading = true;
    this.error = null;

    this.industriesService.getIndustryById(id).subscribe({
      next: industry => {
        this.industry = industry;
        this.loading = false;
      },
      error: error => {
        console.error('Error loading industry:', error);
        this.error = 'Failed to load industry details. Please try again later.';
        this.loading = false;
      },
    });
  }

  /**
   * Go back to industries list
   */
  goBack(): void {
    window.history.back();
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
