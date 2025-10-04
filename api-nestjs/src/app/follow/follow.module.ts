import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';

@Module({
  imports: [],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [],
})
export class FollowModule {}
