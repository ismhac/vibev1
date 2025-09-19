import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';

@Controller('api/v1/test-auth')
export class TestAuthController {
  
  /**
   * Public endpoint - no authentication required
   */
  @Get('public')
  @Public()
  getPublicData() {
    return {
      message: 'This is a public endpoint',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Protected endpoint - requires valid JWT token
   */
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtectedData(@Request() req: any) {
    return {
      message: 'This is a protected endpoint',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Admin only endpoint - requires Admin role
   */
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAdminData(@Request() req: any) {
    return {
      message: 'This is an admin-only endpoint',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Editor only endpoint - requires Editor role
   */
  @Get('editor-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor')
  getEditorData(@Request() req: any) {
    return {
      message: 'This is an editor-only endpoint',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Multi-role endpoint - requires Admin or Editor role
   */
  @Get('admin-or-editor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  getAdminOrEditorData(@Request() req: any) {
    return {
      message: 'This endpoint requires Admin or Editor role',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
