import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { IndustriesModule } from '../src/industries/industries.module';

describe('IndustriesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IndustriesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
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
        expect(res.body.total).toBe(6);
        expect(res.body.page).toBe(1);
        expect(res.body.limit).toBe(10);
      });
  });

  it('/api/v1/industries?page=1&limit=3 (GET) - Pagination', () => {
    return request(app.getHttpServer())
      .get('/api/v1/industries?page=1&limit=3')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('limit');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(3);
        expect(res.body.total).toBe(6);
        expect(res.body.page).toBe(1);
        expect(res.body.limit).toBe(3);
      });
  });

  it('/api/v1/industries/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/industries/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name', 'Banking & Financial Services');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('icon', '🏦');
        expect(res.body).toHaveProperty('services');
        expect(Array.isArray(res.body.services)).toBe(true);
        expect(res.body.services.length).toBeGreaterThan(0);
        expect(res.body).toHaveProperty('createdAt');
        expect(res.body).toHaveProperty('updatedAt');
      });
  });

  it('/api/v1/industries/2 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/industries/2')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', 2);
        expect(res.body).toHaveProperty('name', 'Healthcare & Life Sciences');
        expect(res.body).toHaveProperty('icon', '🏥');
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

  it('/api/v1/industries/invalid (GET) - Invalid ID', () => {
    return request(app.getHttpServer())
      .get('/api/v1/industries/invalid')
      .expect(400);
  });
});
