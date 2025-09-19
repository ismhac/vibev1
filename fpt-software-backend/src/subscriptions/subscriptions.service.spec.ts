import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionsService],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a subscription and return success response', async () => {
      // Arrange
      const createSubscriptionDto: CreateSubscriptionDto = {
        email: 'test@example.com',
        fullName: 'John Doe',
      };

      // Spy on logger to verify logging
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      const result = await service.create(createSubscriptionDto);

      // Assert
      expect(result).toEqual({
        message: 'Subscription received successfully',
        timestamp: expect.any(Date),
      });
      expect(loggerSpy).toHaveBeenCalledWith('New subscription received: John Doe (test@example.com)');
      expect(loggerSpy).toHaveBeenCalledWith('Subscription details - Name: John Doe, Email: test@example.com');
    });

    it('should handle different email formats', async () => {
      // Arrange
      const createSubscriptionDto: CreateSubscriptionDto = {
        email: 'user.name+tag@domain.co.uk',
        fullName: 'Jane Smith',
      };

      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      const result = await service.create(createSubscriptionDto);

      // Assert
      expect(result.message).toBe('Subscription received successfully');
      expect(loggerSpy).toHaveBeenCalledWith('New subscription received: Jane Smith (user.name+tag@domain.co.uk)');
    });

    it('should handle long names', async () => {
      // Arrange
      const createSubscriptionDto: CreateSubscriptionDto = {
        email: 'longname@example.com',
        fullName: 'A'.repeat(100), // Max length according to DTO
      };

      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      const result = await service.create(createSubscriptionDto);

      // Assert
      expect(result.message).toBe('Subscription received successfully');
      expect(loggerSpy).toHaveBeenCalledWith(`New subscription received: ${'A'.repeat(100)} (longname@example.com)`);
    });
  });
});
