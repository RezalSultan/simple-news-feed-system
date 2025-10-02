import { PaginationMeta } from './app.model';

export class Post {
  id: bigint;
  user_id?: bigint;
  content: string;
  created_at?: string;
}

export class PostWithUsername {
  id: bigint;
  user_id?: bigint;
  username: string;
  content: string;
  created_at?: string;
}

export class PostRequest {
  content: string;
}

export class PostResponse {
  id: bigint;
  user_id: bigint;
  content: string;
  created_at: string;
}

export class FeedResponse {
  posts: PostWithUsername[];
}

export class FeedWithPagination {
  data: {
    posts: PostWithUsername[];
  };
  pagination: PaginationMeta;
}
