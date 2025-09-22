import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustriesService } from './industries.service';
import { Industry } from './entities/industry.entity';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { ConflictException } from '@nestjs/common';
import { Like } from 'typeorm';

describe('IndustriesService', () => {
  let service: IndustriesService;
  let repository: Repository<Industry>;

  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  const mockIndustry = {
    id: 1,
    name: 'Technology',
    description: 'Cutting-edge technology solutions',
    imageUrl: null,
    isActive: true,
    createdAt: new Date('2025-09-21T09:58:52.100Z'),
    updatedAt: new Date('2025-09-21T09:58:52.118Z'),
  };

  const mockIndustries = [
    {
      id: 1,
      name: 'Technology',
      description: 'Cutting-edge technology solutions',
      imageUrl: null,
      isActive: true,
      createdAt: new Date('2025-09-21T09:58:52.100Z'),
      updatedAt: new Date('2025-09-21T09:58:52.118Z'),
    },
    {
      id: 2,
      name: 'Healthcare',
      description: 'Innovative healthcare technology',
      imageUrl: null,
      isActive: true,
      createdAt: new Date('2025-09-21T09:58:52.100Z'),
      updatedAt: new Date('2025-09-21T09:58:52.118Z'),
    },
    {
      id: 3,
      name: 'Finance',
      description: 'Financial technology solutions',
      imageUrl: null,
      isActive: false,
      createdAt: new Date('2025-09-21T09:58:52.100Z'),
      updatedAt: new Date('2025-09-21T09:58:52.118Z'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndustriesService,
        {
          provide: getRepositoryToken(Industry),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IndustriesService>(IndustriesService);
    repository = module.get<Repository<Industry>>(getRepositoryToken(Industry));

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll - Search Functionality', () => {
    it('should return all industries when no search term provided', async () => {
      // Arrange
      mockRepository.findAndCount.mockResolvedValue([mockIndustries, 3]);

      // Act
      const result = await service.findAll(1, 10);

      // Assert
      expect(result).toEqual({
        data: mockIndustries.map(industry => ({
          id: industry.id,
          name: industry.name,
          description: industry.description,
          imageUrl: industry.imageUrl,
          isActive: industry.isActive,
          createdAt: industry.createdAt,
          updatedAt: industry.updatedAt,
        })),
        total: 3,
        page: 1,
        limit: 10,
      });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should return filtered industries when search term provided', async () => {
      // Arrange
      const searchTerm = 'Technology';
      const filteredIndustries = [mockIndustries[0]];
      mockRepository.findAndCount.mockResolvedValue([filteredIndustries, 1]);

      // Act
      const result = await service.findAll(1, 10, searchTerm);

      // Assert
      expect(result).toEqual({
        data: filteredIndustries.map(industry => ({
          id: industry.id,
          name: industry.name,
          description: industry.description,
          imageUrl: industry.imageUrl,
          isActive: industry.isActive,
          createdAt: industry.createdAt,
          updatedAt: industry.updatedAt,
        })),
        total: 1,
        page: 1,
        limit: 10,
      });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          name: Like(`%${searchTerm}%`),
        },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle empty search term', async () => {
      // Arrange
      mockRepository.findAndCount.mockResolvedValue([mockIndustries, 3]);

      // Act
      const result = await service.findAll(1, 10, '');

      // Assert
      expect(result.total).toBe(3);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle whitespace-only search term', async () => {
      // Arrange
      mockRepository.findAndCount.mockResolvedValue([mockIndustries, 3]);

      // Act
      const result = await service.findAll(1, 10, '   ');

      // Assert
      expect(result.total).toBe(3);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle case-insensitive search', async () => {
      // Arrange
      const searchTerm = 'technology';
      const filteredIndustries = [mockIndustries[0]];
      mockRepository.findAndCount.mockResolvedValue([filteredIndustries, 1]);

      // Act
      const result = await service.findAll(1, 10, searchTerm);

      // Assert
      expect(result.total).toBe(1);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          name: Like(`%${searchTerm}%`),
        },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle partial search matches', async () => {
      // Arrange
      const searchTerm = 'Tech';
      const filteredIndustries = [mockIndustries[0]];
      mockRepository.findAndCount.mockResolvedValue([filteredIndustries, 1]);

      // Act
      const result = await service.findAll(1, 10, searchTerm);

      // Assert
      expect(result.total).toBe(1);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          name: Like(`%${searchTerm}%`),
        },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle pagination correctly', async () => {
      // Arrange
      mockRepository.findAndCount.mockResolvedValue([mockIndustries.slice(0, 2), 3]);

      // Act
      const result = await service.findAll(2, 2);

      // Assert
      expect(result.page).toBe(2);
      expect(result.limit).toBe(2);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 2, // (page - 1) * limit = (2 - 1) * 2 = 2
        take: 2,
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      mockRepository.findAndCount.mockRejectedValue(error);

      // Act & Assert
      await expect(service.findAll(1, 10)).rejects.toThrow('Database connection failed');
    });
  });

  describe('findAllWithStatus - Status Filter Functionality', () => {
    it('should return active industries when status is "active"', async () => {
      // Arrange
      const activeIndustries = mockIndustries.filter(industry => industry.isActive);
      mockRepository.findAndCount.mockResolvedValue([activeIndustries, 2]);

      // Act
      const result = await service.findAllWithStatus(1, 10, 'active');

      // Assert
      expect(result.total).toBe(2);
      expect(result.data.every(industry => industry.isActive)).toBe(true);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should return inactive industries when status is "inactive"', async () => {
      // Arrange
      const inactiveIndustries = mockIndustries.filter(industry => !industry.isActive);
      mockRepository.findAndCount.mockResolvedValue([inactiveIndustries, 1]);

      // Act
      const result = await service.findAllWithStatus(1, 10, 'inactive');

      // Assert
      expect(result.total).toBe(1);
      expect(result.data.every(industry => !industry.isActive)).toBe(true);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isActive: false },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should return active industries when status is "true"', async () => {
      // Arrange
      const activeIndustries = mockIndustries.filter(industry => industry.isActive);
      mockRepository.findAndCount.mockResolvedValue([activeIndustries, 2]);

      // Act
      const result = await service.findAllWithStatus(1, 10, 'true');

      // Assert
      expect(result.total).toBe(2);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should return inactive industries when status is "false"', async () => {
      // Arrange
      const inactiveIndustries = mockIndustries.filter(industry => !industry.isActive);
      mockRepository.findAndCount.mockResolvedValue([inactiveIndustries, 1]);

      // Act
      const result = await service.findAllWithStatus(1, 10, 'false');

      // Assert
      expect(result.total).toBe(1);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isActive: false },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should return all industries when status is empty or invalid', async () => {
      // Arrange
      mockRepository.findAndCount.mockResolvedValue([mockIndustries, 3]);

      // Act
      const result = await service.findAllWithStatus(1, 10, '');

      // Assert
      expect(result.total).toBe(3);
      // When status is empty, it calls findAll method which has empty where clause
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle case-insensitive status values', async () => {
      // Arrange
      const activeIndustries = mockIndustries.filter(industry => industry.isActive);
      mockRepository.findAndCount.mockResolvedValue([activeIndustries, 2]);

      // Act
      const result = await service.findAllWithStatus(1, 10, 'ACTIVE');

      // Assert
      expect(result.total).toBe(2);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      mockRepository.findAndCount.mockRejectedValue(error);

      // Act & Assert
      await expect(service.findAllWithStatus(1, 10, 'active')).rejects.toThrow('Database connection failed');
    });
  });

  describe('getFilterOptions', () => {
    it('should return available status options', async () => {
      // Act
      const result = await service.getFilterOptions();

      // Assert
      expect(result).toEqual({
        statuses: ['active', 'inactive']
      });
    });
  });

  describe('CRUD Operations', () => {
    describe('create', () => {
      const createIndustryDto: CreateIndustryDto = {
        name: 'New Industry',
        description: 'A new industry',
        imageUrl: 'https://example.com/image.jpg',
        isActive: true,
      };

      it('should create a new industry successfully', async () => {
        // Arrange
        mockRepository.findOne.mockResolvedValue(null); // No existing industry
        mockRepository.create.mockReturnValue(createIndustryDto);
        mockRepository.save.mockResolvedValue(mockIndustry);

        // Act
        const result = await service.create(createIndustryDto);

        // Assert
        expect(result).toEqual({
          id: mockIndustry.id,
          name: mockIndustry.name,
          description: mockIndustry.description,
          imageUrl: mockIndustry.imageUrl,
          isActive: mockIndustry.isActive,
          createdAt: mockIndustry.createdAt,
          updatedAt: mockIndustry.updatedAt,
        });

        expect(mockRepository.findOne).toHaveBeenCalledWith({
          where: { name: createIndustryDto.name }
        });
        expect(mockRepository.create).toHaveBeenCalledWith(createIndustryDto);
        expect(mockRepository.save).toHaveBeenCalledWith(createIndustryDto);
      });

      it('should throw ConflictException when industry with same name exists', async () => {
        // Arrange
        mockRepository.findOne.mockResolvedValue(mockIndustry);

        // Act & Assert
        await expect(service.create(createIndustryDto)).rejects.toThrow(ConflictException);
        expect(mockRepository.findOne).toHaveBeenCalledWith({
          where: { name: createIndustryDto.name }
        });
      });

      it('should handle database errors gracefully', async () => {
        // Arrange
        const error = new Error('Database connection failed');
        mockRepository.findOne.mockRejectedValue(error);

        // Act & Assert
        await expect(service.create(createIndustryDto)).rejects.toThrow('Database connection failed');
      });
    });

    describe('findOne', () => {
      it('should return an industry by id', async () => {
        // Arrange
        mockRepository.findOne.mockResolvedValue(mockIndustry);

        // Act
        const result = await service.findOne(1);

        // Assert
        expect(result).toEqual({
          id: mockIndustry.id,
          name: mockIndustry.name,
          description: mockIndustry.description,
          imageUrl: mockIndustry.imageUrl,
          isActive: mockIndustry.isActive,
          createdAt: mockIndustry.createdAt,
          updatedAt: mockIndustry.updatedAt,
        });
      });

      it('should handle industry not found', async () => {
        // Arrange
        mockRepository.findOne.mockResolvedValue(null);

        // Act & Assert
        await expect(service.findOne(999)).rejects.toThrow();
      });
    });

    describe('update', () => {
      const updateIndustryDto: UpdateIndustryDto = {
        name: 'Updated Industry',
        description: 'Updated description',
      };

      it('should update an industry successfully', async () => {
        // Arrange
        const existingIndustry = { ...mockIndustry };
        const updatedIndustry = { ...mockIndustry, ...updateIndustryDto };
        
        mockRepository.findOne.mockResolvedValueOnce(existingIndustry); // For finding existing
        mockRepository.findOne.mockResolvedValueOnce(null); // For checking name conflict
        mockRepository.save.mockResolvedValue(updatedIndustry);

        // Act
        const result = await service.update(1, updateIndustryDto);

        // Assert
        expect(result.name).toBe(updateIndustryDto.name);
        expect(result.description).toBe(updateIndustryDto.description);
      });

      it('should throw ConflictException when updating to existing name', async () => {
        // Arrange
        const existingIndustry = { ...mockIndustry };
        const conflictingIndustry = { ...mockIndustry, id: 2 };
        
        mockRepository.findOne.mockResolvedValueOnce(existingIndustry); // For finding existing
        mockRepository.findOne.mockResolvedValueOnce(conflictingIndustry); // For checking name conflict

        // Act & Assert
        await expect(service.update(1, updateIndustryDto)).rejects.toThrow(ConflictException);
      });
    });

    describe('remove', () => {
      it('should delete an industry successfully', async () => {
        // Arrange
        mockRepository.findOne.mockResolvedValue(mockIndustry);
        mockRepository.remove.mockResolvedValue(mockIndustry);

        // Act
        await service.remove(1);

        // Assert
        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(mockRepository.remove).toHaveBeenCalledWith(mockIndustry);
      });

      it('should handle industry not found during deletion', async () => {
        // Arrange
        mockRepository.findOne.mockResolvedValue(null);

        // Act & Assert
        await expect(service.remove(999)).rejects.toThrow();
      });
    });
  });

  describe('applySearchFilter', () => {
    it('should apply search filter correctly', () => {
      // Arrange
      const queryBuilder = {
        where: jest.fn(),
      };
      const searchTerm = 'Technology';

      // Act
      service['applySearchFilter'](queryBuilder, searchTerm);

      // Assert
      expect(queryBuilder.where).toHaveBeenCalledWith('entity.name LIKE :search', {
        search: `%${searchTerm}%`
      });
    });
  });
});