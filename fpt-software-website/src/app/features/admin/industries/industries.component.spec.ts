import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { IndustriesComponent } from './industries.component';
import { IndustriesService, Industry, CreateIndustryRequest, UpdateIndustryRequest } from '../../../core/services/industries.service';

describe('IndustriesComponent', () => {
  let component: IndustriesComponent;
  let fixture: ComponentFixture<IndustriesComponent>;
  let industriesService: jasmine.SpyObj<IndustriesService>;

  const mockIndustries: Industry[] = [
    {
      id: 1,
      name: 'Technology',
      description: 'Technology and software development',
      imageUrl: 'https://example.com/tech.jpg',
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 2,
      name: 'Healthcare',
      description: 'Healthcare and medical services',
      imageUrl: undefined,
      isActive: false,
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02')
    }
  ];

  const mockApiResponse = {
    data: mockIndustries,
    total: 2,
    page: 1,
    limit: 10
  };

  beforeEach(async () => {
    const industriesServiceSpy = jasmine.createSpyObj('IndustriesService', [
      'getIndustries',
      'createIndustry',
      'updateIndustry',
      'deleteIndustry'
    ]);

    await TestBed.configureTestingModule({
      imports: [IndustriesComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: IndustriesService, useValue: industriesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IndustriesComponent);
    component = fixture.componentInstance;
    industriesService = TestBed.inject(IndustriesService) as jasmine.SpyObj<IndustriesService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should load industries on init', () => {
      industriesService.getIndustries.and.returnValue(of(mockApiResponse));

      component.ngOnInit();

      expect(industriesService.getIndustries).toHaveBeenCalledWith(1, 10);
      expect(component.industries).toEqual(mockIndustries);
      expect(component.totalIndustries).toBe(2);
      expect(component.loading).toBeFalse();
    });

    it('should handle error when loading industries', () => {
      industriesService.getIndustries.and.returnValue(throwError(() => new Error('API Error')));

      component.ngOnInit();

      expect(industriesService.getIndustries).toHaveBeenCalledWith(1, 10);
      expect(component.error).toBe('Failed to load industries');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Search and Pagination', () => {
    beforeEach(() => {
      industriesService.getIndustries.and.returnValue(of(mockApiResponse));
      component.ngOnInit();
    });

    it('should search industries', () => {
      component.searchTerm = 'tech';
      component.onSearch();

      expect(component.currentPage).toBe(1);
      expect(industriesService.getIndustries).toHaveBeenCalledWith(1, 10);
    });

    it('should change page', () => {
      component.onPageChange(2);

      expect(component.currentPage).toBe(2);
      expect(industriesService.getIndustries).toHaveBeenCalledWith(2, 10);
    });
  });

  describe('Add Industry', () => {
    it('should open add industry form', () => {
      component.onAddIndustry();

      expect(component.editingIndustry).toBeNull();
      expect(component.industryForm).toEqual({
        name: '',
        description: '',
        imageUrl: '',
        isActive: true
      });
      expect(component.showIndustryForm).toBeTrue();
    });

    it('should create industry successfully', () => {
      const newIndustry: Industry = {
        id: 3,
        name: 'Finance',
        description: 'Financial services',
        imageUrl: 'https://example.com/finance.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Setup initial state
      component.industries = [...mockIndustries];
      component.totalIndustries = 2;

      industriesService.createIndustry.and.returnValue(of(newIndustry));
      component.industryForm = {
        name: 'Finance',
        description: 'Financial services',
        imageUrl: 'https://example.com/finance.jpg',
        isActive: true
      };

      component.createIndustry();

      expect(industriesService.createIndustry).toHaveBeenCalledWith(component.industryForm);
      expect(component.industries[0]).toEqual(newIndustry);
      expect(component.totalIndustries).toBe(3);
      expect(component.showIndustryForm).toBeFalse();
      expect(component.loading).toBeFalse();
    });

    it('should handle error when creating industry', () => {
      industriesService.createIndustry.and.returnValue(throwError(() => new Error('API Error')));
      component.industryForm = {
        name: 'Finance',
        description: 'Financial services',
        imageUrl: 'https://example.com/finance.jpg',
        isActive: true
      };

      component.createIndustry();

      expect(industriesService.createIndustry).toHaveBeenCalledWith(component.industryForm);
      expect(component.error).toBe('Failed to create industry');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Edit Industry', () => {
    it('should open edit industry form', () => {
      const industry = mockIndustries[0];
      component.onEditIndustry(industry);

      expect(component.editingIndustry).toBe(industry);
      expect(component.industryForm).toEqual({
        name: industry.name,
        description: industry.description || '',
        imageUrl: industry.imageUrl || '',
        isActive: industry.isActive
      });
      expect(component.showIndustryForm).toBeTrue();
    });

    it('should update industry successfully', () => {
      const updatedIndustry: Industry = {
        ...mockIndustries[0],
        name: 'Updated Technology',
        description: 'Updated description'
      };

      // Setup initial state
      component.industries = [...mockIndustries];

      industriesService.updateIndustry.and.returnValue(of(updatedIndustry));
      component.editingIndustry = mockIndustries[0];
      component.industryForm = {
        name: 'Updated Technology',
        description: 'Updated description',
        imageUrl: '',
        isActive: true
      };

      component.updateIndustry();

      expect(industriesService.updateIndustry).toHaveBeenCalledWith(
        mockIndustries[0].id,
        {
          name: 'Updated Technology',
          description: 'Updated description',
          imageUrl: '',
          isActive: true
        }
      );
      expect(component.industries[0]).toEqual(updatedIndustry);
      expect(component.showIndustryForm).toBeFalse();
      expect(component.loading).toBeFalse();
    });

    it('should handle error when updating industry', () => {
      industriesService.updateIndustry.and.returnValue(throwError(() => new Error('API Error')));
      component.editingIndustry = mockIndustries[0];
      component.industryForm = {
        name: 'Updated Technology',
        description: 'Updated description',
        imageUrl: '',
        isActive: true
      };

      component.updateIndustry();

      expect(industriesService.updateIndustry).toHaveBeenCalledWith(
        mockIndustries[0].id,
        {
          name: 'Updated Technology',
          description: 'Updated description',
          imageUrl: '',
          isActive: true
        }
      );
      expect(component.error).toBe('Failed to update industry');
      expect(component.loading).toBeFalse();
    });
  });

  describe('Delete Industry', () => {
    beforeEach(() => {
      industriesService.getIndustries.and.returnValue(of(mockApiResponse));
      component.ngOnInit();
    });

    it('should delete industry successfully', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      industriesService.deleteIndustry.and.returnValue(of(void 0));
      const industryToDelete = mockIndustries[0];

      component.onDeleteIndustry(industryToDelete);

      expect(industriesService.deleteIndustry).toHaveBeenCalledWith(industryToDelete.id);
      expect(component.industries).not.toContain(industryToDelete);
      expect(component.totalIndustries).toBe(1);
      expect(component.loading).toBeFalse();
    });

    it('should handle error when deleting industry', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      industriesService.deleteIndustry.and.returnValue(throwError(() => new Error('API Error')));
      const industryToDelete = mockIndustries[0];

      component.onDeleteIndustry(industryToDelete);

      expect(industriesService.deleteIndustry).toHaveBeenCalledWith(industryToDelete.id);
      expect(component.error).toBe('Failed to delete industry');
      expect(component.loading).toBeFalse();
    });

    it('should not delete industry if user cancels confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const industryToDelete = mockIndustries[0];

      component.onDeleteIndustry(industryToDelete);

      expect(industriesService.deleteIndustry).not.toHaveBeenCalled();
    });
  });

  describe('Form Management', () => {
    it('should cancel form', () => {
      component.showIndustryForm = true;
      component.editingIndustry = mockIndustries[0];

      component.onCancelForm();

      expect(component.showIndustryForm).toBeFalse();
      expect(component.editingIndustry).toBeNull();
    });
  });

  describe('Helper Methods', () => {
    it('should calculate total pages correctly', () => {
      component.totalIndustries = 25;
      component.pageSize = 10;

      expect(component.totalPages).toBe(3);
    });

    it('should generate pages array correctly', () => {
      component.totalIndustries = 25;
      component.pageSize = 10;

      expect(component.pages).toEqual([1, 2, 3]);
    });

    it('should get status display name correctly', () => {
      expect(component.getStatusDisplayName(true)).toBe('Active');
      expect(component.getStatusDisplayName(false)).toBe('Inactive');
    });

    it('should get status class correctly', () => {
      expect(component.getStatusClass(true)).toBe('status-active');
      expect(component.getStatusClass(false)).toBe('status-inactive');
    });
  });

  describe('Component State', () => {
    it('should have correct initial state', () => {
      expect(component.industries).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(component.error).toBeNull();
      expect(component.showIndustryForm).toBeFalse();
      expect(component.editingIndustry).toBeNull();
      expect(component.searchTerm).toBe('');
      expect(component.currentPage).toBe(1);
      expect(component.pageSize).toBe(10);
      expect(component.totalIndustries).toBe(0);
      expect(component.industryForm).toEqual({
        name: '',
        description: '',
        imageUrl: '',
        isActive: true
      });
    });
  });
});
