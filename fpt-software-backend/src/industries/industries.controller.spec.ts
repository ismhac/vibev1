import { Test, TestingModule } from '@nestjs/testing';
import { IndustriesController } from './industries.controller';
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { IndustryListResponseDto, IndustryResponseDto } from './dto/industry-response.dto';

describe('IndustriesController', () => {
  let controller: IndustriesController;
  let service: IndustriesService;

  const mockIndustriesService = {
    findAll: jest.fn(),
    findAllWithStatus: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getFilterOptions: jest.fn(),
  };

  const mockIndustry: IndustryResponseDto = {
    id: 1,
    name: 'Technology',
    description: 'Cutting-edge technology solutions',
    imageUrl: undefined,
    isActive: true,
    createdAt: new Date('2025-09-21T09:58:52.100Z'),
    updatedAt: new Date('2025-09-21T09:58:52.118Z'),
  };

  const mockIndustryList: IndustryListResponseDto = {
    data: [mockIndustry],
    total: 1,
    page: 1,
    limit: 10,
  };

  const mockFilterOptions = {
    statuses: ['active', 'inactive']
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndustriesController],
      providers: [
        {
          provide: IndustriesService,
          useValue: mockIndustriesService,
        },
      ],
    }).compile();

    controller = module.get<IndustriesController>(IndustriesController);
    service = module.get<IndustriesService>(IndustriesService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all industries when no search or status provided', async () => {
      // Arrange
      mockIndustriesService.findAll.mockResolvedValue(mockIndustryList);

      // Act
      const result = await controller.findAll(1, 10);

      // Assert
      expect(result).toEqual(mockIndustryList);
      expect(mockIndustriesService.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should call service.findAll when search term is provided', async () => {
      // Arrange
      const searchTerm = 'Technology';
      mockIndustriesService.findAll.mockResolvedValue(mockIndustryList);

      // Act
      const result = await controller.findAll(1, 10, searchTerm);

      // Assert
      expect(result).toEqual(mockIndustryList);
      expect(mockIndustriesService.findAll).toHaveBeenCalledWith(1, 10, searchTerm);
    });

    it('should call service.findAllWithStatus when status is provided', async () => {
      // Arrange
      const status = 'active';
      mockIndustriesService.findAllWithStatus.mockResolvedValue(mockIndustryList);

      // Act
      const result = await controller.findAll(1, 10, undefined, status);

      // Assert
      expect(result).toEqual(mockIndustryList);
      expect(mockIndustriesService.findAllWithStatus).toHaveBeenCalledWith(1, 10, status);
    });

    it('should prioritize search over status when both are provided', async () => {
      // Arrange
      const searchTerm = 'Technology';
      const status = 'active';
      mockIndustriesService.findAll.mockResolvedValue(mockIndustryList);

      // Act
      const result = await controller.findAll(1, 10, searchTerm, status);

      // Assert
      expect(result).toEqual(mockIndustryList);
      expect(mockIndustriesService.findAll).toHaveBeenCalledWith(1, 10, searchTerm);
      expect(mockIndustriesService.findAllWithStatus).not.toHaveBeenCalled();
    });

    it('should handle empty search term', async () => {
      // Arrange
      mockIndustriesService.findAll.mockResolvedValue(mockIndustryList);

      // Act
      const result = await controller.findAll(1, 10, '');

      // Assert
      expect(result).toEqual(mockIndustryList);
      // Empty string is treated as no search term, so it calls findAll without search parameter
      expect(mockIndustriesService.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should handle empty status', async () => {
      // Arrange
      mockIndustriesService.findAll.mockResolvedValue(mockIndustryList);

      // Act
      const result = await controller.findAll(1, 10, undefined, '');

      // Assert
      expect(result).toEqual(mockIndustryList);
      expect(mockIndustriesService.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should handle whitespace-only search term', async () => {
      // Arrange
      mockIndustriesService.findAll.mockResolvedValue(mockIndustryList);

      // Act
      const result = await controller.findAll(1, 10, '   ');

      // Assert
      expect(result).toEqual(mockIndustryList);
      // Whitespace-only string is treated as no search term, so it calls findAll without search parameter
      expect(mockIndustriesService.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should handle whitespace-only status', async () => {
      // Arrange
      mockIndustriesService.findAll.mockResolvedValue(mockIndustryList);

      // Act
      const result = await controller.findAll(1, 10, undefined, '   ');

      // Assert
      expect(result).toEqual(mockIndustryList);
      expect(mockIndustriesService.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Service error');
      mockIndustriesService.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findAll(1, 10)).rejects.toThrow('Service error');
    });
  });

  describe('getFilterOptions', () => {
    it('should return filter options', async () => {
      // Arrange
      mockIndustriesService.getFilterOptions.mockResolvedValue(mockFilterOptions);

      // Act
      const result = await controller.getFilterOptions();

      // Assert
      expect(result).toEqual(mockFilterOptions);
      expect(mockIndustriesService.getFilterOptions).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Service error');
      mockIndustriesService.getFilterOptions.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getFilterOptions()).rejects.toThrow('Service error');
    });
  });

  describe('create', () => {
    const createIndustryDto: CreateIndustryDto = {
      name: 'New Industry',
      description: 'A new industry',
      imageUrl: 'https://example.com/image.jpg',
      isActive: true,
    };

    it('should create a new industry', async () => {
      // Arrange
      mockIndustriesService.create.mockResolvedValue(mockIndustry);

      // Act
      const result = await controller.create(createIndustryDto);

      // Assert
      expect(result).toEqual(mockIndustry);
      expect(mockIndustriesService.create).toHaveBeenCalledWith(createIndustryDto);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Service error');
      mockIndustriesService.create.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.create(createIndustryDto)).rejects.toThrow('Service error');
    });
  });

  describe('findOne', () => {
    it('should return an industry by id', async () => {
      // Arrange
      const id = 1;
      mockIndustriesService.findOne.mockResolvedValue(mockIndustry);

      // Act
      const result = await controller.findOne(id);

      // Assert
      expect(result).toEqual(mockIndustry);
      expect(mockIndustriesService.findOne).toHaveBeenCalledWith(id);
    });

    it('should handle service errors', async () => {
      // Arrange
      const id = 1;
      const error = new Error('Service error');
      mockIndustriesService.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findOne(id)).rejects.toThrow('Service error');
    });
  });

  describe('update', () => {
    const updateIndustryDto: UpdateIndustryDto = {
      name: 'Updated Industry',
      description: 'Updated description',
    };

    it('should update an industry', async () => {
      // Arrange
      const id = 1;
      const updatedIndustry = { ...mockIndustry, ...updateIndustryDto };
      mockIndustriesService.update.mockResolvedValue(updatedIndustry);

      // Act
      const result = await controller.update(id, updateIndustryDto);

      // Assert
      expect(result).toEqual(updatedIndustry);
      expect(mockIndustriesService.update).toHaveBeenCalledWith(id, updateIndustryDto);
    });

    it('should handle service errors', async () => {
      // Arrange
      const id = 1;
      const error = new Error('Service error');
      mockIndustriesService.update.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.update(id, updateIndustryDto)).rejects.toThrow('Service error');
    });
  });

  describe('remove', () => {
    it('should delete an industry', async () => {
      // Arrange
      const id = 1;
      mockIndustriesService.remove.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove(id);

      // Assert
      expect(result).toBeUndefined();
      expect(mockIndustriesService.remove).toHaveBeenCalledWith(id);
    });

    it('should handle service errors', async () => {
      // Arrange
      const id = 1;
      const error = new Error('Service error');
      mockIndustriesService.remove.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.remove(id)).rejects.toThrow('Service error');
    });
  });
});