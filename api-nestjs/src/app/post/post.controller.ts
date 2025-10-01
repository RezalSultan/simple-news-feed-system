import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth.decorator';
import { User } from 'src/type-model/user.model';
import { PostService } from './post.service';
import { AppResponse } from 'src/type-model/app.model';
import {
  FeedResponse,
  PostRequest,
  PostResponse,
} from 'src/type-model/post.model';

@Controller('/api')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/posts')
  async posts(
    @Auth() auth: User,
    @Body() req: PostRequest,
  ): Promise<AppResponse<PostResponse>> {
    const result = await this.postService.post(auth, req);

    return {
      statusCode: 201,
      status: 'Created',
      message: 'Create Posts successfully',
      data: result,
    };
  }

  @Get('/feed')
  async getFeed(
    @Auth() auth: User,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<AppResponse<FeedResponse>> {
    const pageNumber = parseInt(page ?? '1', 10);
    const limitNumber = parseInt(limit ?? '10', 10);
    const result = await this.postService.getFeed(
      auth,
      pageNumber,
      limitNumber,
    );

    return {
      statusCode: 200,
      status: 'Ok',
      message: 'Get feed successfully',
      data: result.data,
      meta: {
        pagination: result.pagination,
      },
    };
  }
}
