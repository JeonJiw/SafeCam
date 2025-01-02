import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  UnauthorizedException,
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
  googleAuthRedirect(@Req() req) {
    // state 검증
    if (req.query.state !== req.session.state) {
      throw new UnauthorizedException('Invalid state parameter');
    }

    // 검증 후 세션의 state 삭제
    delete req.session.state;

    return this.authService.googleLogin(req);
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
}
