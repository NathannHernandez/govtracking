import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Redis } from 'ioredis'

type jwtPayload = {
  userId :number
  username : string
  email : string
  role : string
}


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis
  ) { }

  // ======================================================
  //                     GET
  // ======================================================
  get() {
    return this.prisma.user.findMany()
  }

  //=========================================
  //    Redis example
  //==========================================
  async setValue(key: string, value: string) {
    await this.redis.set(key, value)
  }

  async getValue(key: string) {
    return await this.redis.get(key)
  }

  // ======================================================
  //                     LOGIN
  // ======================================================
  async login(loginAuthDto: LoginAuthDto, req: Request, res: Response) {
    try {
      const { email, password } = loginAuthDto;
      const user = await this.validateUser(email, password);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const payload : jwtPayload = { userId: user.id, email: user.email, username: user.username, role: user.role };
      // const access_token = this.jwtService.sign(payload);

      // 1. Generate a random refresh token
      const refreshToken = crypto.randomBytes(64).toString('hex');
      const csrfToken = crypto.randomBytes(64).toString('hex');
  
      // 2. Hash it for storing in DB
      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const csrfTokenHash = crypto.createHash('sha256').update(csrfToken).digest('hex');
      //const sessionIdHash = crypto.createHash('sha256').update(sessionId).digest('hex');
      //3. fetch the ip adress and browser
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const deviceInfo = req.headers['user-agent'];


      await this.redis.set(
      `session:${refreshTokenHash}`,
        JSON.stringify({
          refreshToken: refreshTokenHash,
          csrf_token: csrfTokenHash,
          ip: ip,
          device_info: deviceInfo,
          created_at: new Date().toISOString(),
          user : payload
        }),
        'EX',
        60 * 60 * 24 * 7, // 7 days
      )

      await res.cookie('refresh', refreshTokenHash, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: true,
        path: '/',
        maxAge:  60 * 60 * 24 * 7, // 7 days
      });


      return {
        isAuthenticated: true
      }
    } catch (err) {

      return {
        isAuthenticated: false
      }
    }
  }

  // ======================================================
  //                     REGISTER
  // ======================================================
  async register(createAuthDto: CreateAuthDto) {
    const { email, password, username } = createAuthDto;

    // Check if user already exists
    const checkUser = await this.validateUser(email, password);
    if (checkUser) {
      throw new Error('User already exists');
    }

    // Hash password and create new user
    const hash = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hash,
        username,
      },
    });

    await this.prisma.userInfo.create({
      data: {
        userId: Number(newUser.id),
        email: newUser.email,
        username: newUser.username!
      }
    })

    const { password: _, ...result } = newUser;
    return result;
  }

  // ======================================================
  //             VALIDATE USER CREDENTIALS
  // ======================================================
  async validateUser(email: string, password: string) {

    const user = await this.prisma.user.findUnique({ where: { email } });

    const validateUser = await bcrypt.compare(password, user?.password || '');

    if (!validateUser) return null;

    if (user) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }


  // ======================================================
  //                     CHECK AUTH FOR PUBLIC PAGES
  // ======================================================
  async check_auth_public(req: Request) {
    const token = req.cookies.refresh_token
    //console.log("Token : ", token)
    if (!token) return { logged_in: false }
    return { logged_in: true }
  }

  async check_auth(req: Request) {
    try {
      const token = req.user;
      //console.log("Token:", token);
      if (!token) throw new Error("No user token found");
      return token;
    } catch (err) {
      console.error("Check auth error:", err.message);
      return { error: err.message };
    }
  }




  // ======================================================
  //                     LOGOUT
  // ======================================================
  async logout(res: Response) {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: true,
        path: '/',
      });

      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: true,
        path: '/',
      });

      return res.status(200).json({ logout: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Logout failed' });
    }
  }

}
