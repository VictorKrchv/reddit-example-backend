import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '@modules/users/users.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtPayload, Tokens } from '@modules/auth/types';
import { AuthService } from '@modules/auth/auth.service';
import { EmailSingle } from '@modules/users/types';
import { User } from '@modules/auth/decorators';
import { LocalAuthGuard } from '@modules/auth/guards';
import {
  ResetPasswordByCodeDto,
  ResetPasswordSendInstructionDto,
  UserRegisterDto,
} from '@modules/users/dto';
import { UserEntity } from '@modules/users/entities';
import { UpdateUserPasswordDto } from '@modules/users/dto/update-user-password.dto';

@ApiTags('Пользователь')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Получить информацию о текущем пользователе' })
  @ApiCreatedResponse({ type: UserEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  async me(@User() user: JwtPayload): Promise<UserEntity> {
    return this.userService.findUserById(user.id);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Регистрация пользователя' })
  @ApiCreatedResponse({ type: Tokens })
  async registration(
    @Req() req: Request,
    @Body() body: UserRegisterDto,
  ): Promise<Tokens> {
    const user = await this.userService.createUser(body);
    const tokens = await this.authService.getTokens(user.id, user.email);
    return tokens;
  }

  @Get('email/single')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Проверка почты для регистрации' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: EmailSingle })
  async check(@Query('email') email: string): Promise<any> {
    return this.userService.checkEmailForRegistration(email);
  }

  @Post('confirm/links')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    description: 'Отправить код подтверждения на email пользователя',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Boolean })
  sendConfirmCodeToEmail(@User() user: JwtPayload): Promise<boolean> {
    return this.userService.sendConfirmEmailCode(user);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Подтвердить аккаунт с помощью кода отправленного на email',
  })
  @ApiCreatedResponse({ type: Boolean })
  applyConfirmCodeFromEmail(
    @Query('code') code: string,
    @User() user: JwtPayload,
  ): Promise<boolean> {
    return this.userService.confirmEmailCode(+code, user.id);
  }

  @Post('update-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Изменить пароль',
  })
  @ApiCreatedResponse({ type: Boolean })
  updateUserPassword(
    @Body() dto: UpdateUserPasswordDto,
    @User() user: JwtPayload,
  ): Promise<boolean> {
    return this.userService.updatePassword(user.id, dto);
  }

  @Post('reset-password/links')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Восстановление пароля: отправить инструкцию для восстановления пароля на email',
  })
  @ApiCreatedResponse({ type: Boolean })
  sendResetPasswordInstruction(
    @Body() dto: ResetPasswordSendInstructionDto,
  ): Promise<boolean> {
    return this.userService.sendResetPasswordInstruction(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Восстановление пароля: подтверждение',
  })
  @ApiCreatedResponse({ type: Boolean })
  async resetPassword(@Body() dto: ResetPasswordByCodeDto): Promise<boolean> {
    const { userId } = await this.userService.resetPasswordByCode(dto);
    await this.authService.deleteUserRefreshTokens(userId);
    return true;
  }
}
