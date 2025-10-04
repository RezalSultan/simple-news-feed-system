import { HttpException, Injectable } from '@nestjs/common';
import { PgService } from 'src/common/db.service';
import { Follow, Followers } from 'src/type-model/follow.model';
import { User } from 'src/type-model/user.model';

@Injectable()
export class FollowRepository {
  async findFollowers(db: PgService, userId: bigint): Promise<Followers[]> {
    const sql = `SELECT a.follower_id, a.created_at, b.username FROM follows a LEFT JOIN users b ON a.follower_id = b.id  WHERE followee_id = $1`;
    const result = await db.query(sql, [userId]);
    return result.rows ?? [];
  }

  async findFollowing(db: PgService, userId: bigint): Promise<Followers[]> {
    const sql = `SELECT a.followee_id, a.created_at, b.username FROM follows a LEFT JOIN users b ON a.followee_id = b.id  WHERE follower_id = $1`;
    const result = await db.query(sql, [userId]);
    return result.rows ?? [];
  }

  async isFollowingThisUser(
    db: PgService,
    userId: bigint,
    otherUserId: bigint,
  ): Promise<boolean> {
    const sql = `SELECT EXISTS (SELECT 1 FROM follows WHERE follower_id = $1 AND followee_id = $2) AS is_following`;
    const result = await db.query(sql, [userId, otherUserId]);
    return result.rows[0].is_following;
  }

  async getFiveNotFollowingUsers(
    db: PgService,
    userId: bigint,
  ): Promise<User[]> {
    const sql = `
    SELECT id, username FROM users WHERE id != $1
      AND id NOT IN (SELECT followee_id FROM follows WHERE follower_id = $1)
    ORDER BY created_at DESC LIMIT 5
  `;
    const result = await db.query(sql, [userId]);
    return result.rows ?? [];
  }

  async getAllNotFollowingUsers(
    db: PgService,
    userId: bigint,
  ): Promise<User[]> {
    const sql = `
    SELECT id, username FROM users WHERE id != $1
      AND id NOT IN (SELECT followee_id FROM follows WHERE follower_id = $1)
    ORDER BY created_at DESC
  `;
    const result = await db.query(sql, [userId]);
    return result.rows ?? [];
  }

  async followUser(
    db: PgService,
    userId: bigint,
    followUserId: bigint,
  ): Promise<Follow> {
    const sql = `INSERT INTO follows (followee_id, follower_id) VALUES ($1, $2) RETURNING followee_id, created_at`;
    try {
      const result = await db.query(sql, [followUserId, userId]);
      return result.rows[0];
    } catch (err: any) {
      if (err.code === '23505') {
        throw new HttpException('You already follow this user', 409);
      }
      throw new HttpException(err.message, 500);
    }
  }

  async unfollowUser(
    db: PgService,
    userId: bigint,
    followUserId: bigint,
  ): Promise<boolean> {
    const sql = `DELETE FROM follows WHERE followee_id = $1 AND follower_id = $2`;
    const result = await db.query(sql, [followUserId, userId]);

    if (result.rowCount === 0) {
      return false;
    }

    return true;
  }
}
