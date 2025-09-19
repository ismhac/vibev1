import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndustriesService, Industry } from '../core/services/industries.service';
import { AnnouncementsService, Announcement } from '../core/services/announcements.service';
import { SubscriptionsService, Subscription } from '../core/services/subscriptions.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePageComponent implements OnInit {
  private industriesService = inject(IndustriesService);
  private announcementsService = inject(AnnouncementsService);
  private subscriptionsService = inject(SubscriptionsService);
  private formBuilder = inject(FormBuilder);
  
  industries: Industry[] = [];
  announcements: Announcement[] = [];
  industriesLoading = false;
  announcementsLoading = false;
  industriesError: string | null = null;
  announcementsError: string | null = null;
  
  // Subscription form
  subscriptionForm!: FormGroup;
  subscriptionLoading = false;
  subscriptionMessage: string | null = null;
  subscriptionSuccess = false;

  ngOnInit(): void {
    this.loadIndustries();
    this.loadAnnouncements();
    this.initializeSubscriptionForm();
  }

  /**
   * Load industries data from API
   */
  loadIndustries(): void {
    this.industriesLoading = true;
    this.industriesError = null;

    this.industriesService.getIndustries(1, 4).subscribe({
      next: (response: any) => {
        this.industries = response.data.slice(0, 4); // Ensure max 4 industries
        this.industriesLoading = false;
      },
      error: (err: any) => {
        this.industriesError = 'Failed to load industries';
        this.industriesLoading = false;
        console.error('Error loading industries:', err);
      }
    });
  }

  /**
   * Load announcements data from API
   */
  loadAnnouncements(): void {
    this.announcementsLoading = true;
    this.announcementsError = null;

    this.announcementsService.getAnnouncements(1, 3).subscribe({
      next: (response: any) => {
        this.announcements = response.data.slice(0, 3); // Ensure max 3 announcements
        this.announcementsLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading announcements:', err);
        this.announcementsError = 'Failed to load announcements';
        this.announcementsLoading = false;
      }
    });
  }

  /**
   * Navigate to industry detail page
   * @param industryId - The ID of the industry to navigate to
   */
  onIndustryClick(industryId: number): void {
    // Navigation will be handled by routerLink in template
  }

  /**
   * Navigate to industries page
   */
  onViewAllClick(): void {
    // Navigation will be handled by routerLink in template
  }

  /**
   * Navigate to announcements page
   */
  onViewAllAnnouncementsClick(): void {
    // Navigation will be handled by routerLink in template
  }

  /**
   * Initialize subscription form with validation
   */
  initializeSubscriptionForm(): void {
    this.subscriptionForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Handle subscription form submission
   */
  onSubmitSubscription(): void {
    if (this.subscriptionForm.valid) {
      this.subscriptionLoading = true;
      this.subscriptionMessage = null;
      this.subscriptionSuccess = false;

      const subscriptionData = {
        fullName: this.subscriptionForm.value.fullName,
        email: this.subscriptionForm.value.email
      };

      this.subscriptionsService.createSubscription(subscriptionData).subscribe({
        next: (response: any) => {
          this.subscriptionLoading = false;
          this.subscriptionSuccess = true;
          this.subscriptionMessage = response.message || 'Thank you for subscribing!';
          this.subscriptionForm.reset();
        },
        error: (err: any) => {
          this.subscriptionLoading = false;
          this.subscriptionSuccess = false;
          this.subscriptionMessage = 'Failed to subscribe. Please try again.';
          console.error('Error creating subscription:', err);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.subscriptionForm.markAllAsTouched();
    }
  }

  /**
   * Get form control for template access
   */
  getFormControl(controlName: string) {
    return this.subscriptionForm.get(controlName);
  }

  /**
   * Check if form field has error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.getFormControl(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Get error message for form field
   */
  getFieldError(fieldName: string): string {
    const field = this.getFormControl(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${fieldName === 'fullName' ? 'Full Name' : 'Email'} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return 'Full Name must be at least 2 characters long';
      }
    }
    return '';
  }
}
