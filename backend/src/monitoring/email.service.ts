import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendVerificationCode(
    verificationCode: string,
    userId: number,
    monitoringUrl: string,
  ) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const mailOptions = {
        from: this.configService.get('EMAIL_USER'),
        to: user.email,
        subject: 'SafeCam Monitoring Verification Code',
        html: `
          <h2>SafeCam Monitoring Started</h2>
          <p>Your verification code: <strong>${verificationCode}</strong></p>
          <p>Monitor your device here:</p>
          <a href="${monitoringUrl}">Access Monitoring</a>
          <p>This link will work only during the active monitoring session.</p>
        `,
      };

      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
