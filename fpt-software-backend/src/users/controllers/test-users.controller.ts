import { 
  Controller, 
  Get, 
  Query, 
  ParseIntPipe
} from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('api/v1/test-users')
export class TestUsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Test endpoint without authentication for debugging
   * @returns Test response
   */
  @Get()
  async testEndpoint(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ): Promise<any> {
    console.log('Test endpoint received params:', { page, limit, search, role, status });
    return this.usersService.findAll(page, limit, search, role, status);
  }
}
