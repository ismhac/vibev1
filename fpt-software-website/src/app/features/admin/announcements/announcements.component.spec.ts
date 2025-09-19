import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { AnnouncementsComponent } from './announcements.component';
import { AnnouncementsService, Announcement, CreateAnnouncementRequest, UpdateAnnouncementRequest } from '../../../core/services/announcements.service';

// Mock Quill
const mockQuill = {
  root: {
    innerHTML: '<p>Test content</p>'
  }
};

// Mock Quill constructor
const MockQuill = jasmine.createSpy('Quill').and.returnValue(mockQuill);

describe('AnnouncementsComponent', () => {
  let component: AnnouncementsComponent;
  let fixture: ComponentFixture<AnnouncementsComponent>;
  let announcementsService: jasmine.SpyObj<AnnouncementsService>;

  const mockAnnouncements: Announcement[] = [
    {
      id: 1,
      title: 'FPT Software Launches New AI Platform',
      content: '<p>FPT Software has launched a new AI platform...</p>',
      summary: 'FPT Software announces the launch of its new AI platform',
      author: 'John Doe',
      category: 'News',
      priority: 'high',
      isPublished: true,
      publishedAt: new Date('2023-01-01'),
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      tags: ['AI', 'Technology'],
      imageUrl: 'https://example.com/image1.jpg',
      readTime: 5
    },
    {
      id: 2,
      title: 'Company Update: Q1 Results',
      content: '<p>Our Q1 results show strong growth...</p>',
      summary: 'Q1 financial results show strong performance',
      author: 'Jane Smith',
      category: 'Updates',
      priority: 'medium',
      isPublished: false,
      publishedAt: undefined,
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
      tags: ['Finance', 'Results'],
      imageUrl: undefined,
      readTime: 3
    }
  ];

  const mockApiResponse = {
    data: mockAnnouncements,
    total: 2,
    page: 1,
    limit: 10
  };

  beforeEach(async () => {
    const announcementsServiceSpy = jasmine.createSpyObj('AnnouncementsService', [
      'getAnnouncementsForAdmin',
      'createAnnouncement',
      'updateAnnouncement',
      'deleteAnnouncement'
    ]);

    // Mock Quill
    (window as any).Quill = MockQuill;

    await TestBed.configureTestingModule({
      imports: [AnnouncementsComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: AnnouncementsService, useValue: announcementsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementsComponent);
    component = fixture.componentInstance;
    announcementsService = TestBed.inject(AnnouncementsService) as jasmine.SpyObj<AnnouncementsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should load announcements on init', () => {
      announcementsService.getAnnouncementsForAdmin.and.returnValue(of(mockApiResponse));

      component.ngOnInit();

      expect(announcementsService.getAnnouncementsForAdmin).toHaveBeenCalledWith(1, 10);
      expect(component.announcements).toEqual(mockAnnouncements);
      expect(component.totalAnnouncements).toBe(2);
      expect(component.loading).toBeFalse();
    });

    it('should handle error when loading announcements', () => {
      announcementsService.getAnnouncementsForAdmin.and.returnValue(throwError(() => new Error('API Error')));

      component.ngOnInit();

      expect(announcementsService.getAnnouncementsForAdmin).toHaveBeenCalledWith(1, 10);
      expect(component.error).toBe('Failed to load announcements');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Search and Pagination', () => {
    beforeEach(() => {
      announcementsService.getAnnouncementsForAdmin.and.returnValue(of(mockApiResponse));
      component.ngOnInit();
    });

    it('should search announcements', () => {
      component.searchTerm = 'AI';
      component.onSearch();

      expect(component.currentPage).toBe(1);
      expect(announcementsService.getAnnouncementsForAdmin).toHaveBeenCalledWith(1, 10);
    });

    it('should change page', () => {
      component.onPageChange(2);

      expect(component.currentPage).toBe(2);
      expect(announcementsService.getAnnouncementsForAdmin).toHaveBeenCalledWith(2, 10);
    });
  });

  describe('Add Announcement', () => {
    it('should open add announcement form', () => {
      component.onAddAnnouncement();

      expect(component.editingAnnouncement).toBeNull();
      expect(component.announcementForm).toEqual({
        title: '',
        content: '',
        summary: '',
        author: '',
        category: '',
        priority: 'medium',
        isPublished: true,
        tags: [],
        imageUrl: '',
        readTime: 5
      });
      expect(component.showAnnouncementForm).toBeTrue();
      expect(component.selectedFile).toBeNull();
      expect(component.filePreview).toBeNull();
    });

    it('should create announcement successfully', () => {
      const newAnnouncement: Announcement = {
        id: 3,
        title: 'New Technology Release',
        content: '<p>We are excited to announce...</p>',
        summary: 'New technology release announcement',
        author: 'Tech Team',
        category: 'Technical',
        priority: 'high',
        isPublished: true,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['Technology', 'Release'],
        imageUrl: 'https://example.com/image3.jpg',
        readTime: 4
      };

      // Setup initial state
      component.announcements = [...mockAnnouncements];
      component.totalAnnouncements = 2;

      announcementsService.createAnnouncement.and.returnValue(of(newAnnouncement));
      component.announcementForm = {
        title: 'New Technology Release',
        content: '<p>We are excited to announce...</p>',
        summary: 'New technology release announcement',
        author: 'Tech Team',
        category: 'Technical',
        priority: 'high',
        isPublished: true,
        tags: ['Technology', 'Release'],
        imageUrl: 'https://example.com/image3.jpg',
        readTime: 4
      };

      component.createAnnouncement();

      expect(announcementsService.createAnnouncement).toHaveBeenCalledWith(component.announcementForm, undefined);
      expect(component.announcements[0]).toEqual(newAnnouncement);
      expect(component.totalAnnouncements).toBe(3);
      expect(component.showAnnouncementForm).toBeFalse();
      expect(component.loading).toBeFalse();
    });

    it('should handle error when creating announcement', () => {
      announcementsService.createAnnouncement.and.returnValue(throwError(() => new Error('API Error')));
      component.announcementForm = {
        title: 'New Technology Release',
        content: '<p>We are excited to announce...</p>',
        summary: 'New technology release announcement',
        author: 'Tech Team',
        category: 'Technical',
        priority: 'high',
        isPublished: true,
        tags: ['Technology', 'Release'],
        imageUrl: 'https://example.com/image3.jpg',
        readTime: 4
      };

      component.createAnnouncement();

      expect(announcementsService.createAnnouncement).toHaveBeenCalledWith(component.announcementForm, undefined);
      expect(component.error).toBe('Failed to create announcement');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Edit Announcement', () => {
    it('should open edit announcement form', () => {
      const announcement = mockAnnouncements[0];
      component.onEditAnnouncement(announcement);

      expect(component.editingAnnouncement).toBe(announcement);
      expect(component.announcementForm).toEqual({
        title: announcement.title,
        content: announcement.content,
        summary: announcement.summary || '',
        author: announcement.author || '',
        category: announcement.category || '',
        priority: announcement.priority,
        isPublished: announcement.isPublished,
        tags: announcement.tags || [],
        imageUrl: announcement.imageUrl || '',
        readTime: announcement.readTime || 5
      });
      expect(component.showAnnouncementForm).toBeTrue();
      expect(component.filePreview).toBe(announcement.imageUrl || null);
    });

    it('should update announcement successfully', () => {
      const updatedAnnouncement: Announcement = {
        ...mockAnnouncements[0],
        title: 'Updated AI Platform Launch',
        summary: 'Updated summary'
      };

      // Setup initial state
      component.announcements = [...mockAnnouncements];

      announcementsService.updateAnnouncement.and.returnValue(of(updatedAnnouncement));
      component.editingAnnouncement = mockAnnouncements[0];
      component.announcementForm = {
        title: 'Updated AI Platform Launch',
        content: '<p>Updated content...</p>',
        summary: 'Updated summary',
        author: 'John Doe',
        category: 'News',
        priority: 'high',
        isPublished: true,
        tags: ['AI', 'Technology'],
        imageUrl: 'https://example.com/image1.jpg',
        readTime: 5
      };

      component.updateAnnouncement();

      expect(announcementsService.updateAnnouncement).toHaveBeenCalledWith(
        mockAnnouncements[0].id,
        {
          title: 'Updated AI Platform Launch',
          content: '<p>Updated content...</p>',
          summary: 'Updated summary',
          author: 'John Doe',
          category: 'News',
          priority: 'high',
          isPublished: true,
          tags: ['AI', 'Technology'],
          imageUrl: 'https://example.com/image1.jpg',
          readTime: 5
        },
        undefined
      );
      expect(component.announcements[0]).toEqual(updatedAnnouncement);
      expect(component.showAnnouncementForm).toBeFalse();
      expect(component.loading).toBeFalse();
    });

    it('should handle error when updating announcement', () => {
      announcementsService.updateAnnouncement.and.returnValue(throwError(() => new Error('API Error')));
      component.editingAnnouncement = mockAnnouncements[0];
      component.announcementForm = {
        title: 'Updated AI Platform Launch',
        content: '<p>Updated content...</p>',
        summary: 'Updated summary',
        author: 'John Doe',
        category: 'News',
        priority: 'high',
        isPublished: true,
        tags: ['AI', 'Technology'],
        imageUrl: 'https://example.com/image1.jpg',
        readTime: 5
      };

      component.updateAnnouncement();

      expect(announcementsService.updateAnnouncement).toHaveBeenCalledWith(
        mockAnnouncements[0].id,
        {
          title: 'Updated AI Platform Launch',
          content: '<p>Updated content...</p>',
          summary: 'Updated summary',
          author: 'John Doe',
          category: 'News',
          priority: 'high',
          isPublished: true,
          tags: ['AI', 'Technology'],
          imageUrl: 'https://example.com/image1.jpg',
          readTime: 5
        },
        undefined
      );
      expect(component.error).toBe('Failed to update announcement');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Delete Announcement', () => {
    beforeEach(() => {
      announcementsService.getAnnouncementsForAdmin.and.returnValue(of(mockApiResponse));
      component.ngOnInit();
    });

    it('should delete announcement successfully', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      announcementsService.deleteAnnouncement.and.returnValue(of(void 0));
      const announcementToDelete = mockAnnouncements[0];

      component.onDeleteAnnouncement(announcementToDelete);

      expect(announcementsService.deleteAnnouncement).toHaveBeenCalledWith(announcementToDelete.id);
      expect(component.announcements).not.toContain(announcementToDelete);
      expect(component.totalAnnouncements).toBe(1);
      expect(component.loading).toBeFalse();
    });

    it('should handle error when deleting announcement', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      announcementsService.deleteAnnouncement.and.returnValue(throwError(() => new Error('API Error')));
      const announcementToDelete = mockAnnouncements[0];

      component.onDeleteAnnouncement(announcementToDelete);

      expect(announcementsService.deleteAnnouncement).toHaveBeenCalledWith(announcementToDelete.id);
      expect(component.error).toBe('Failed to delete announcement');
      expect(component.loading).toBeFalse();
    });

    it('should not delete announcement if user cancels confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const announcementToDelete = mockAnnouncements[0];

      component.onDeleteAnnouncement(announcementToDelete);

      expect(announcementsService.deleteAnnouncement).not.toHaveBeenCalled();
    });
  });

  describe('File Upload', () => {
    it('should handle file selection', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const event = {
        target: {
          files: [mockFile]
        }
      };

      component.onFileSelected(event);

      expect(component.selectedFile).toBe(mockFile);
    });

    it('should remove file', () => {
      component.selectedFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      component.filePreview = 'data:image/jpeg;base64,test';

      component.removeFile();

      expect(component.selectedFile).toBeNull();
      expect(component.filePreview).toBeNull();
    });
  });

  describe('Tag Management', () => {
    it('should add tag', () => {
      component.announcementForm.tags = [];
      const tagInput = { value: 'New Tag' } as HTMLInputElement;

      component.addTag(tagInput);

      expect(component.announcementForm.tags).toContain('New Tag');
      expect(tagInput.value).toBe('');
    });

    it('should not add duplicate tag', () => {
      component.announcementForm.tags = ['Existing Tag'];
      const tagInput = { value: 'Existing Tag' } as HTMLInputElement;

      component.addTag(tagInput);

      expect(component.announcementForm.tags).toEqual(['Existing Tag']);
    });

    it('should remove tag', () => {
      component.announcementForm.tags = ['Tag 1', 'Tag 2', 'Tag 3'];

      component.removeTag('Tag 2');

      expect(component.announcementForm.tags).toEqual(['Tag 1', 'Tag 3']);
    });
  });

  describe('Form Management', () => {
    it('should cancel form', () => {
      component.showAnnouncementForm = true;
      component.editingAnnouncement = mockAnnouncements[0];
      component.selectedFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      component.filePreview = 'data:image/jpeg;base64,test';

      component.onCancelForm();

      expect(component.showAnnouncementForm).toBeFalse();
      expect(component.editingAnnouncement).toBeNull();
      expect(component.selectedFile).toBeNull();
      expect(component.filePreview).toBeNull();
    });
  });

  describe('Helper Methods', () => {
    it('should calculate total pages correctly', () => {
      component.totalAnnouncements = 25;
      component.pageSize = 10;

      expect(component.totalPages).toBe(3);
    });

    it('should generate pages array correctly', () => {
      component.totalAnnouncements = 25;
      component.pageSize = 10;

      expect(component.pages).toEqual([1, 2, 3]);
    });

    it('should get priority display name correctly', () => {
      expect(component.getPriorityDisplayName('low')).toBe('Low');
      expect(component.getPriorityDisplayName('medium')).toBe('Medium');
      expect(component.getPriorityDisplayName('high')).toBe('High');
    });

    it('should get priority class correctly', () => {
      expect(component.getPriorityClass('low')).toBe('priority-low');
      expect(component.getPriorityClass('medium')).toBe('priority-medium');
      expect(component.getPriorityClass('high')).toBe('priority-high');
    });

    it('should get status display name correctly', () => {
      expect(component.getStatusDisplayName(true)).toBe('Published');
      expect(component.getStatusDisplayName(false)).toBe('Draft');
    });

    it('should get status class correctly', () => {
      expect(component.getStatusClass(true)).toBe('status-published');
      expect(component.getStatusClass(false)).toBe('status-draft');
    });

    it('should strip HTML correctly', () => {
      const html = '<p>This is <strong>bold</strong> text</p>';
      expect(component.stripHtml(html)).toBe('This is bold text');
    });
  });

  describe('Component State', () => {
    it('should have correct initial state', () => {
      expect(component.announcements).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(component.error).toBeNull();
      expect(component.showAnnouncementForm).toBeFalse();
      expect(component.editingAnnouncement).toBeNull();
      expect(component.searchTerm).toBe('');
      expect(component.currentPage).toBe(1);
      expect(component.pageSize).toBe(10);
      expect(component.totalAnnouncements).toBe(0);
      expect(component.announcementForm).toEqual({
        title: '',
        content: '',
        summary: '',
        author: '',
        category: '',
        priority: 'medium',
        isPublished: true,
        tags: [],
        imageUrl: '',
        readTime: 5
      });
      expect(component.selectedFile).toBeNull();
      expect(component.filePreview).toBeNull();
      expect(component.quill).toBeNull();
    });
  });
});
