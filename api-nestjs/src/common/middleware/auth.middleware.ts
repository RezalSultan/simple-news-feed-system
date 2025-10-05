import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PgService } from 'src/common/db.service';
import { UserRepository } from 'src/repository/user.repository';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly db: PgService,
    private readonly userRepo: UserRepository,
    private jwt: JwtService,
  ) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    try {
      const tokenAuth = req.headers['authorization'] as string;
      if (!tokenAuth) throw new HttpException('No token provided', 401);
      const token = tokenAuth?.split(' ')[1];
      if (!token) throw new HttpException('Invalid token format', 401);

      let payload: any;

      try {
        payload = await this.jwt.verifyAsync(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
      } catch (err) {
        payload = await this.jwt.verifyAsync(token, {
          secret: process.env.JWT_REFRESH_SECRET,
        });
      }
      const userId = payload.id;

      if (payload.type === 'refresh') {
        const user = await this.userRepo.findById(this.db, userId);
        if (user.refresh_token !== token) {
          throw new HttpException('Unauthorized', 401);
        }
      }

      if (payload) {
        req.user = {
          id: payload.id,
          username: payload.username,
        };
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Token expired', 401);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new HttpException('Invalid token', 401);
      }
      throw new HttpException('Unauthorized', 401);
    }
  }
}
