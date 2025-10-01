import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppResponse } from 'src/type-model/app.model';
import { UserService } from './user.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AllInfoUser, User } from 'src/type-model/user.model';

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

  @Get('/other-user/:userId')
  async getAllInfoOtherUser(
    @Auth() auth: User,
    @Param('userId') userId: bigint,
  ): Promise<AppResponse<AllInfoUser>> {
    const result = await this.userService.allInfoOtherUser(auth, userId);

    return {
      statusCode: 200,
      status: 'Ok',
      message: 'Look all information this user successfully',
      data: result,
    };
  }

  @Get('/suggest-users')
  async getFiveSuggestedUsers(
    @Auth() auth: User,
  ): Promise<AppResponse<User[]>> {
    const result = await this.userService.fiveSuggestedUsers(auth);

    return {
      statusCode: 200,
      status: 'Ok',
      message: 'Get five suggested user successfully',
      data: result,
    };
  }

  @Post('/follow/:userId')
  async followUser(
    @Auth() auth: User,
    @Param('userId') followUserId: bigint,
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
    @Param('userId') unfollowUserId: bigint,
  ): Promise<AppResponse<AllInfoUser>> {
    const result = await this.userService.unfollowingUser(auth, unfollowUserId);

    return {
      statusCode: 200,
      status: 'Ok',
      message: `you unfollowed ${result}`,
    };
  }
}
