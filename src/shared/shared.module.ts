import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './services/mail.service';

const providers = [ConfigService, MailService];

@Global()
@Module({
  providers,
  imports: [ConfigModule.forRoot()],
  exports: [...providers],
})
export class SharedModule {}
