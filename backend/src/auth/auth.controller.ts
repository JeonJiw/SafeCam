import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as crypto from 'crypto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    const state = crypto.randomBytes(16).toString('hex');
    req.session.state = state;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    if (req.query.state !== req.session.state) {
      throw new UnauthorizedException('Invalid state parameter');
    }
    delete req.session.state;

    const result = await this.authService.googleLogin(req);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';

    if (result.success) {
      const queryParams = new URLSearchParams({
        access_token: result.data.access_token,
        user: JSON.stringify(result.data.user),
      }).toString();

      return res.redirect(`${frontendUrl}/auth/callback?${queryParams}`);
    } else {
      return res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent(result.message)}`,
      );
    }
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req) {
    if (!req.user) {
      return { message: 'Login failed' };
    }
    return this.authService.login(req.user);
  }

  @Post('logout')
  async logout(@Req() req, @Res() res) {
    try {
      req.session.destroy();
      res.clearCookie('connect.sid');

      return res.status(200).json({
        success: true,
        message: 'Successfully logged out',
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }
  }
}
