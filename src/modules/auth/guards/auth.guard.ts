import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export const LocalAuthGuard = NestAuthGuard('jwt');
