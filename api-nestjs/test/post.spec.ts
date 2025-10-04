import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PgService } from 'src/common/db.service';
import { CommonModule } from 'src/common/common.module';
import { JwtService } from '@nestjs/jwt';
import { PostModule } from 'src/app/post/post.module';
import { PostService } from 'src/app/post/post.service';

const mockPostService = {
  posts: jest.fn(),
  getFeed: jest.fn(),
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

describe('PostController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, PostModule],
      providers: [{ provide: PostService, useValue: mockPostService }],
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

  describe('POST /api/posts -> Posts', () => {
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', 'Bearer access-token')
        .send({ content: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('Validation Error');
    });

    it('should be rejected if input exceeds 200 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', 'Bearer access-token')
        .send({
          content:
            'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with',
        });

      expect(response.status).toBe(422);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe(
        'Maximum length is 200 characters',
      );
    });

    it('should be able to post', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [
          {
            id: 1,
            user_id: 1,
            content:
              'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.',
            created_at: '2025-10-03 12:37:18.009',
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', 'Bearer access-token')
        .send({
          content:
            'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual({
        id: 1,
        user_id: 1,
        content:
          'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.',
        created_at: '2025-10-03 12:37:18.009',
      });
      expect(response.body.message).toBe('Create posts successfully');
    });
  });

  describe('GET /api/feed -> Get Feed', () => {
    it('should be able to get all feed', async () => {
      mockPgService.query
        .mockResolvedValueOnce({
          rows: [
            {
              total: 3,
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              user_id: 1,
              content: 'posting dari johndoe 1',
              created_at: '2025-10-03 12:37:18.009',
              username: 'johndoe',
            },
            {
              id: 2,
              user_id: 1,
              content: 'posting dari johndoe 2',
              created_at: '2025-10-03 13:37:18.009',
              username: 'johndoe',
            },
            {
              id: 3,
              user_id: 1,
              content: 'posting dari johndoe 3',
              created_at: '2025-10-03 14:37:18.009',
              username: 'johndoe',
            },
          ],
        });

      const response = await request(app.getHttpServer())
        .get('/api/feed?page=1&limit=10')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        posts: [
          {
            id: 1,
            user_id: 1,
            content: 'posting dari johndoe 1',
            created_at: '2025-10-03 12:37:18.009',
            username: 'johndoe',
          },
          {
            id: 2,
            user_id: 1,
            content: 'posting dari johndoe 2',
            created_at: '2025-10-03 13:37:18.009',
            username: 'johndoe',
          },
          {
            id: 3,
            user_id: 1,
            content: 'posting dari johndoe 3',
            created_at: '2025-10-03 14:37:18.009',
            username: 'johndoe',
          },
        ],
      });
      expect(response.body.meta).toEqual({
        pagination: {
          page: 1,
          limit: 10,
          totalItems: 3,
          totalPages: 1,
        },
      });
      expect(response.body.message).toBe('Get feed successfully');
    });

    it('should return empty array if there are no posts or no followed users', async () => {
      mockPgService.query
        .mockResolvedValueOnce({
          rows: [
            {
              total: 0,
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [],
        });

      const response = await request(app.getHttpServer())
        .get('/api/feed?page=1&limit=10')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        posts: [],
      });
      expect(response.body.meta).toEqual({
        pagination: {
          page: 1,
          limit: 10,
          totalItems: 0,
          totalPages: 1,
        },
      });
    });
  });
});
