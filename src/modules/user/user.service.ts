import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '@modules/user/entities/user.entity';
import { UsersRepository } from '@modules/user/repositories/users.repository';
import { UserRegisterDto } from '@modules/user/dto/user-register.dto';
import { isEmail } from 'class-validator';
import { EmailSingle } from '@modules/user/types';
import { MailService } from '@shared/services/mail.service';
import { JwtPayload } from '@modules/auth/types';
import { ConfirmUserCodesRepository } from '@modules/user/repositories/confirm-user-codes.repository';
import { generateRandomNumber } from '@shared/libs/generate-random-number';
import { addMinutes } from 'date-fns';
import { ResetPasswordCodesRepository } from '@modules/user/repositories';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  ResetPasswordByCodeDto,
  ResetPasswordSendInstructionDto,
} from '@modules/user/dto';
import { UpdateUserPasswordDto } from '@modules/user/dto/update-user-password.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UsersRepository,
    private confirmUserCodesRepository: ConfirmUserCodesRepository,
    private resetPasswordCodesRepository: ResetPasswordCodesRepository,
    private mailService: MailService,
  ) {}

  async createUser(user: UserRegisterDto): Promise<UserEntity> {
    const hasUser = await this.findUserByEmail(user.email);

    if (hasUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const entity = this.userRepository.create(user);
    return await this.userRepository.save(entity);
  }

  findUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ id });
  }

  findUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async checkEmailForRegistration(email: string): Promise<EmailSingle> {
    const user = await this.findUserByEmail(email);
    return { exists: !!user, noValid: !isEmail(email) };
  }

  async sendConfirmEmailCode(user: JwtPayload): Promise<boolean> {
    const code = generateRandomNumber();
    const durationIsMinutes = 15;
    const expiredAt = addMinutes(new Date(), durationIsMinutes);

    try {
      await this.mailService.sendEmail({
        to: user.email,
        subject: 'Подтверждение аккаунта.',
        html: `Код для подтверждения аккаунта ${code}. Код действителен в течение ${durationIsMinutes} минут.`,
      });

      const entity = this.confirmUserCodesRepository.create({
        userId: user.id,
        code,
        expiredAt,
      });
      await this.confirmUserCodesRepository.save(entity);

      return true;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async confirmEmailCode(code: number, userId: number): Promise<boolean> {
    const entity = await this.confirmUserCodesRepository.findOne({
      userId,
      code,
    });

    if (!entity) {
      throw new BadRequestException('Code is wrong');
    }

    const codeIsExpired = entity.expiredAt.getTime() < Date.now();

    if (codeIsExpired) {
      throw new BadRequestException('Code is expired');
    }

    await this.userRepository.update({ id: userId }, { isConfirmed: true });

    return true;
  }

  async sendResetPasswordInstruction(
    dto: ResetPasswordSendInstructionDto,
  ): Promise<boolean> {
    const code = uuidv4();
    const durationIsMinutes = 15;
    const expiredAt = addMinutes(new Date(), durationIsMinutes);

    const user = await this.findUserByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.mailService.sendEmail({
      to: dto.email,
      subject: 'Восстановление пароля',
      html: `Ссылка для восстановление пароля ${dto.callbackUrl}?forgotCode=${code}`,
    });

    const entity = this.resetPasswordCodesRepository.create({
      userId: user.id,
      code,
      expiredAt,
    });
    await this.resetPasswordCodesRepository.save(entity);

    return true;
  }

  async resetPasswordByCode(
    dto: ResetPasswordByCodeDto,
  ): Promise<{ userId: number }> {
    const resetPasswordEntity = await this.resetPasswordCodesRepository.findOne(
      {
        code: dto.code,
      },
    );

    if (!resetPasswordEntity) {
      throw new BadRequestException('Code is wrong');
    }

    const codeIsExpired = resetPasswordEntity.expiredAt.getTime() < Date.now();

    if (codeIsExpired) {
      throw new BadRequestException('Code is expired');
    }

    const user = await this.findUserById(resetPasswordEntity.userId);
    await this.changePassword(dto.newPassword, user);

    this.resetPasswordCodesRepository
      .delete({ id: resetPasswordEntity.id })
      .then();
    return { userId: resetPasswordEntity.userId };
  }

  async updatePassword(userId: number, dto: UpdateUserPasswordDto) {
    const user = await this.findUserById(userId);

    const passwordsMatched = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );

    if (!passwordsMatched) {
      throw new BadRequestException('Invalid old password');
    }

    await this.changePassword(dto.newPassword, user);

    return true;
  }

  private async changePassword(newPassword: string, user: UserEntity) {
    const passwordsMatched = await bcrypt.compare(newPassword, user.password);

    if (passwordsMatched) {
      throw new BadRequestException(
        'The password must not be the same as the old one.',
      );
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }
}
