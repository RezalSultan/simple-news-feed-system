import {
  Inject,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  HttpException,
} from '@nestjs/common';
import { Client } from 'pg';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class PgService extends Client implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'simple_news_feed_system',
    });
  }

  async onModuleInit() {
    try {
      await this.connect();
      this.logger.info('Connected to PostgreSQL');

      const origQuery = this.query.bind(this);
      this.query = async (...args: any[]) => {
        try {
          const res = await origQuery(...args);
          return res;
        } catch (err) {
          this.logger.error(`Query Error: ${err.message}`);
          throw new HttpException(
            'Something went wrong on our side. Please try again later.',
            500,
          );
        }
      };
    } catch (err) {
      this.logger.error('Failed to connect PostgreSQL: ' + err.message);
      throw new HttpException(
        'Something went wrong on our side. Please try again later.',
        500,
      );
    }
  }

  async onModuleDestroy() {
    await this.end();
    this.logger.info('PostgreSQL connection closed');
  }

  async beginTransaction() {
    await this.query('BEGIN');
  }

  async commitTransaction() {
    await this.query('COMMIT');
  }
  async rollbackTransaction() {
    await this.query('ROLLBACK');
  }

  async transaction<T>(fn: (client: PgService) => Promise<T>): Promise<T> {
    await this.beginTransaction();
    try {
      const result = await fn(this);
      await this.commitTransaction();
      return result;
    } catch (err) {
      await this.rollbackTransaction();
      throw err;
    }
  }
}
