import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  transporter: nodemailer.Transporter;
  user: string;

  constructor() {
    this.user = process.env.EMAIL_LOGIN;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.user,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(options: Omit<nodemailer.SendMailOptions, 'from'>) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(
        { ...options, from: this.user },
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        },
      );
    });
  }
}
