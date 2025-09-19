import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/api/v1/industries (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/industries')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('limit');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
      });
  });

  it('/api/v1/industries/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/industries/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('icon');
        expect(res.body).toHaveProperty('services');
        expect(Array.isArray(res.body.services)).toBe(true);
      });
  });

  it('/api/v1/industries/999 (GET) - Not Found', () => {
    return request(app.getHttpServer())
      .get('/api/v1/industries/999')
      .expect(404)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Industry with ID 999 not found');
      });
  });
});