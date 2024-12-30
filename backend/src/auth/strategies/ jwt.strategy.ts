import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    //console.log('JWT payload: ', payload);
    /*
    payload:  {
        email: 'Admin@example.com',
        sub: 10,
        name: 'Admin Jiwon',
        role: 'admin',
        iat: 1735342146,
        exp: 1735345746
        }
      */
    return {
      userId: payload.sub,
      username: payload.name,
      role: payload.role,
    };
  }
}
