import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from '@modules/auth/dto/auth-credentials.dto';
import { UserEntity } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from '@modules/auth/types';
import { SessionsRepository } from '@modules/auth/repositories/sessions.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionRepository: SessionsRepository,
  ) {}

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const payload: JwtPayload = { id: userId, email };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.ACCESS_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.REFRESH_EXPIRES_IN,
      }),
    ]);

    await this.updateRtHash(userId, refresh_token);

    return { access_token, refresh_token };
  }

  async updateRtHash(userId: number, rt: string) {
    const session = await this.sessionRepository.findOne({
      user: { id: userId },
    });

    if (session) {
      await this.sessionRepository.update(
        { id: session.id },
        { refreshToken: rt },
      );
    } else {
      const session = this.sessionRepository.create({
        user: { id: userId },
        refreshToken: rt,
      });
      await this.sessionRepository.save(session);
    }
  }

  async login(credentials: AuthCredentialsDto): Promise<Tokens> {
    const user = await this.validateUser(credentials);
    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }

  async validateUser(user: AuthCredentialsDto): Promise<UserEntity> {
    const storedUser = await this.usersService.findUserByEmail(user.email);

    if (!storedUser) {
      throw new ForbiddenException('Access denied');
    }

    const isPasswordCorrect = await bcrypt.compare(
      user.password,
      storedUser.password,
    );

    if (!isPasswordCorrect) {
      throw new ForbiddenException('Access denied');
    }

    return storedUser;
  }

  async deleteUserRefreshTokens(userId: number) {
    return await this.sessionRepository.delete({ user: { id: userId } });
  }

  async refreshTokens(refreshToken): Promise<Tokens> {
    const { id: userId, email } = this.jwtService.decode(
      refreshToken,
    ) as JwtPayload;

    const session = await this.sessionRepository.findOne({ refreshToken });

    if (!session) {
      throw new ForbiddenException('Access denied');
    }

    const isMatch = session.refreshToken === refreshToken;

    if (!isMatch) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(userId, email);

    return tokens;
  }

  async logout(userId: number) {
    await this.sessionRepository.delete({ user: { id: userId } });
    return true;
  }
}
