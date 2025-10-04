// app.module.ts
import { Module } from '@nestjs/common'
import { RedisModule } from '@nestjs-modules/ioredis'
import { Global } from '@nestjs/common'



@Global()
@Module({
    imports: [
        RedisModule.forRoot({
            type: 'single',
            options: {
                host: 'localhost',
                port: 6379,
            },
        }),
    ],
})

export class AppModule { }
