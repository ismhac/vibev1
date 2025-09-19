import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AnnouncementsModule } from '../src/announcements/announcements.module';

describe('AnnouncementsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AnnouncementsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/announcements (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/announcements')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('limit');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.total).toBe(8);
        expect(res.body.page).toBe(1);
        expect(res.body.limit).toBe(10);
      });
  });

  it('/api/v1/announcements?page=1&limit=3 (GET) - Pagination', () => {
    return request(app.getHttpServer())
      .get('/api/v1/announcements?page=1&limit=3')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('limit');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(3);
        expect(res.body.total).toBe(8);
        expect(res.body.page).toBe(1);
        expect(res.body.limit).toBe(3);
      });
  });

  it('/api/v1/announcements?page=2&limit=5 (GET) - Second Page', () => {
    return request(app.getHttpServer())
      .get('/api/v1/announcements?page=2&limit=5')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('limit');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(3); // 8 total - 5 first page = 3 second page
        expect(res.body.total).toBe(8);
        expect(res.body.page).toBe(2);
        expect(res.body.limit).toBe(5);
      });
  });

  it('/api/v1/announcements (GET) - Verify Announcement Structure', () => {
    return request(app.getHttpServer())
      .get('/api/v1/announcements?limit=1')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
        const announcement = res.body.data[0];
        
        expect(announcement).toHaveProperty('id');
        expect(announcement).toHaveProperty('title');
        expect(announcement).toHaveProperty('content');
        expect(announcement).toHaveProperty('summary');
        expect(announcement).toHaveProperty('author');
        expect(announcement).toHaveProperty('category');
        expect(announcement).toHaveProperty('priority');
        expect(announcement).toHaveProperty('isPublished');
        expect(announcement).toHaveProperty('publishedAt');
        expect(announcement).toHaveProperty('createdAt');
        expect(announcement).toHaveProperty('updatedAt');
        expect(announcement).toHaveProperty('tags');
        expect(announcement).toHaveProperty('readTime');
        
        expect(typeof announcement.id).toBe('number');
        expect(typeof announcement.title).toBe('string');
        expect(typeof announcement.content).toBe('string');
        expect(typeof announcement.summary).toBe('string');
        expect(typeof announcement.author).toBe('string');
        expect(typeof announcement.category).toBe('string');
        expect(['low', 'medium', 'high']).toContain(announcement.priority);
        expect(typeof announcement.isPublished).toBe('boolean');
        expect(announcement.isPublished).toBe(true);
        expect(Array.isArray(announcement.tags)).toBe(true);
        expect(typeof announcement.readTime).toBe('number');
      });
  });

  it('/api/v1/announcements (GET) - Verify Only Published Announcements', () => {
    return request(app.getHttpServer())
      .get('/api/v1/announcements')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(8);
        res.body.data.forEach((announcement: any) => {
          expect(announcement.isPublished).toBe(true);
        });
      });
  });
});
