import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppResponse } from 'src/type-model/app.model';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'src/type-model/auth.model';
import { User } from 'src/type-model/user.model';
import { Auth } from 'src/common/decorator/auth.decorator';

@Controller('/api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() req: LoginRequest): Promise<AppResponse<LoginResponse>> {
    const result = await this.authService.loginAccount(req);

    return {
      statusCode: 201,
      status: 'Created',
      message: 'Login successful. Great to see you again!',
      data: result,
    };
  }

  @Post('/register')
  async register(
    @Body() req: RegisterRequest,
  ): Promise<AppResponse<RegisterResponse>> {
    const result = await this.authService.registerAccount(req);

    return {
      statusCode: 201,
      status: 'Created',
      message: 'Registration successful! You can now log in.',
      data: result,
    };
  }

  @Delete('/logout')
  async logout(@Auth() auth: User): Promise<AppResponse<void>> {
    await this.authService.logoutAccount(auth);

    return {
      statusCode: 200,
      status: 'OK',
      message: 'Logout successful! You have been logged out.',
    };
  }
}
