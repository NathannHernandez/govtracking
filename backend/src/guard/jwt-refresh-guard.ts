import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { Reflector } from '@nestjs/core';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

type userFormat = {
  user: {
    userId: number;
    username: string;
    email: string;
    role: string;
  };
};

type jwtPayload = {
  userId: number;
  username: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtOrRefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private reflector: Reflector,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh'];

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);


    // =================================
    // ✅ REFRESH TOKEN REISSUE PATH WHEN IN PUBLIC ROUTE
    // =================================
    if (refreshToken && !accessToken && isPublic) {
      try {
        const redis_info = await this.redis.get(`session:${refreshToken}`);
        if (!redis_info) {
          console.log('❌ No Redis session found for refresh token');
          return false;
        }

        const sessionData = JSON.parse(redis_info);

        if (sessionData.refreshToken !== refreshToken) {
          console.log('❌ Refresh token does not match session data');
          return false;
        }

        const user = await this.prisma.user.findFirst({
          where: { id: sessionData.userId },
        });

        if (!user) {
          console.log('❌ User not found for refresh token');
          return false;
        }

        const payload: jwtPayload = {
          userId: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        };

        const newAccessToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '5m',
        });

        res.cookie('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: true,
          path: '/',
          maxAge: 5 * 60 * 1000, // 5 minutes
        });

        req.user = payload;

        console.log('✅ New access token issued via refresh');
        return true;
      } catch (err) {
        console.log('❌ Error during refresh token flow:', err.message);
        return false;
      }
    }

    if (isPublic) return true;

    // ============================
    // ✅ VALID ACCESS TOKEN PATH
    // ============================
    if (accessToken) {
      try {
        const payload = await this.jwtService.verifyAsync(accessToken, {
          secret: process.env.JWT_SECRET,
        });

        if (!payload) return false;

        const redis_info = await this.redis.get(`session:${refreshToken}`);
        if (!redis_info) {
          console.log('⚠️ Redis session missing for access token');
          return false;
        }

        const sessionData = JSON.parse(redis_info);

        req.user = {
          ...payload,
          csrf_token: sessionData.csrf_token,
        };

        return true;
      } catch (err) {
        console.log('⚠️ Invalid access token:', err.message);
        // fall through to refresh token
      }
    }

    // =================================
    // ✅ REFRESH TOKEN REISSUE PATH
    // =================================
    if (refreshToken && !accessToken) {
      try {
        const redis_info = await this.redis.get(`session:${refreshToken}`);
        if (!redis_info) {
          console.log('❌ No Redis session found for refresh token');
          return false;
        }

        const sessionData = JSON.parse(redis_info);

        if (sessionData.refreshToken !== refreshToken) {
          console.log('❌ Refresh token does not match session data');
          return false;
        }

        const user = await this.prisma.user.findFirst({
          where: { id: sessionData.userId },
        });

        if (!user) {
          console.log('❌ User not found for refresh token');
          return false;
        }

        const payload: jwtPayload = {
          userId: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        };

        const newAccessToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '5m',
        });

        res.cookie('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: true,
          path: '/',
          maxAge: 5 * 60 * 1000, // 5 minutes
        });

        req.user = payload;

        console.log('✅ New access token issued via refresh');
        return true;
      } catch (err) {
        console.log('❌ Error during refresh token flow:', err.message);
        return false;
      }
    }

    // ==============================
    // ❌ NO VALID TOKENS FOUND
    // ==============================
    console.log('❌ No valid token found, rejecting request');
    return false;
  }
}
