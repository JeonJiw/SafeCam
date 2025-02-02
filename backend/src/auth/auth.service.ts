import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  CreateUserDto,
  CreateUserWithGoogleDto,
} from 'src/users/dto/create-user.dto';
import { GoogleLoginRequestDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(req) {
    if (!req.user) {
      return {
        success: false,
        message: 'No user from google',
      };
    }
    const googleLoginRequestDto: GoogleLoginRequestDto = {
      email: req.user.email,
      googleId: req.user.googleId,
      name: req.user.name,
    };
    try {
      const { email, googleId, name } = googleLoginRequestDto;

      let user = await this.usersService.findByGoogleId(googleId);

      if (!user) {
        user = await this.usersService.findByEmail(email);
      }

      if (!user) {
        const createUserDto: CreateUserWithGoogleDto = {
          email,
          name,
          googleId,
        };
        user = await this.usersService.createWithGoogle(createUserDto);
      } else {
        try {
          const loginResult = await this.login(user);
          return {
            success: true,
            data: {
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              },
              access_token: loginResult.access_token,
            },
          };
        } catch (loginError) {
          return {
            success: false,
            message: loginError.message,
          };
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async signup(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.usersService.findByEmail(
        createUserDto.email,
      );
      console.log('exi');

      if (existingUser) {
        throw new ConflictException('This email is already registered');
      }

      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error?.message?.includes('duplicate key')) {
        throw new ConflictException('This email is already registered');
      }

      console.error('Signup error:', error);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
