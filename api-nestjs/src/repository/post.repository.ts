import { Injectable } from '@nestjs/common';
import { PgService } from 'src/common/db.service';
import { Post, PostWithUsername } from 'src/type-model/post.model';

@Injectable()
export class PostRepository {
  async findById(db: PgService, id: bigint): Promise<Post | null> {
    const sql = `SELECT * FROM posts WHERE id = $1 LIMIT 1`;
    const result = await db.query(sql, [id]);
    return result.rows[0] ?? null;
  }

  async findPostsByUserId(db: PgService, userId: bigint): Promise<Post[]> {
    const sql = `SELECT id, content, created_at FROM posts WHERE user_id = $1`;
    const result = await db.query(sql, [userId]);
    return result.rows ?? [];
  }

  async addPost(db: PgService, userId: bigint, content: string): Promise<Post> {
    const sql = `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *`;
    const result = await db.query(sql, [userId, content]);
    return result.rows[0];
  }

  async totalFeed(db: PgService, userId: bigint): Promise<number> {
    const sql = ` SELECT COUNT(*) AS total FROM posts a 
      WHERE a.user_id = $1
      OR a.user_id IN (SELECT followee_id FROM follows WHERE follower_id = $1)
    `;
    const result = await db.query(sql, [userId]);
    const total = parseInt(result.rows[0]?.total ?? '0');
    return total;
  }

  async getFeed(
    db: PgService,
    userId: bigint,
    limit: number,
    offset: number,
  ): Promise<PostWithUsername[]> {
    const sql = `SELECT a.id, a.user_id, a.content, a.created_at, c.username 
      FROM posts a 
      LEFT JOIN users c ON c.id = a.user_id
      WHERE a.user_id = $1
        OR a.user_id IN (SELECT followee_id FROM follows WHERE follower_id = $1)
      ORDER BY a.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await db.query(sql, [userId, limit, offset]);
    return result.rows ?? [];
  }
}
