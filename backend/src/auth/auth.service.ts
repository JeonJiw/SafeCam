import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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

    try {
      const { email, sub: googleId, name, picture: profilePicture } = req.user;

      let user = await this.usersService.findByGoogleId(googleId);

      if (!user) {
        user = await this.usersService.findByEmail(email);
      }

      if (!user) {
        user = await this.usersService.createWithGoogle({
          googleId,
          email,
          name,
          profilePicture,
        });
      } else if (!user.googleId) {
        user = await this.usersService.update(user.id, {
          googleId,
          profilePicture,
        });
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async signup(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
