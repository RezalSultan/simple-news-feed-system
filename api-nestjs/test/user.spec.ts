import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PgService } from 'src/common/db.service';
import { CommonModule } from 'src/common/common.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/app/user/user.service';
import { UserModule } from 'src/app/user/user.module';

const mockUserService = {
  getAllInfoUser: jest.fn(),
  getAllInfoOtherUser: jest.fn(),
  getFiveSuggestedUsers: jest.fn(),
  getAllUsers: jest.fn(),
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

describe('UserController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, UserModule],
      providers: [{ provide: UserService, useValue: mockUserService }],
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

  describe('GET /api/data-user -> Get Profile', () => {
    it('should be get profile user', async () => {
      mockPgService.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              username: 'johndoe',
              created_at: '2025-10-01 12:37:18.009',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              content: 'posting dari johndoe 1',
              created_at: '2025-10-04 23:30:15.591',
            },
            {
              id: 2,
              content: 'posting dari johndoe 2',
              created_at: '2025-10-04 23:30:47.345',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 2,
              username: 'user2',
              created_at: '2025-10-01 13:19:59.614',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 3,
              username: 'user3',
              created_at: '2025-10-02 14:20:59.614',
            },
          ],
        });

      const response = await request(app.getHttpServer())
        .get('/api/data-user')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        id: 1,
        username: 'johndoe',
        created_at: '2025-10-01 12:37:18.009',
        posts: [
          {
            id: 1,
            content: 'posting dari johndoe 1',
            created_at: '2025-10-04 23:30:15.591',
          },
          {
            id: 2,
            content: 'posting dari johndoe 2',
            created_at: '2025-10-04 23:30:47.345',
          },
        ],
        followers: [
          {
            id: 2,
            username: 'user2',
            created_at: '2025-10-01 13:19:59.614',
          },
        ],
        following: [
          {
            id: 3,
            username: 'user3',
            created_at: '2025-10-02 14:20:59.614',
          },
        ],
      });
      expect(response.body.message).toBe(
        'Get all information user successfully',
      );
    });

    it('should be rejected if user not found', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [],
      });

      const response = await request(app.getHttpServer())
        .get('/api/data-user')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('User not found');
    });
  });

  describe('GET /api/other-user/:username -> Look Profile Other User', () => {
    it('should be rejected if user tries to access their own info', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [
          {
            id: 1,
            username: 'johndoe',
            created_at: '2025-10-01 12:37:18.009',
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/other-user/user2')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe(
        'Access to your own info is not allowed here',
      );
    });

    it('should be rejected if other user not found', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [],
      });

      const response = await request(app.getHttpServer())
        .get('/api/other-user/user2')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('Other user not found');
    });

    it('should be get profile other user', async () => {
      mockPgService.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 2,
              username: 'user2',
              created_at: '2025-10-01 13:19:59.614',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 3,
              content: 'posting dari user2 1',
              created_at: '2025-10-04 23:30:15.591',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              username: 'johndoe',
              created_at: '2025-10-01 12:37:18.009',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              is_following: true,
            },
          ],
        });

      const response = await request(app.getHttpServer())
        .get('/api/other-user/user2')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        id: 2,
        username: 'user2',
        created_at: '2025-10-01 13:19:59.614',
        is_following: true,
        posts: [
          {
            id: 3,
            content: 'posting dari user2 1',
            created_at: '2025-10-04 23:30:15.591',
          },
        ],
        followers: [],
        following: [
          {
            id: 1,
            username: 'johndoe',
            created_at: '2025-10-01 12:37:18.009',
          },
        ],
      });
      expect(response.body.message).toBe(
        'Look all information this user successfully',
      );
    });
  });

  describe('GET /api/suggest-users -> Get 5 Suggest Users', () => {
    it('should get five non-followed users', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [
          {
            id: 2,
            username: 'user2',
          },
          {
            id: 4,
            username: 'user4',
          },
          {
            id: 5,
            username: 'user5',
          },
          {
            id: 6,
            username: 'user6',
          },
          {
            id: 7,
            username: 'user7',
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/suggest-users')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([
        {
          id: 2,
          username: 'user2',
        },
        {
          id: 4,
          username: 'user4',
        },
        {
          id: 5,
          username: 'user5',
        },
        {
          id: 6,
          username: 'user6',
        },
        {
          id: 7,
          username: 'user7',
        },
      ]);
      expect(response.body.message).toBe(
        'Get five suggested user successfully',
      );
    });

    it('should return empty array if no users are available', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [],
      });

      const response = await request(app.getHttpServer())
        .get('/api/suggest-users')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/all-users -> Get All Users Not Followed', () => {
    it('should get all non-followed users', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [
          {
            id: 2,
            username: 'user2',
          },
          {
            id: 4,
            username: 'user4',
          },
          {
            id: 5,
            username: 'user5',
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/all-users')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([
        {
          id: 2,
          username: 'user2',
        },
        {
          id: 4,
          username: 'user4',
        },
        {
          id: 5,
          username: 'user5',
        },
      ]);
      expect(response.body.message).toBe('Get all user successfully');
    });

    it('should return empty array if no users are available', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [],
      });

      const response = await request(app.getHttpServer())
        .get('/api/suggest-users')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });
});
