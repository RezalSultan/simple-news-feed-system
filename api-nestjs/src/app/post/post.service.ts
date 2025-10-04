import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PgService } from 'src/common/db.service';
import { ValidationService } from 'src/common/validation.service';
import { PostRepository } from 'src/repository/post.repository';
import {
  FeedResponse,
  FeedWithPagination,
  PostRequest,
  PostResponse,
} from 'src/type-model/post.model';
import { User } from 'src/type-model/user.model';
import { Logger } from 'winston';
import { PostValidation } from './post.validation';
import { AuthUser } from 'src/type-model/auth.model';

@Injectable()
export class PostService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly db: PgService,
    private readonly postRepo: PostRepository,
  ) {}

  async post(auth: AuthUser, req: PostRequest): Promise<PostResponse> {
    this.logger.info(`Add Post : ${req}`);

    const postReq = this.validationService.validate(
      PostValidation.ADD_POST,
      req,
    );

    if (postReq.content.length > 200) {
      throw new HttpException('Maximum length is 200 characters', 422);
    }

    const postAdded = await this.postRepo.addPost(
      this.db,
      auth.id,
      postReq.content,
    );

    return postAdded;
  }

  async getFeed(
    auth: AuthUser,
    page: number,
    limit: number,
  ): Promise<FeedWithPagination> {
    this.logger.info(`Get Feed With Page ${page} and Limit ${limit}`);

    const offset = (page - 1) * limit;

    const totalFeed = await this.postRepo.totalFeed(this.db, auth.id);
    const totalPages = Math.max(1, Math.ceil(totalFeed / limit));

    const feedData = await this.postRepo.getFeed(
      this.db,
      auth.id,
      limit,
      offset,
    );

    return {
      data: {
        posts: feedData,
      },
      pagination: {
        page: page,
        limit: limit,
        totalItems: totalFeed,
        totalPages: totalPages,
      },
    };
  }
}
