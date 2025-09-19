import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { TranslationService } from '../../../core/translate/translation.service';

@Component({
  selector: 'app-footer',
  imports: [NzLayoutModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  currentCounter = 0;
  private counterInterval?: number;
  private translationService = inject(TranslationService);

  /**
   * Translate a key using the translation service
   * @param key - The translation key
   * @returns The translated string
   */
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnInit(): void {
    // Initialize counter with a static number as per requirements
    this.currentCounter = 1234;

    // Start a simple counter simulation (placeholder for real-time functionality)
    this.startCounterSimulation();
  }

  ngOnDestroy(): void {
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
  }

  /**
   * Simulates a real-time counter by incrementing the value periodically
   * This is a placeholder for future real-time statistics integration
   */
  private startCounterSimulation(): void {
    this.counterInterval = setInterval(() => {
      this.currentCounter += Math.floor(Math.random() * 3) + 1; // Random increment 1-3
    }, 5000); // Update every 5 seconds
  }
}
