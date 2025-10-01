import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PgService } from './db.service';
import { ValidationService } from './validation.service';
import { ErrorFilter } from './error.filter';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { UserRepository } from 'src/repository/user.repository';
import { PostRepository } from 'src/repository/post.repository';
import { FollowRepository } from 'src/repository/follow.repository';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          process.env.JWT_ACCESS_SECRET ||
          configService.get<string>('JWT_ACCESS_SECRET'),
      }),
    }),
  ],
  providers: [
    PgService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    UserRepository,
    PostRepository,
    FollowRepository,
  ],
  exports: [
    PgService,
    ValidationService,
    JwtModule,
    UserRepository,
    PostRepository,
    FollowRepository,
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/api/login', method: RequestMethod.POST },
        { path: '/api/register', method: RequestMethod.POST },
      )
      .forRoutes('/api/*');
  }
}
