import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { HomePageComponent } from './home';
import { IndustriesService, Industry } from '../core/services/industries.service';
import { AnnouncementsService, Announcement } from '../core/services/announcements.service';
import { SubscriptionsService, Subscription } from '../core/services/subscriptions.service';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let industriesService: jasmine.SpyObj<IndustriesService>;
  let announcementsService: jasmine.SpyObj<AnnouncementsService>;
  let subscriptionsService: jasmine.SpyObj<SubscriptionsService>;

  const mockIndustries: Industry[] = [
    {
      id: 1,
      name: 'Technology',
      description: 'Software development and IT solutions',
      imageUrl: 'https://example.com/tech.jpg',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Healthcare',
      description: 'Healthcare technology solutions',
      imageUrl: 'https://example.com/healthcare.jpg',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Finance',
      description: 'Financial technology solutions',
      imageUrl: 'https://example.com/finance.jpg',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'Education',
      description: 'Educational technology platforms',
      imageUrl: 'https://example.com/education.jpg',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockAnnouncements: Announcement[] = [
    {
      id: 1,
      title: 'FPT Software Launches New AI Platform',
      content: 'Full content here...',
      summary: 'Revolutionary AI platform for enterprise solutions',
      author: 'John Doe',
      category: 'Technology',
      priority: 'high',
      isPublished: true,
      publishedAt: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      tags: ['AI', 'Platform', 'Enterprise'],
      imageUrl: 'https://example.com/image1.jpg',
      readTime: 5
    },
    {
      id: 2,
      title: 'Partnership with Global Tech Leader',
      content: 'Full content here...',
      summary: 'Strategic partnership to expand market reach',
      author: 'Jane Smith',
      category: 'Business',
      priority: 'medium',
      isPublished: true,
      publishedAt: new Date('2024-01-20'),
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      tags: ['Partnership', 'Business', 'Growth'],
      imageUrl: 'https://example.com/image2.jpg',
      readTime: 3
    },
    {
      id: 3,
      title: 'New Office Opening in Singapore',
      content: 'Full content here...',
      summary: 'Expanding our presence in Southeast Asia',
      author: 'Mike Johnson',
      category: 'Company',
      priority: 'low',
      isPublished: true,
      publishedAt: new Date('2024-01-25'),
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      tags: ['Office', 'Singapore', 'Expansion'],
      readTime: 2
    }
  ];

  const mockIndustriesApiResponse = {
    data: mockIndustries,
    total: 4,
    page: 1,
    limit: 4
  };

  const mockAnnouncementsApiResponse = {
    data: mockAnnouncements,
    total: 3,
    page: 1,
    limit: 3
  };

  const mockSubscriptionResponse = {
    message: 'Thank you for subscribing!',
    timestamp: new Date()
  };

  beforeEach(async () => {
    const industriesServiceSpy = jasmine.createSpyObj('IndustriesService', ['getIndustries']);
    const announcementsServiceSpy = jasmine.createSpyObj('AnnouncementsService', ['getAnnouncements']);
    const subscriptionsServiceSpy = jasmine.createSpyObj('SubscriptionsService', ['createSubscription']);

    await TestBed.configureTestingModule({
      imports: [HomePageComponent, HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: IndustriesService, useValue: industriesServiceSpy },
        { provide: AnnouncementsService, useValue: announcementsServiceSpy },
        { provide: SubscriptionsService, useValue: subscriptionsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    industriesService = TestBed.inject(IndustriesService) as jasmine.SpyObj<IndustriesService>;
    announcementsService = TestBed.inject(AnnouncementsService) as jasmine.SpyObj<AnnouncementsService>;
    subscriptionsService = TestBed.inject(SubscriptionsService) as jasmine.SpyObj<SubscriptionsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadIndustries and loadAnnouncements on init', () => {
      spyOn(component, 'loadIndustries');
      spyOn(component, 'loadAnnouncements');
      component.ngOnInit();
      expect(component.loadIndustries).toHaveBeenCalled();
      expect(component.loadAnnouncements).toHaveBeenCalled();
    });
  });

  describe('loadIndustries', () => {
    it('should load industries successfully', () => {
      industriesService.getIndustries.and.returnValue(of(mockIndustriesApiResponse));

      component.loadIndustries();

      expect(component.industriesLoading).toBeFalse();
      expect(component.industriesError).toBeNull();
      expect(component.industries).toEqual(mockIndustries);
      expect(industriesService.getIndustries).toHaveBeenCalledWith(1, 4);
    });

    it('should handle API error', () => {
      const errorMessage = 'API Error';
      industriesService.getIndustries.and.returnValue(throwError(() => new Error(errorMessage)));

      component.loadIndustries();

      expect(component.industriesLoading).toBeFalse();
      expect(component.industriesError).toBe('Failed to load industries');
      expect(component.industries).toEqual([]);
    });

    it('should set loading state during API call', () => {
      industriesService.getIndustries.and.returnValue(of(mockIndustriesApiResponse));

      component.loadIndustries();

      expect(component.industriesLoading).toBeFalse(); // Should be false after completion
    });

    it('should slice industries to maximum 4 items', () => {
      const moreThan4Industries = [...mockIndustries, ...mockIndustries];
      const responseWithMoreData = {
        ...mockIndustriesApiResponse,
        data: moreThan4Industries
      };
      industriesService.getIndustries.and.returnValue(of(responseWithMoreData));

      component.loadIndustries();

      expect(component.industries.length).toBe(4);
      expect(component.industries).toEqual(mockIndustries);
    });
  });

  describe('onIndustryClick', () => {
    it('should be defined', () => {
      expect(component.onIndustryClick).toBeDefined();
    });

    it('should accept industry ID parameter', () => {
      const industryId = 1;
      expect(() => component.onIndustryClick(industryId)).not.toThrow();
    });
  });

  describe('loadAnnouncements', () => {
    it('should load announcements successfully', () => {
      announcementsService.getAnnouncements.and.returnValue(of(mockAnnouncementsApiResponse));

      component.loadAnnouncements();

      expect(component.announcementsLoading).toBeFalse();
      expect(component.announcementsError).toBeNull();
      expect(component.announcements).toEqual(mockAnnouncements);
      expect(announcementsService.getAnnouncements).toHaveBeenCalledWith(1, 3);
    });

    it('should handle API error', () => {
      const errorMessage = 'API Error';
      announcementsService.getAnnouncements.and.returnValue(throwError(() => new Error(errorMessage)));

      component.loadAnnouncements();

      expect(component.announcementsLoading).toBeFalse();
      expect(component.announcementsError).toBe('Failed to load announcements');
      expect(component.announcements).toEqual([]);
    });

    it('should set loading state during API call', () => {
      announcementsService.getAnnouncements.and.returnValue(of(mockAnnouncementsApiResponse));

      component.loadAnnouncements();

      expect(component.announcementsLoading).toBeFalse(); // Should be false after completion
    });

    it('should slice announcements to maximum 3 items', () => {
      const moreThan3Announcements = [...mockAnnouncements, ...mockAnnouncements];
      const responseWithMoreData = {
        ...mockAnnouncementsApiResponse,
        data: moreThan3Announcements
      };
      announcementsService.getAnnouncements.and.returnValue(of(responseWithMoreData));

      component.loadAnnouncements();

      expect(component.announcements.length).toBe(3);
      expect(component.announcements).toEqual(mockAnnouncements);
    });
  });

  describe('onViewAllClick', () => {
    it('should be defined', () => {
      expect(component.onViewAllClick).toBeDefined();
    });

    it('should execute without errors', () => {
      expect(() => component.onViewAllClick()).not.toThrow();
    });
  });

  describe('onViewAllAnnouncementsClick', () => {
    it('should be defined', () => {
      expect(component.onViewAllAnnouncementsClick).toBeDefined();
    });

    it('should execute without errors', () => {
      expect(() => component.onViewAllAnnouncementsClick()).not.toThrow();
    });
  });

  describe('Subscription Form', () => {
    beforeEach(() => {
      // Mock the services to return observables
      industriesService.getIndustries.and.returnValue(of(mockIndustriesApiResponse));
      announcementsService.getAnnouncements.and.returnValue(of(mockAnnouncementsApiResponse));
      component.ngOnInit();
    });

    it('should initialize subscription form', () => {
      expect(component.subscriptionForm).toBeDefined();
      expect(component.subscriptionForm.get('fullName')).toBeDefined();
      expect(component.subscriptionForm.get('email')).toBeDefined();
    });

    it('should have required validators on form fields', () => {
      const fullNameControl = component.subscriptionForm.get('fullName');
      const emailControl = component.subscriptionForm.get('email');

      expect(fullNameControl?.hasError('required')).toBeTruthy();
      expect(emailControl?.hasError('required')).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.subscriptionForm.get('email');
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    it('should validate full name minimum length', () => {
      const fullNameControl = component.subscriptionForm.get('fullName');
      
      fullNameControl?.setValue('A');
      expect(fullNameControl?.hasError('minlength')).toBeTruthy();

      fullNameControl?.setValue('John');
      expect(fullNameControl?.hasError('minlength')).toBeFalsy();
    });

    it('should submit form successfully', () => {
      subscriptionsService.createSubscription.and.returnValue(of(mockSubscriptionResponse));
      
      component.subscriptionForm.patchValue({
        fullName: 'John Doe',
        email: 'john@example.com'
      });

      component.onSubmitSubscription();

      expect(subscriptionsService.createSubscription).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john@example.com'
      });
      expect(component.subscriptionSuccess).toBeTruthy();
      expect(component.subscriptionMessage).toBe('Thank you for subscribing!');
    });

    it('should handle form submission error', () => {
      subscriptionsService.createSubscription.and.returnValue(throwError(() => new Error('API Error')));
      
      component.subscriptionForm.patchValue({
        fullName: 'John Doe',
        email: 'john@example.com'
      });

      component.onSubmitSubscription();

      expect(component.subscriptionSuccess).toBeFalsy();
      expect(component.subscriptionMessage).toBe('Failed to subscribe. Please try again.');
    });

    it('should not submit invalid form', () => {
      component.subscriptionForm.patchValue({
        fullName: '',
        email: 'invalid-email'
      });

      component.onSubmitSubscription();

      expect(subscriptionsService.createSubscription).not.toHaveBeenCalled();
    });

    it('should reset form after successful submission', () => {
      subscriptionsService.createSubscription.and.returnValue(of(mockSubscriptionResponse));
      
      component.subscriptionForm.patchValue({
        fullName: 'John Doe',
        email: 'john@example.com'
      });

      component.onSubmitSubscription();

      expect(component.subscriptionForm.get('fullName')?.value).toBeNull();
      expect(component.subscriptionForm.get('email')?.value).toBeNull();
    });

    it('should have field error helper methods', () => {
      component.subscriptionForm.patchValue({
        fullName: '',
        email: 'invalid-email'
      });
      component.subscriptionForm.markAllAsTouched();

      expect(component.hasFieldError('fullName')).toBeTruthy();
      expect(component.hasFieldError('email')).toBeTruthy();
      expect(component.getFieldError('fullName')).toBe('Full Name is required');
      expect(component.getFieldError('email')).toBe('Please enter a valid email address');
    });
  });

  describe('Component State', () => {
    it('should initialize with empty industries array', () => {
      expect(component.industries).toEqual([]);
    });

    it('should initialize with empty announcements array', () => {
      expect(component.announcements).toEqual([]);
    });

    it('should initialize with industries loading false', () => {
      expect(component.industriesLoading).toBeFalse();
    });

    it('should initialize with announcements loading false', () => {
      expect(component.announcementsLoading).toBeFalse();
    });

    it('should initialize with industries error null', () => {
      expect(component.industriesError).toBeNull();
    });

    it('should initialize with announcements error null', () => {
      expect(component.announcementsError).toBeNull();
    });

    it('should initialize with subscription loading false', () => {
      expect(component.subscriptionLoading).toBeFalse();
    });

    it('should initialize with subscription message null', () => {
      expect(component.subscriptionMessage).toBeNull();
    });

    it('should initialize with subscription success false', () => {
      expect(component.subscriptionSuccess).toBeFalse();
    });
  });
});
