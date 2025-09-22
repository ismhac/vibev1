import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementResponseDto, AnnouncementListResponseDto } from './dto/announcement-response.dto';

describe('AnnouncementsController', () => {
  let controller: AnnouncementsController;
  let service: AnnouncementsService;

  const mockAnnouncement: AnnouncementResponseDto = {
    id: 1,
    title: 'Test Announcement',
    content: 'Test content with AI technology',
    summary: 'Test summary about AI',
    author: 'John Smith',
    category: 'Company News',
    priority: 'high',
    isPublished: true,
    publishedAt: null,
    createdAt: new Date('2025-09-21T09:58:52.172Z'),
    updatedAt: new Date('2025-09-21T09:58:52.188Z'),
    tags: ['AI', 'Technology'],
    imageUrl: null,
    readTime: 5,
  };

  const mockAnnouncementList: AnnouncementListResponseDto = {
    data: [mockAnnouncement],
    total: 1,
    page: 1,
    limit: 10,
  };

  const mockFilterOptions = {
    categories: ['Company News', 'Technology', 'Sustainability'],
    priorities: ['low', 'medium', 'high'],
    statuses: ['published', 'unpublished'],
    authors: ['John Smith', 'Maria Garcia', 'Emma Thompson'],
  };

  const mockAnnouncementsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllWithFilters: jest.fn(),
    findAllForAdmin: jest.fn(),
    getFilterOptions: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementsController],
      providers: [
        {
          provide: AnnouncementsService,
          useValue: mockAnnouncementsService,
        },
      ],
    }).compile();

    controller = module.get<AnnouncementsController>(AnnouncementsController);
    service = module.get<AnnouncementsService>(AnnouncementsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return announcements with all filters', async () => {
      mockAnnouncementsService.findAllWithFilters.mockResolvedValue(mockAnnouncementList);

      const result = await controller.findAll(1, 10, 'AI', 'Company News', 'high', 'published', 'John Smith');

      expect(result).toEqual(mockAnnouncementList);
      expect(mockAnnouncementsService.findAllWithFilters).toHaveBeenCalledWith(1, 10, 'AI', 'Company News', 'high', 'published', 'John Smith');
    });

    it('should return announcements with search only', async () => {
      mockAnnouncementsService.findAllWithFilters.mockResolvedValue(mockAnnouncementList);

      const result = await controller.findAll(1, 10, 'AI');

      expect(result).toEqual(mockAnnouncementList);
      expect(mockAnnouncementsService.findAllWithFilters).toHaveBeenCalledWith(1, 10, 'AI', undefined, undefined, undefined, undefined);
    });

    it('should return announcements with category filter only', async () => {
      mockAnnouncementsService.findAllWithFilters.mockResolvedValue(mockAnnouncementList);

      const result = await controller.findAll(1, 10, undefined, 'Company News');

      expect(result).toEqual(mockAnnouncementList);
      expect(mockAnnouncementsService.findAllWithFilters).toHaveBeenCalledWith(1, 10, undefined, 'Company News', undefined, undefined, undefined);
    });

    it('should return announcements with priority filter only', async () => {
      mockAnnouncementsService.findAllWithFilters.mockResolvedValue(mockAnnouncementList);

      const result = await controller.findAll(1, 10, undefined, undefined, 'high');

      expect(result).toEqual(mockAnnouncementList);
      expect(mockAnnouncementsService.findAllWithFilters).toHaveBeenCalledWith(1, 10, undefined, undefined, 'high', undefined, undefined);
    });

    it('should return announcements with status filter only', async () => {
      mockAnnouncementsService.findAllWithFilters.mockResolvedValue(mockAnnouncementList);

      const result = await controller.findAll(1, 10, undefined, undefined, undefined, 'published');

      expect(result).toEqual(mockAnnouncementList);
      expect(mockAnnouncementsService.findAllWithFilters).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined, 'published', undefined);
    });

    it('should return announcements with author filter only', async () => {
      mockAnnouncementsService.findAllWithFilters.mockResolvedValue(mockAnnouncementList);

      const result = await controller.findAll(1, 10, undefined, undefined, undefined, undefined, 'John Smith');

      expect(result).toEqual(mockAnnouncementList);
      expect(mockAnnouncementsService.findAllWithFilters).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined, undefined, 'John Smith');
    });

    it('should return all announcements when no filters applied', async () => {
      mockAnnouncementsService.findAllWithFilters.mockResolvedValue(mockAnnouncementList);

      const result = await controller.findAll(1, 10);

      expect(result).toEqual(mockAnnouncementList);
      expect(mockAnnouncementsService.findAllWithFilters).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined, undefined, undefined);
    });

    it('should handle empty search term', async () => {
      mockAnnouncementsService.findAllWithFilters.mockResolvedValue(mockAnnouncementList);

      const result = await controller.findAll(1, 10, '');

      expect(result).toEqual(mockAnnouncementList);
      expect(mockAnnouncementsService.findAllWithFilters).toHaveBeenCalledWith(1, 10, '', undefined, undefined, undefined, undefined);
    });

    it('should handle whitespace-only search term', async () => {
      mockAnnouncementsService.findAllWithFilters.mockResolvedValue(mockAnnouncementList);

      const result = await controller.findAll(1, 10, '   ');

      expect(result).toEqual(mockAnnouncementList);
      expect(mockAnnouncementsService.findAllWithFilters).toHaveBeenCalledWith(1, 10, '   ', undefined, undefined, undefined, undefined);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockAnnouncementsService.findAllWithFilters.mockRejectedValue(error);

      await expect(controller.findAll(1, 10, 'AI')).rejects.toThrow('Service error');
    });
  });

  describe('getFilterOptions', () => {
    it('should return filter options', async () => {
      mockAnnouncementsService.getFilterOptions.mockResolvedValue(mockFilterOptions);

      const result = await controller.getFilterOptions();

      expect(result).toEqual(mockFilterOptions);
      expect(mockAnnouncementsService.getFilterOptions).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockAnnouncementsService.getFilterOptions.mockRejectedValue(error);

      await expect(controller.getFilterOptions()).rejects.toThrow('Service error');
    });
  });

  describe('findAllForAdmin', () => {
    it('should return all announcements for admin', async () => {
      mockAnnouncementsService.findAllForAdmin.mockResolvedValue(mockAnnouncementList);

      const result = await controller.findAllForAdmin(1, 10, 'AI');

      expect(result).toEqual(mockAnnouncementList);
      expect(mockAnnouncementsService.findAllForAdmin).toHaveBeenCalledWith(1, 10, 'AI');
    });
  });

  describe('findOne', () => {
    it('should return single announcement', async () => {
      mockAnnouncementsService.findOne.mockResolvedValue(mockAnnouncement);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockAnnouncement);
      expect(mockAnnouncementsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create announcement', async () => {
      const createDto: CreateAnnouncementDto = {
        title: 'New Announcement',
        content: 'New content',
        summary: 'New summary',
        author: 'Test Author',
        category: 'Test Category',
        priority: 'medium',
        isPublished: true,
        tags: ['test'],
        imageUrl: undefined,
        readTime: 5,
      };

      mockAnnouncementsService.create.mockResolvedValue(mockAnnouncement);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockAnnouncement);
      expect(mockAnnouncementsService.create).toHaveBeenCalledWith(createDto, undefined);
    });

    it('should create announcement with file', async () => {
      const createDto: CreateAnnouncementDto = {
        title: 'New Announcement',
        content: 'New content',
        summary: 'New summary',
        author: 'Test Author',
        category: 'Test Category',
        priority: 'medium',
        isPublished: true,
        tags: ['test'],
        imageUrl: undefined,
        readTime: 5,
      };
      const mockFile = {} as any;

      mockAnnouncementsService.create.mockResolvedValue(mockAnnouncement);

      const result = await controller.create(createDto, mockFile);

      expect(result).toEqual(mockAnnouncement);
      expect(mockAnnouncementsService.create).toHaveBeenCalledWith(createDto, mockFile);
    });
  });

  describe('update', () => {
    it('should update announcement', async () => {
      const updateDto: UpdateAnnouncementDto = {
        title: 'Updated Title',
        priority: 'low',
      };

      mockAnnouncementsService.update.mockResolvedValue(mockAnnouncement);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockAnnouncement);
      expect(mockAnnouncementsService.update).toHaveBeenCalledWith(1, updateDto, undefined);
    });

    it('should update announcement with file', async () => {
      const updateDto: UpdateAnnouncementDto = {
        title: 'Updated Title',
        priority: 'low',
      };
      const mockFile = {} as any;

      mockAnnouncementsService.update.mockResolvedValue(mockAnnouncement);

      const result = await controller.update(1, updateDto, mockFile);

      expect(result).toEqual(mockAnnouncement);
      expect(mockAnnouncementsService.update).toHaveBeenCalledWith(1, updateDto, mockFile);
    });
  });

  describe('remove', () => {
    it('should remove announcement', async () => {
      mockAnnouncementsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockAnnouncementsService.remove).toHaveBeenCalledWith(1);
    });
  });
});