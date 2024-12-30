import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/ jwt.strategy';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [
    PassportModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AdminGuard,
    AuthService,
    GoogleStrategy,
    LocalStrategy,
  ],
  exports: [AuthService, AdminGuard],
})
export class AuthModule {}
