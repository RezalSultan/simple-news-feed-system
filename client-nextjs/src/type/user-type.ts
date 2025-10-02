import { Post } from "./post-type";

export type User = {
  id: bigint;
  username: string;
  created_at?: string;
};

export type AllInfoUser = {
  id: bigint;
  username: string;
  created_at?: string;
  is_following?: boolean;
  posts: Post[];
  followers: Followers[];
  following: Following[];
};

export type Follow = {
  follower_id?: bigint;
  followee_id?: bigint;
  created_at?: string;
};

export type Followers = Follow & {
  username: string;
};

export type Following = Follow & {
  username: string;
};
