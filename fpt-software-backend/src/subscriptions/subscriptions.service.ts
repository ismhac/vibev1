import { Injectable, Logger } from '@nestjs/common';
import { CreateSubscriptionDto, SubscriptionResponseDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  /**
   * Process subscription form submission
   * @param createSubscriptionDto - Subscription data containing email and fullName
   * @returns Response indicating successful processing
   */
  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    const { email, fullName } = createSubscriptionDto;
    
    // Log subscription information to console (simulating email sending)
    this.logger.log(`New subscription received: ${fullName} (${email})`);
    this.logger.log(`Subscription details - Name: ${fullName}, Email: ${email}`);
    
    return {
      message: 'Subscription received successfully',
      timestamp: new Date(),
    };
  }
}
