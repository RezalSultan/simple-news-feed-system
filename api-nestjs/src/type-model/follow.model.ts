export class Follow {
  follower_id?: bigint;
  followee_id?: bigint;
  created_at?: string;
}

export class Followers extends Follow {
  username: string;
}

export class Following extends Follow {
  username: string;
}
