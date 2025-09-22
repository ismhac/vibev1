import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';
import { FileUploadService } from './services/file-upload.service';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let repository: Repository<Announcement>;

  const mockAnnouncement: Announcement = {
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

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getRawMany: jest.fn(),
    })),
  };

  const mockFileUploadService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        {
          provide: getRepositoryToken(Announcement),
          useValue: mockRepository,
        },
        {
          provide: FileUploadService,
          useValue: mockFileUploadService,
        },
      ],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
    repository = module.get<Repository<Announcement>>(getRepositoryToken(Announcement));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllWithFilters', () => {
    it('should return all announcements when no filters applied', async () => {
      const mockAnnouncements = [mockAnnouncement];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockAnnouncements, 1]),
        getRawMany: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAllWithFilters(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should filter by search term across multiple fields', async () => {
      const mockAnnouncements = [mockAnnouncement];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockAnnouncements, 1]),
        getRawMany: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.findAllWithFilters(1, 10, 'AI');

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(announcement.title LIKE :search OR announcement.content LIKE :search OR announcement.summary LIKE :search OR announcement.author LIKE :search)',
        { search: '%AI%' }
      );
    });

    it('should filter by category', async () => {
      const mockAnnouncements = [mockAnnouncement];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockAnnouncements, 1]),
        getRawMany: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.findAllWithFilters(1, 10, undefined, 'Company News');

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.category LIKE :category',
        { category: '%Company News%' }
      );
    });

    it('should filter by priority', async () => {
      const mockAnnouncements = [mockAnnouncement];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockAnnouncements, 1]),
        getRawMany: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.findAllWithFilters(1, 10, undefined, undefined, 'high');

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.priority = :priority',
        { priority: 'high' }
      );
    });

    it('should filter by status (published)', async () => {
      const mockAnnouncements = [mockAnnouncement];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockAnnouncements, 1]),
        getRawMany: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.findAllWithFilters(1, 10, undefined, undefined, undefined, 'published');

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.isPublished = :isPublished',
        { isPublished: true }
      );
    });

    it('should filter by author', async () => {
      const mockAnnouncements = [mockAnnouncement];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockAnnouncements, 1]),
        getRawMany: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.findAllWithFilters(1, 10, undefined, undefined, undefined, undefined, 'John Smith');

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.author LIKE :author',
        { author: '%John Smith%' }
      );
    });

    it('should apply multiple filters simultaneously', async () => {
      const mockAnnouncements = [mockAnnouncement];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockAnnouncements, 1]),
        getRawMany: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.findAllWithFilters(1, 10, 'AI', 'Company News', 'high', 'published', 'John Smith');

      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(5); // search, category, priority, status, author
    });

    it('should handle empty search term', async () => {
      const mockAnnouncements = [mockAnnouncement];
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockAnnouncements, 1]),
        getRawMany: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.findAllWithFilters(1, 10, '');

      expect(queryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('title LIKE'),
        expect.any(Object)
      );
    });
  });

  describe('getFilterOptions', () => {
    it('should return filter options with categories and authors from database', async () => {
      const mockCategoryResults = [
        { category: 'Company News' },
        { category: 'Technology' },
        { category: 'Sustainability' },
      ];
      const mockAuthorResults = [
        { author: 'John Smith' },
        { author: 'Maria Garcia' },
        { author: 'Emma Thompson' },
      ];

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
        getRawMany: jest.fn()
          .mockResolvedValueOnce(mockCategoryResults)
          .mockResolvedValueOnce(mockAuthorResults),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getFilterOptions();

      expect(result).toEqual({
        categories: ['Company News', 'Technology', 'Sustainability'],
        priorities: ['low', 'medium', 'high'],
        statuses: ['published', 'unpublished'],
        authors: ['John Smith', 'Maria Garcia', 'Emma Thompson'],
      });
    });
  });
});