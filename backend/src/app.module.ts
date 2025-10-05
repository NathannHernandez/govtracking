import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BusModule } from './modules/bus/bus.module';
import { SwdiModule } from './modules/swdi/swdi.module';
import { PcnModule } from './modules/pcn/pcn.module';
import { EncodedModule } from './modules/encoded/encoded.module';
import { JwtAuthGuard } from './guard/jwt-auth-guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TestController } from './app.controller';
import { SettingModule } from './modules/setting/setting.module';
import { JwtOrRefreshGuard } from './guard/jwt-refresh-guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().uri().required(),
        ALLOWED_ORIGINS: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        Version: Joi.string().default('1.0.0'),
      }),
      validationOptions: { allowUnknown: true, abortEarly: true },
    }),
    JwtModule.register({
      global: true, // optional: makes JwtService available everywhere
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '5min' },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // mili
        limit: 100,  
      }
    ]),
    AuthModule,
    PrismaModule,
    BusModule,
    SwdiModule,
    PcnModule,
    EncodedModule,
    UserModule,
    SettingModule,
  ],
  controllers: [TestController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass : JwtOrRefreshGuard
    }
  ],
})
export class AppModule {}