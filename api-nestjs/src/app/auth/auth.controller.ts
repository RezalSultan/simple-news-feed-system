import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppResponse } from 'src/type-model/app.model';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'src/type-model/auth.model';

@Controller('/api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() req: LoginRequest): Promise<AppResponse<LoginResponse>> {
    const result = await this.authService.loginAccount(req);

    return {
      statusCode: 201,
      status: 'Created',
      message: 'Login account successfully.',
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
      message: 'Register account successfully.',
      data: result,
    };
  }
}
