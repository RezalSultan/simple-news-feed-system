import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PgService } from 'src/common/db.service';
import { ValidationService } from 'src/common/validation.service';
import { UserRepository } from 'src/repository/user.repository';
import { Logger } from 'winston';
import { PostRepository } from 'src/repository/post.repository';
import { FollowRepository } from 'src/repository/follow.repository';
import { AllInfoUser, User } from 'src/type-model/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly db: PgService,
    private readonly userRepo: UserRepository,
    private readonly postRepo: PostRepository,
    private readonly followRepo: FollowRepository,
  ) {}

  async allInfoUser(auth: User): Promise<AllInfoUser> {
    this.logger.info(`Get All Info User`);

    const user = await this.userRepo.findById(this.db, auth.id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const userId = user.id;
    const posts = await this.postRepo.findPostsByUserId(this.db, userId);
    const followers = await this.followRepo.findFollowers(this.db, userId);
    const following = await this.followRepo.findFollowing(this.db, userId);

    return {
      id: userId,
      username: user.username,
      created_at: user.created_at,
      posts,
      followers,
      following,
    };
  }

  async followingUser(auth: User, followUserId: bigint): Promise<string> {
    this.logger.info(`Following User`);

    const user = await this.userRepo.findById(this.db, auth.id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const followUser = await this.followRepo.followUser(
      this.db,
      auth.id,
      followUserId,
    );

    const accountFollower = await this.userRepo.findById(
      this.db,
      followUser.follower_id,
    );
    if (!accountFollower) {
      throw new HttpException('User Follower not found', 404);
    }

    return accountFollower.username;
  }

  async unfollowingUser(auth: User, unfollowUserId: bigint): Promise<string> {
    this.logger.info(`Unfollow User`);

    const user = await this.userRepo.findById(this.db, auth.id);
    const unfollowUser = await this.userRepo.findById(this.db, auth.id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
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
