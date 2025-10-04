import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PgService } from 'src/common/db.service';
import { CommonModule } from 'src/common/common.module';
import { JwtService } from '@nestjs/jwt';
import { FollowModule } from 'src/app/follow/follow.module';
import { FollowService } from 'src/app/follow/follow.service';

const mockFollowService = {
  followUser: jest.fn(),
  unfollowUser: jest.fn(),
};

const mockPgService = {
  query: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockImplementation(async (payload) => {
    if (payload.type === 'access') return 'access-token';
    if (payload.type === 'refresh') return 'refresh-token';
    return 'unknown-token';
  }),
  verifyAsync: jest.fn().mockImplementation(async (token) => {
    if (token === 'access-token') {
      return { id: 1, username: 'johndoe', type: 'access' };
    }
    if (token === 'refresh-token') {
      return { id: 1, username: 'johndoe', type: 'refresh' };
    }
    return null;
  }),
};

describe('FollowController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, FollowModule],
      providers: [{ provide: FollowService, useValue: mockFollowService }],
    })
      .overrideProvider(PgService)
      .useValue(mockPgService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/follow/:userId -> Follow User', () => {
    it('should be rejected if the user follows himself', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/follow/1')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('You cannot follow yourself');
    });

    it('should be rejected if the user follower not found', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [],
      });

      const response = await request(app.getHttpServer())
        .post('/api/follow/3')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('User follower not found');
    });

    it('should be rejected if you have already followed', async () => {
      mockPgService.query
        .mockResolvedValueOnce({
          rows: [
            { id: 3, username: 'user3', created_at: '2025-10-03 12:37:18.009' },
          ],
        })
        .mockRejectedValueOnce({ code: '23505' });

      const response = await request(app.getHttpServer())
        .post('/api/follow/3')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('You already follow this user');
    });

    it('should be able to follow user', async () => {
      mockPgService.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 3,
              username: 'user3',
              created_at: '2025-10-03 12:37:18.009',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              followee_id: 3,
              created_at: '2025-10-04 12:37:18.009',
            },
          ],
        });

      const response = await request(app.getHttpServer())
        .post('/api/follow/3')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('you are now following user3');
    });
  });

  describe('DELETE /api/follow/:userId -> Unfollow User', () => {
    it('should be rejected if the user unfollow himself', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/follow/1')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('You cannot unfollow yourself');
    });

    it('should be rejected if the user follower not found', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [],
      });

      const response = await request(app.getHttpServer())
        .delete('/api/follow/3')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('User follower not found');
    });

    it('should be rejected if you not followed user', async () => {
      mockPgService.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 3,
              username: 'user3',
              created_at: '2025-10-03 12:37:18.009',
            },
          ],
        })
        .mockResolvedValueOnce({
          rowCount: 0,
          rows: [],
        });

      const response = await request(app.getHttpServer())
        .delete('/api/follow/3')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe(
        "You aren't following this user",
      );
    });

    it('should be able to unfollow user', async () => {
      mockPgService.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 3,
              username: 'user3',
              created_at: '2025-10-03 12:37:18.009',
            },
          ],
        })
        .mockResolvedValueOnce({
          rowCount: 1,
          rows: [],
        });

      const response = await request(app.getHttpServer())
        .delete('/api/follow/3')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('you unfollowed user3');
    });
  });
});
