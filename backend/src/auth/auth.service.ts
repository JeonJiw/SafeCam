import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async googleLogin(req) {
    if (!req.user) {
      return {
        success: false,
        message: 'No user from google',
      };
    }

    try {
      const { email, sub: googleId, name, picture: profilePicture } = req.user;

      // 먼저 googleId로 사용자 찾기
      let user = await this.usersService.findByGoogleId(googleId);

      // googleId로 찾지 못하면 이메일로 한번 더 찾기
      if (!user) {
        user = await this.usersService.findByEmail(email);
      }

      // 기존 사용자가 없으면 새로 생성
      if (!user) {
        user = await this.usersService.create({
          googleId,
          email,
          name,
          profilePicture,
        });
      }
      // 기존 사용자가 있지만 googleId가 없다면 업데이트
      else if (!user.googleId) {
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
}
