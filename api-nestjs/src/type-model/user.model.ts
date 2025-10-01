import { Followers, Following } from './follow.model';
import { Post } from './post.model';

export class User {
  id: bigint;
  username: string;
  refresh_token?: string;
  password_hash?: string;
  created_at?: string;
}

export class AllInfoUser {
  id: bigint;
  username: string;
  posts: Post[];
  followers: Followers[];
  following: Following[];
  created_at?: string;
}
