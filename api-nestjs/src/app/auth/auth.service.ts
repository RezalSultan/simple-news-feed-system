import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PgService } from 'src/common/db.service';
import { ValidationService } from 'src/common/validation.service';
import { UserRepository } from 'src/repository/user.repository';
import {
  AccessTokenResponse,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'src/type-model/auth.model';
import { Logger } from 'winston';
import { AuthValidation } from './auth.validation';
import { comparePassword, hashPassword } from 'src/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly db: PgService,
    private readonly userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async loginAccount(req: LoginRequest): Promise<LoginResponse> {
    this.logger.info(`Login user`);

    const loginReq = this.validationService.validate(AuthValidation.LOGIN, req);

    const user = await this.userRepo.findByUsername(this.db, loginReq.username);
    if (!user) {
      throw new HttpException('Username or password invalid', 404);
    }

    const isPasswordValid = await comparePassword(
      loginReq.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new HttpException('Username or password invalid', 401);
    }

    const payload = {
      id: user.id,
      username: user.username,
    };
    const refreshToken = await this.jwtService.signAsync({
      ...payload,
      type: 'refresh',
    });
    const accessToken = await this.jwtService.signAsync(
      {
        ...payload,
        type: 'access',
      },
      {
        expiresIn: '15m',
      },
    );

    const loginUser = await this.userRepo.updateTokenUser(
      this.db,
      refreshToken,
      user.id,
    );

    return {
      token: accessToken,
      refresh_token: loginUser.refresh_token,
    };
  }

  async registerAccount(req: RegisterRequest): Promise<RegisterResponse> {
    this.logger.info(`User Register`);

    const registerReq = this.validationService.validate(
      AuthValidation.REGISTER,
      req,
    );

    const user = await this.userRepo.findByUsername(
      this.db,
      registerReq.username,
    );
    if (user) {
      throw new HttpException('Username already exists', 409);
    }

    if (registerReq.password !== registerReq.confirm_password) {
      throw new HttpException(
        'Password and confirm password do not match',
        400,
      );
    }

    const hashedPass = await hashPassword(registerReq.password);

    const createdUser = await this.userRepo.createUser(
      this.db,
      registerReq.username,
      hashedPass,
    );

    return {
      id: createdUser.id,
      username: createdUser.username,
    };
  }

  async generateAccessToken(auth: AuthUser): Promise<AccessTokenResponse> {
    this.logger.info(`Generate New Access Token`);

    const payload = {
      id: auth.id,
      username: auth.username,
      type: 'access',
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    return {
      token: accessToken,
    };
  }

  async logoutAccount(auth: AuthUser): Promise<void> {
    this.logger.info(`User Logout`);

    await this.userRepo.updateTokenUser(this.db, null, auth.id);
  }
}
