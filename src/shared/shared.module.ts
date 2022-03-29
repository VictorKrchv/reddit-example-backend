import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './services/mail.service';
import './boilerplate.polyfill';

const providers = [MailService];

@Global()
@Module({
  providers,
  imports: [ConfigModule.forRoot()],
  exports: [...providers],
})
export class SharedModule {}
