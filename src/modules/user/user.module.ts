import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth/auth.module';
import {
  ConfirmUserCodesRepository,
  ResetPasswordCodesRepository,
  UsersRepository,
} from '@modules/user/repositories';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      UsersRepository,
      ConfirmUserCodesRepository,
      ResetPasswordCodesRepository,
    ]),
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
