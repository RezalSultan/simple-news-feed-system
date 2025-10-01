import { Injectable } from '@nestjs/common';
import { PgService } from 'src/common/db.service';
import { Post } from 'src/type-model/post.model';

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
}
