import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { PostModule } from './app/post/post.module';
import { FollowModule } from './app/follow/follow.module';

@Module({
  imports: [CommonModule, AuthModule, UserModule, PostModule, FollowModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
