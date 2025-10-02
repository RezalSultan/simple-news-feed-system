import { Injectable } from '@nestjs/common';
import { PgService } from 'src/common/db.service';
import { User } from 'src/type-model/user.model';

@Injectable()
export class UserRepository {
  async findByUsername(db: PgService, username: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE username = $1 LIMIT 1`;
    const result = await db.query(sql, [username]);
    return result.rows[0] ?? null;
  }

  async findById(db: PgService, id: bigint): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE id = $1 LIMIT 1`;
    const result = await db.query(sql, [id]);
    return result.rows[0] ?? null;
  }

  async createUser(
    db: PgService,
    username: string,
    password: string,
    refresh_token?: string,
  ): Promise<User> {
    const sql = `
      INSERT INTO users (username, password_hash, refresh_token)
      VALUES ($1, $2, $3)
      RETURNING id, username, refresh_token
    `;
    const result = await db.query(sql, [
      username,
      password,
      refresh_token ?? null,
    ]);
    return result.rows[0];
  }

  async updateTokenUser(
    db: PgService,
    refresh_token: string | null,
    id: bigint,
  ): Promise<User> {
    const sql = `
      UPDATE users
      SET refresh_token = $1
      WHERE id = $2
      RETURNING id, username, refresh_token
    `;
    const result = await db.query(sql, [refresh_token ?? null, id]);
    return result.rows[0];
  }
}
