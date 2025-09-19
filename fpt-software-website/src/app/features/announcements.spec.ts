import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { Announcements } from './announcements';
import { AnnouncementsService } from '../core/services/announcements.service';
import { TranslationService } from '../core/translate/translation.service';

describe('Announcements', () => {
  let component: Announcements;
  let fixture: ComponentFixture<Announcements>;
  let announcementsService: jasmine.SpyObj<AnnouncementsService>;
  let translationService: jasmine.SpyObj<TranslationService>;

  const mockAnnouncements = [
    {
      id: 1,
      title: 'Test Announcement 1',
      content: 'Test content 1',
      summary: 'Test summary 1',
      author: 'Test Author 1',
      category: 'Test Category 1',
      priority: 'high' as const,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['test', 'announcement'],
      imageUrl: 'https://example.com/image1.jpg',
      readTime: 5
    },
    {
      id: 2,
      title: 'Test Announcement 2',
      content: 'Test content 2',
      summary: 'Test summary 2',
      author: 'Test Author 2',
      category: 'Test Category 2',
      priority: 'medium' as const,
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['test', 'announcement'],
      imageUrl: 'https://example.com/image2.jpg',
      readTime: 3
    }
  ];

  const mockApiResponse = {
    data: mockAnnouncements,
    total: 2,
    page: 1,
    limit: 6
  };

  beforeEach(async () => {
    const announcementsServiceSpy = jasmine.createSpyObj('AnnouncementsService', ['getAnnouncements']);
    const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [Announcements, HttpClientTestingModule],
      providers: [
        { provide: AnnouncementsService, useValue: announcementsServiceSpy },
        { provide: TranslationService, useValue: translationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Announcements);
    component = fixture.componentInstance;
    announcementsService = TestBed.inject(AnnouncementsService) as jasmine.SpyObj<AnnouncementsService>;
    translationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load announcements on init', () => {
    announcementsService.getAnnouncements.and.returnValue(of(mockApiResponse));
    translationService.translate.and.returnValue('Test Translation');

    component.ngOnInit();

    expect(announcementsService.getAnnouncements).toHaveBeenCalledWith(1, 6);
    expect(component.announcements).toEqual(mockAnnouncements);
    expect(component.total).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading announcements', () => {
    announcementsService.getAnnouncements.and.returnValue(throwError(() => new Error('API Error')));
    translationService.translate.and.returnValue('Test Translation');

    component.ngOnInit();

    expect(announcementsService.getAnnouncements).toHaveBeenCalledWith(1, 6);
    expect(component.error).toBe('Failed to load announcements. Please try again later.');
    expect(component.loading).toBeFalse();
  });

  it('should change page and reload announcements', () => {
    announcementsService.getAnnouncements.and.returnValue(of(mockApiResponse));
    translationService.translate.and.returnValue('Test Translation');

    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(announcementsService.getAnnouncements).toHaveBeenCalledWith(2, 6);
  });

  it('should retry loading announcements', () => {
    announcementsService.getAnnouncements.and.returnValue(of(mockApiResponse));
    translationService.translate.and.returnValue('Test Translation');

    component.retry();

    expect(announcementsService.getAnnouncements).toHaveBeenCalledWith(1, 6);
  });

  it('should get correct priority color', () => {
    expect(component.getPriorityColor('high')).toBe('error');
    expect(component.getPriorityColor('medium')).toBe('warning');
    expect(component.getPriorityColor('low')).toBe('default');
    expect(component.getPriorityColor('unknown')).toBe('default');
  });

  it('should format date correctly', () => {
    const testDate = new Date('2023-12-25');
    const formattedDate = component.formatDate(testDate);
    expect(formattedDate).toContain('December');
    expect(formattedDate).toContain('25');
    expect(formattedDate).toContain('2023');
  });

  it('should translate using translation service', () => {
    translationService.translate.and.returnValue('Translated Text');
    
    const result = component.translate('test.key');
    
    expect(translationService.translate).toHaveBeenCalledWith('test.key');
    expect(result).toBe('Translated Text');
  });
});
