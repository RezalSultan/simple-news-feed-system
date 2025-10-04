import { Controller, Delete, Param, Post } from '@nestjs/common';
import { AppResponse } from 'src/type-model/app.model';
import { FollowService } from './follow.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AuthUser } from 'src/type-model/auth.model';

@Controller('/api/follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post('/:userId')
  async followUser(
    @Auth() auth: AuthUser,
    @Param('userId') followUserId: bigint,
  ): Promise<AppResponse<void>> {
    const result = await this.followService.followingUser(auth, followUserId);

    return {
      statusCode: 201,
      status: 'Created',
      message: `you are now following ${result}`,
    };
  }

  @Delete('/:userId')
  async unfollowUser(
    @Auth() auth: AuthUser,
    @Param('userId') unfollowUserId: bigint,
  ): Promise<AppResponse<void>> {
    const result = await this.followService.unfollowingUser(
      auth,
      unfollowUserId,
    );

    return {
      statusCode: 200,
      status: 'Ok',
      message: `you unfollowed ${result}`,
    };
  }
}
