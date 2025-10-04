import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppResponse } from 'src/type-model/app.model';
import { UserService } from './user.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { AllInfoUser, User } from 'src/type-model/user.model';
import { AuthUser } from 'src/type-model/auth.model';

@Controller('/api')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/data-user')
  async getAllInfoUser(
    @Auth() auth: AuthUser,
  ): Promise<AppResponse<AllInfoUser>> {
    const result = await this.userService.allInfoUser(auth);

    return {
      statusCode: 200,
      status: 'Ok',
      message: 'Get all information user successfully',
      data: result,
    };
  }

  @Get('/other-user/:username')
  async getAllInfoOtherUser(
    @Auth() auth: AuthUser,
    @Param('username') username: string,
  ): Promise<AppResponse<AllInfoUser>> {
    const result = await this.userService.allInfoOtherUser(auth, username);

    return {
      statusCode: 200,
      status: 'Ok',
      message: 'Look all information this user successfully',
      data: result,
    };
  }

  @Get('/suggest-users')
  async getFiveSuggestedUsers(
    @Auth() auth: AuthUser,
  ): Promise<AppResponse<User[]>> {
    const result = await this.userService.fiveSuggestedUsers(auth);

    return {
      statusCode: 200,
      status: 'Ok',
      message: 'Get five suggested user successfully',
      data: result,
    };
  }

  @Get('/all-users')
  async getAllUsers(@Auth() auth: AuthUser): Promise<AppResponse<User[]>> {
    const result = await this.userService.allUsers(auth);

    return {
      statusCode: 200,
      status: 'Ok',
      message: 'Get all user successfully',
      data: result,
    };
  }
}
