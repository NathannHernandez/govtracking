import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { Reflector } from '@nestjs/core';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis'

type userFormat = {
  user : {  userId: number
  username: string
  email: string
  role: string}
}



@Injectable()
export class JwtOrRefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private reflector: Reflector,
    @InjectRedis() private readonly redis: Redis
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    //const accessToken = req.cookies['access_token'] || req.headers['authorization']?.split(' ')[1];
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const refresh_token = await req.cookies["refresh_token"]

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    // //console.log(`Variable Check : ${refreshToken} - ${isPublic} - ${accessToken}`)


        //========================================================================================
    //    If user have access token the insert it to req.user to reuse in main api request
    //========================================================================================
    if (accessToken ) {
      try {
        const currentUser = await this.redis.get(sessionId)

        if (!currentUser) {
          // handle missing session
          return false;
        }


        const parsed: userFormat = JSON.parse(currentUser)
        req.user = parsed.user; // store the user in the backend for extraction
        return true;
      } catch (err) {
        // token invalid/expired → continue to refresh token
      }
    }

    //========================================================================================
    //    When the user have expired token and he's in the public page then refresh
    //========================================================================================
    if (refresh_token && isPublic && !accessToken) {
      try {
         const refreshHash = crypto.createHash('sha256').update(refresh_token).digest('hex');
        const session = await this.redis.get(`session:${refreshHash}`)
        const parsedSession = session ? JSON.parse(session) : null

        if (!parsedSession) return false;

        const { refreshToken, ...rest } = parsedSession

        // Rotate refresh token
        const newRefreshToken = crypto.randomBytes(64).toString('hex');
        const newRefreshHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

        await this.redis.del(`session:${newRefreshHash}`);
        await this.redis.set(`session:${newRefreshHash}`, JSON.stringify({ refresh_token: newRefreshHash, ...rest }));

        res.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: true,
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        req.user = { userId: parsedSession?.user?.userId, username: parsedSession?.user?.username, role: parsedSession?.user?.role, email: parsedSession?.user?.email }

        return true;
      } catch (err) {
        //console.log('Refresh token error:', err);
        return false;
      }
    }





    return false;
  }

}