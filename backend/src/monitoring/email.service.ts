import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { UsersService } from '../users/users.service'; // 추가

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService, // 추가
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_APP_PASSWORD'), // 앱 비밀번호 사용
      },
    });
  }

  async sendVerificationCode(verificationCode: string, userId: number) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const mailOptions = {
        from: this.configService.get('EMAIL_USER'),
        to: user.email,
        subject: 'SafeCam Monitoring Verification Code',
        text: `Your verification code for SafeCam monitoring is: ${verificationCode}
        
This code is required to stop the monitoring session. Do not share this code with others.

If you did not request this code, please check your device immediately.`,
      };

      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
