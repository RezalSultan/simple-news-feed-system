export type Post = {
  id: bigint;
  user_id?: bigint;
  content: string;
  created_at?: string;
};

export type PostWithUsername = {
  id: bigint;
  user_id?: bigint;
  username: string;
  content: string;
  created_at?: string;
};

export type PostRequest = {
  content: string;
};

export type PostResponse = {
  id: bigint;
  user_id: bigint;
  content: string;
  created_at: string;
};

export type FeedResponse = {
  posts: PostWithUsername[];
};
