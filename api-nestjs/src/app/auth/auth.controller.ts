import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppResponse } from 'src/type-model/app.model';
import {
  AccessTokenResponse,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'src/type-model/auth.model';
import { Auth } from 'src/common/decorator/auth.decorator';

@Controller('/api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Get('/generate-access-token')
  async getAccessToken(
    @Auth() auth: AuthUser,
  ): Promise<AppResponse<AccessTokenResponse>> {
    const result = await this.authService.generateAccessToken(auth);

    return {
      statusCode: 200,
      status: 'Ok',
      message: 'Generate access token successfully.',
      data: result,
    };
  }

  @Get('/verify-token')
  async verifyToken(@Auth() auth: AuthUser): Promise<AppResponse<void>> {
    if (!auth) {
      throw new HttpException('Unauthorized', 401);
    }

    return {
      statusCode: 200,
      status: 'Ok',
      message: 'Token is active.',
    };
  }

  @Delete('/logout')
  async logout(@Auth() auth: AuthUser): Promise<AppResponse<void>> {
    await this.authService.logoutAccount(auth);

    return {
      statusCode: 200,
      status: 'OK',
      message: 'Logout successful! You have been logged out.',
    };
  }
}
