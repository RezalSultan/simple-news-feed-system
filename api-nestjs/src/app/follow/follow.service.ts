import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PgService } from 'src/common/db.service';
import { UserRepository } from 'src/repository/user.repository';
import { Logger } from 'winston';
import { FollowRepository } from 'src/repository/follow.repository';
import { AuthUser } from 'src/type-model/auth.model';

@Injectable()
export class FollowService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly db: PgService,
    private readonly userRepo: UserRepository,
    private readonly followRepo: FollowRepository,
  ) {}

  async followingUser(auth: AuthUser, followUserId: bigint): Promise<string> {
    this.logger.info(`Following User`);

    if (String(auth.id) === String(followUserId)) {
      throw new HttpException('You cannot follow yourself', 400);
    }

    const accountFollower = await this.userRepo.findById(this.db, followUserId);
    if (!accountFollower) {
      throw new HttpException('User follower not found', 404);
    }

    await this.followRepo.followUser(this.db, auth.id, followUserId);

    return accountFollower.username;
  }

  async unfollowingUser(
    auth: AuthUser,
    unfollowUserId: bigint,
  ): Promise<string> {
    this.logger.info(`Unfollow User`);

    if (String(auth.id) === String(unfollowUserId)) {
      throw new HttpException('You cannot unfollow yourself', 400);
    }

    const unfollowUser = await this.userRepo.findById(this.db, unfollowUserId);
    if (!unfollowUser) {
      throw new HttpException('User follower not found', 404);
    }

    const hasDeleted = await this.followRepo.unfollowUser(
      this.db,
      auth.id,
      unfollowUserId,
    );
    if (!hasDeleted) {
      throw new HttpException("You aren't following this user", 404);
    }

    return unfollowUser.username;
  }
}
