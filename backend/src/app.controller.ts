import { Controller, Get, Post } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('test')
export class TestController {
  
  // This endpoint should be rate limited by global settings (3 requests per 10 seconds)
  @Get('limited')
  limitedEndpoint() {
    return { 
      message: 'This endpoint is rate limited', 
      timestamp: new Date().toISOString() 
    };
  }

  // This endpoint skips rate limiting entirely
  @SkipThrottle()
  @Get('unlimited')
  unlimitedEndpoint() {
    return { 
      message: 'This endpoint has no rate limiting', 
      timestamp: new Date().toISOString() 
    };
  }

  // This endpoint has custom, very strict rate limiting
  //@Throttle({ default: { limit: 1, ttl: 10000 } }) // 1 request per 10 seconds
  @Post('strict')
  strictEndpoint() {
    return { 
      message: 'Very strict rate limiting - 1 per 10 seconds', 
      timestamp: new Date().toISOString() 
    };
  }

  // Health check endpoint (no auth, no rate limiting)
  @SkipThrottle()
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}