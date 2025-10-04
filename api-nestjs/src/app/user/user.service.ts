import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PgService } from 'src/common/db.service';
import { UserRepository } from 'src/repository/user.repository';
import { Logger } from 'winston';
import { PostRepository } from 'src/repository/post.repository';
import { FollowRepository } from 'src/repository/follow.repository';
import { AllInfoUser, User } from 'src/type-model/user.model';
import { AuthUser } from 'src/type-model/auth.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly db: PgService,
    private readonly userRepo: UserRepository,
    private readonly postRepo: PostRepository,
    private readonly followRepo: FollowRepository,
  ) {}

  async allInfoUser(auth: AuthUser): Promise<AllInfoUser> {
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

  async allInfoOtherUser(
    auth: AuthUser,
    username: string,
  ): Promise<AllInfoUser> {
    this.logger.info(`Get All Info Other User`);

    const user = await this.userRepo.findByUsername(this.db, username);
    const userId = user?.id;

    if (auth.id === userId) {
      throw new HttpException(
        'Access to your own info is not allowed here',
        403,
      );
    }

    if (!user) {
      throw new HttpException('Other user not found', 404);
    }
    const posts = await this.postRepo.findPostsByUserId(this.db, userId);
    const followers = await this.followRepo.findFollowers(this.db, userId);
    const following = await this.followRepo.findFollowing(this.db, userId);

    const isFollowing = await this.followRepo.isFollowingThisUser(
      this.db,
      auth.id,
      userId,
    );

    return {
      id: userId,
      username: user.username,
      created_at: user.created_at,
      is_following: isFollowing,
      posts,
      followers,
      following,
    };
  }

  async fiveSuggestedUsers(auth: AuthUser): Promise<User[]> {
    this.logger.info(`Get Five Not Following User`);

    const getSuggestUsers = await this.followRepo.getFiveNotFollowingUsers(
      this.db,
      auth.id,
    );

    return getSuggestUsers;
  }

  async allUsers(auth: AuthUser): Promise<User[]> {
    this.logger.info(`Get All Not Following User`);

    const getAllUsers = await this.followRepo.getAllNotFollowingUsers(
      this.db,
      auth.id,
    );

    return getAllUsers;
  }
}
