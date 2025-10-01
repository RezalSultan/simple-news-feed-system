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
    const tokenAuth = req.headers['authorization'] as string;
    if (!tokenAuth) throw new HttpException('No token provided', 401);
    const token = tokenAuth?.split(' ')[1];
    if (!token) throw new HttpException('Invalid token format', 401);

    const payload = await this.jwt.verifyAsync(token);
    const userId = payload.id;

    const user = await this.userRepo.findById(this.db, userId);

    if (user) {
      req.user = user;
    }

    next();
  }
}
