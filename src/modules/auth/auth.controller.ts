import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from '@modules/auth/dto/auth-credentials.dto';
import { JwtPayload, Tokens } from '@modules/auth/types';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@modules/auth/decorators';
import { UsersService } from '@modules/users/users.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Авторизация пользователя по почте и паролю' })
  @ApiCreatedResponse({ type: Tokens })
  async login(@Body() credentials: AuthCredentialsDto): Promise<Tokens> {
    return this.authService.login(credentials);
  }

  @Post('refresh')
  @ApiOperation({
    description:
      'Запрос используются при истечении access token для получения новой пары токенов',
  })
  @ApiCreatedResponse({ type: Tokens })
  async refreshTokens(@Query('token') refreshToken: string): Promise<any> {
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Закрытие сессии пользователя' })
  @ApiCreatedResponse({ type: Boolean })
  async logout(@User() user: JwtPayload): Promise<boolean> {
    return this.authService.logout(user.id);
  }
}
