import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const refreshToken = req.cookies['refresh'];
    const csrfTokenFromHeader = req.headers['x-csrf-token'];
    
    if (!refreshToken || !csrfTokenFromHeader) {
      throw new ForbiddenException('Missing CSRF or refresh token');
    }

    const redisSession = await this.redis.get(`session:${refreshToken}`);
    if (!redisSession) {
      throw new ForbiddenException('Invalid session');
    }

    let sessionData;
    try {
      sessionData = JSON.parse(redisSession);
    } catch (err) {
      throw new ForbiddenException('Invalid session data');
    }

    const csrfTokenFromRedis = sessionData.csrf_token;

    if (!csrfTokenFromRedis || csrfTokenFromRedis !== csrfTokenFromHeader) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    // CSRF token is valid
    return true;
  }
}
