import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from 'src/app/auth/auth.service';
import { PgService } from 'src/common/db.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/app/auth/auth.module';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const mockAuthService = {
  loginAccount: jest.fn(),
  registerAccount: jest.fn(),
  generateAccessToken: jest.fn(),
  logoutAccount: jest.fn(),
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
    if (token === 'access-token-expired') {
      const error: any = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      throw error;
    }
    if (token === 'access-token') {
      return { id: 1, username: 'johndoe', type: 'access' };
    }
    if (token === 'refresh-token') {
      return { id: 1, username: 'johndoe', type: 'refresh' };
    }
    return null;
  }),
};

describe('AuthController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, AuthModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
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

  describe('POST /api/login -> Login', () => {
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/login')
        .send({ username: '', password: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('Validation Error');
    });

    it('should be rejected if username not found', async () => {
      mockPgService.query.mockResolvedValue({ rows: [] });

      mockAuthService.loginAccount.mockImplementation(async (req) => {
        throw new HttpException('Username or password invalid', 404);
      });

      const response = await request(app.getHttpServer())
        .post('/api/login')
        .send({ username: 'unknown', password: 'johndoe' });

      expect(response.status).toBe(404);
      expect(response.body.errors.message).toBe('Username or password invalid');
    });

    it('should be rejected if password is invalid', async () => {
      const passwordHash = await bcrypt.hash('johndoe', 10);
      mockPgService.query.mockResolvedValue({
        rows: [
          {
            id: 1,
            username: 'johndoe',
            password_hash: passwordHash,
            refresh_token: null,
          },
        ],
      });

      mockAuthService.loginAccount.mockImplementation(async (req) => {
        const isPasswordValid = await bcrypt.compare(
          req.password,
          passwordHash,
        );
        if (!isPasswordValid) {
          throw new HttpException('Username or password invalid', 401);
        }
        return { token: 'access-token', refresh_token: 'refresh-token' };
      });

      const response = await request(app.getHttpServer())
        .post('/api/login')
        .send({ username: 'johndoe', password: 'wrongpass' });

      expect(response.status).toBe(401);
      expect(response.body.errors.message).toBe('Username or password invalid');
    });

    it('should be able to login', async () => {
      const passwordHash = await bcrypt.hash('johndoe', 10);
      mockPgService.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              username: 'johndoe',
              password_hash: passwordHash,
              refresh_token: null,
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            { id: 1, username: 'johndoe', refresh_token: 'refresh-token' },
          ],
        });

      mockAuthService.loginAccount.mockImplementation(async (req) => {
        const isPasswordValid = await bcrypt.compare(
          req.password,
          passwordHash,
        );
        if (!isPasswordValid)
          throw new HttpException('Username or password invalid', 401);
        return { token: 'access-token', refresh_token: 'refresh-token' };
      });

      const response = await request(app.getHttpServer())
        .post('/api/login')
        .send({ username: 'johndoe', password: 'johndoe' });

      expect(response.status).toBe(201);
      expect(response.body.data.token).toBe('access-token');
      expect(response.body.data.refresh_token).toBe('refresh-token');
    });
  });

  describe('POST /api/register -> Register', () => {
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username: '',
          password: '',
          confirm_password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('Validation Error');
    });

    it('should be rejected if user already exists', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [
          {
            id: 1,
            username: 'johndoe',
            refresh_token: 'refresh-token',
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username: 'johndoe',
          password: 'johndoe',
          confirm_password: 'johndoe',
        });

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe('Username already exists');
    });

    it('should be rejected if password dont match', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [],
      });

      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username: 'johndoe1',
          password: 'johndoe',
          confirm_password: 'johndoe1',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.message).toBe(
        'Password and confirm password do not match',
      );
    });

    it('should be able to register', async () => {
      mockPgService.query
        .mockResolvedValueOnce({
          rows: [],
        })
        .mockResolvedValueOnce({
          rows: [
            { id: 1, username: 'johndoe', refresh_token: 'refresh-token' },
          ],
        });

      const response = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          username: 'johndoe',
          password: 'johndoe',
          confirm_password: 'johndoe',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual({
        id: 1,
        username: 'johndoe',
      });
      expect(response.body.message).toBe(
        'Registration successful! You can now log in.',
      );
    });
  });

  describe('DELETE /api/logout -> Logout', () => {
    it('should be able to logout', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [
          {
            id: 1,
            username: 'johndoe',
            refresh_token: null,
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .delete('/api/logout')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Logout successful! You have been logged out.',
      );
    });
  });

  describe('GET /api/generate-access-token -> Generetae Access Token', () => {
    it('should be able to generate new access token', async () => {
      mockPgService.query.mockResolvedValue({
        rows: [
          {
            id: 1,
            username: 'johndoe',
            refresh_token: 'refresh-token',
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/api/generate-access-token')
        .set('Authorization', 'Bearer refresh-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Generate access token successfully.');
      expect(response.body.data.token).toBe('access-token');
    });

    it('should be unauthorized if invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/generate-access-token')
        .set('Authorization', 'Bearer wrong-token');

      expect(response.status).toBe(401);
      expect(response.body.errors.message).toBe('Unauthorized');
    });
  });

  describe('GET /api/verify-token -> Verify Token', () => {
    it('should verify token successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/verify-token')
        .set('Authorization', 'Bearer access-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Token is active.');
    });

    it('should be unauthorized if the token expires', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/verify-token')
        .set('Authorization', 'Bearer access-token-expired');

      expect(response.status).toBe(401);
      expect(response.body.errors.message).toBe('Token expired');
    });
  });
});
