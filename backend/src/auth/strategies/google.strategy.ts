import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }
  //Only after the token exchange is successful
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, id } = profile;
    try {
      let user = await this.usersService.findByGoogleId(id); // Google ID로 사용자 조회

      if (!user) {
        user = await this.usersService.findByEmail(emails[0].value);
      }

      if (!user) {
        user = await this.usersService.createWithGoogle({
          googleId: id,
          email: emails[0].value,
          name: displayName,
        });
      } else if (!user.googleId) {
        user = await this.usersService.update(user.id, { googleId: id });
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
