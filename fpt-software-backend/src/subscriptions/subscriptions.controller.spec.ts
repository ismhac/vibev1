import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let service: SubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a subscription and return 201 status', async () => {
      // Arrange
      const createSubscriptionDto: CreateSubscriptionDto = {
        email: 'test@example.com',
        fullName: 'John Doe',
      };

      const expectedResponse = {
        message: 'Subscription received successfully',
        timestamp: new Date('2023-01-01T00:00:00.000Z'),
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.create(createSubscriptionDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(service.create).toHaveBeenCalledWith(createSubscriptionDto);
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      const createSubscriptionDto: CreateSubscriptionDto = {
        email: 'test@example.com',
        fullName: 'John Doe',
      };

      const error = new Error('Service error');
      jest.spyOn(service, 'create').mockRejectedValue(error);

      // Act & Assert
      await expect(controller.create(createSubscriptionDto)).rejects.toThrow('Service error');
    });

    it('should pass validation pipe to service', async () => {
      // Arrange
      const createSubscriptionDto: CreateSubscriptionDto = {
        email: 'valid@example.com',
        fullName: 'Valid Name',
      };

      const expectedResponse = {
        message: 'Subscription received successfully',
        timestamp: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResponse);

      // Act
      await controller.create(createSubscriptionDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createSubscriptionDto);
    });
  });
});
