import { HttpException, Injectable } from '@nestjs/common';
import { PgService } from 'src/common/db.service';
import { Follow, Followers } from 'src/type-model/follow.model';

@Injectable()
export class FollowRepository {
  async findFollowers(db: PgService, userId: bigint): Promise<Followers[]> {
    const sql = `SELECT a.follower_id, a.created_at, b.username FROM follows a LEFT JOIN users b ON a.followee_id = b.id  WHERE followee_id = $1`;
    const result = await db.query(sql, [userId]);
    return result.rows ?? [];
  }

  async findFollowing(db: PgService, userId: bigint): Promise<Followers[]> {
    const sql = `SELECT a.followee_id, a.created_at, b.username FROM follows a LEFT JOIN users b ON a.follower_id = b.id  WHERE follower_id = $1`;
    const result = await db.query(sql, [userId]);
    return result.rows ?? [];
  }

  async followUser(
    db: PgService,
    userId: bigint,
    followUserId: bigint,
  ): Promise<Follow> {
    const sql = `INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2) RETURNING follower_id, created_at`;
    try {
      const result = await db.query(sql, [followUserId, userId]);
      return result.rows[0];
    } catch (err: any) {
      if (err.code === '23505') {
        throw new HttpException('You already follow this user', 400);
      }
      throw new HttpException(err.message, 500);
    }
  }

  async unfollowUser(
    db: PgService,
    userId: bigint,
    followUserId: bigint,
  ): Promise<boolean> {
    const sql = `DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2`;
    const result = await db.query(sql, [followUserId, userId]);

    if (result.rowCount === 0) {
      return false;
    }

    return true;
  }
}
