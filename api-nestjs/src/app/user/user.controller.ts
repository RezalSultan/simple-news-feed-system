import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppResponse } from 'src/type-model/app.model';
import { UserService } from './user.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AllInfoUser, User } from 'src/type-model/user.model';
import { ParseBigIntPipe } from 'src/common/pipes/parse-bigint.pipe';

@Controller('/api')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/data-user')
  async getAllInfoUser(@Auth() auth: User): Promise<AppResponse<AllInfoUser>> {
    const result = await this.userService.allInfoUser(auth);

    return {
      statusCode: 200,
      status: 'Ok',
      message: 'Get all information user successfully',
      data: result,
    };
  }

  @Post('/follow/:userId')
  async followUser(
    @Auth() auth: User,
    @Param('userId', ParseBigIntPipe) followUserId: bigint,
  ): Promise<AppResponse<AllInfoUser>> {
    const result = await this.userService.followingUser(auth, followUserId);

    return {
      statusCode: 201,
      status: 'Created',
      message: `you are now following ${result}`,
    };
  }

  @Delete('/follow/:userId')
  async unfollowUser(
    @Auth() auth: User,
    @Param('userId', ParseBigIntPipe) unfollowUserId: bigint,
  ): Promise<AppResponse<AllInfoUser>> {
    const result = await this.userService.unfollowingUser(auth, unfollowUserId);

    return {
      statusCode: 200,
      status: 'Ok',
      message: `you unfollowed ${result}`,
    };
  }
}
