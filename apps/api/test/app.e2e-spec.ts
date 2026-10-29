import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  AdoptionApplicationListSchema,
  AdoptionApplicationSchema,
  type CreateAdoptionApplication,
  PetListSchema,
  PetSchema,
} from '@pawprint/contracts';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/configure-app.js';
import { CLOCK, FixedClock } from '../src/core/clock.js';

const NOW = new Date('2026-10-28T12:00:00.000Z');

const application: CreateAdoptionApplication = {
  petId: 'pet-001',
  applicantName: 'Jordan Rivera',
  email: 'jordan@example.com',
  homeType: 'house',
  hasOtherPets: true,
  message: 'We have a fenced yard and a very friendly older dog.',
};

async function createApp(demoResetEnabled = true): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule.register({ demoResetEnabled })],
  })
    .overrideProvider(CLOCK)
    .useValue(new FixedClock(NOW))
    .compile();

  const app = configureApp(moduleRef.createNestApplication({ logger: false }));
  await app.init();
  return app;
}

describe('Pawprint API (e2e)', () => {
  let app: INestApplication;
  const http = () => request(app.getHttpServer());

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/health', async () => {
    await http().get('/api/health').expect(200, { status: 'ok' });
  });

  describe('GET /api/pets', () => {
    it('returns the seeded catalog matching the shared contract', async () => {
      const { body } = await http().get('/api/pets').expect(200);

      const list = PetListSchema.parse(body);
      expect(list.total).toBe(12);
      expect(list.items[0]!.name).toBe('Biscuit');
    });

    it('filters by search, species, and status and sorts', async () => {
      const { body } = await http()
        .get('/api/pets')
        .query({ species: 'dog', status: 'available', sort: 'youngest' })
        .expect(200);

      expect(body.items.map((pet: { name: string }) => pet.name)).toEqual([
        'Pepper',
        'Biscuit',
        'Waffles',
      ]);

      const search = await http().get('/api/pets?search=sir').expect(200);
      expect(search.body.items.map((pet: { id: string }) => pet.id)).toEqual(['pet-006']);
    });

    it('ignores blank query params', async () => {
      const { body } = await http().get('/api/pets?search=&species=&status=').expect(200);
      expect(body.total).toBe(12);
    });

    it('rejects invalid filters with field issues', async () => {
      const { body } = await http().get('/api/pets?species=dragon&sort=random').expect(400);

      expect(body).toMatchObject({ statusCode: 400, message: 'Validation failed' });
      expect(body.issues.map((issue: { path: string }) => issue.path)).toEqual(['species', 'sort']);
    });
  });

  describe('GET /api/pets/:id', () => {
    it('returns one pet', async () => {
      const { body } = await http().get('/api/pets/pet-006').expect(200);
      expect(PetSchema.parse(body)).toMatchObject({ imageUrl: null, species: 'cat' });
    });

    it('returns 404 for unknown pets', async () => {
      await http().get('/api/pets/pet-999').expect(404, {
        statusCode: 404,
        error: 'Not Found',
        message: 'Pet "pet-999" was not found',
      });
    });
  });

  describe('adoption applications', () => {
    it('creates an application and marks the pet pending', async () => {
      const { body } = await http()
        .post('/api/adoption-applications')
        .send(application)
        .expect(201);

      expect(AdoptionApplicationSchema.parse(body)).toEqual({
        ...application,
        id: 'app-0001',
        petName: 'Biscuit',
        status: 'received',
        submittedAt: '2026-10-28T12:00:00.000Z',
      });

      const pet = await http().get('/api/pets/pet-001').expect(200);
      expect(pet.body.status).toBe('pending');

      const list = await http().get('/api/adoption-applications').expect(200);
      expect(AdoptionApplicationListSchema.parse(list.body)).toMatchObject({
        total: 1,
        items: [{ id: 'app-0001' }],
      });
    });

    it('returns field-level validation issues', async () => {
      const { body } = await http()
        .post('/api/adoption-applications')
        .send({ ...application, applicantName: ' ', email: 'not-an-email', message: 'Hi' })
        .expect(400);

      expect(body.issues).toEqual([
        { path: 'applicantName', message: 'Enter your full name' },
        { path: 'email', message: 'Enter a valid email address' },
        { path: 'message', message: 'Tell us a little more (at least 20 characters)' },
      ]);
    });

    it('returns 409 for adopted pets and 404 for unknown pets', async () => {
      await http()
        .post('/api/adoption-applications')
        .send({ ...application, petId: 'pet-005' })
        .expect(409);
      await http()
        .post('/api/adoption-applications')
        .send({ ...application, petId: 'pet-999' })
        .expect(404);
    });
  });

  it('POST /api/demo/reset restores seed data', async () => {
    await http().post('/api/adoption-applications').send(application).expect(201);

    await http().post('/api/demo/reset').expect(200, { pets: 12, applications: 0 });

    expect((await http().get('/api/pets/pet-001')).body.status).toBe('available');
    expect((await http().get('/api/adoption-applications')).body).toEqual({ items: [], total: 0 });
    const again = await http().post('/api/adoption-applications').send(application).expect(201);
    expect(again.body.id).toBe('app-0001');
  });

  it('serves the OpenAPI document generated from the shared schemas', async () => {
    const { body } = await http().get('/docs/openapi.json').expect(200);

    expect(Object.keys(body.paths)).toEqual(
      expect.arrayContaining([
        '/api/pets',
        '/api/pets/{id}',
        '/api/adoption-applications',
        '/api/demo/reset',
        '/api/health',
      ]),
    );
    expect(body.components.schemas).toHaveProperty('Pet');
    expect(body.components.schemas).toHaveProperty('CreateAdoptionApplication');
  });
});

describe('Pawprint API in production mode (e2e)', () => {
  it('does not expose the demo reset endpoint', async () => {
    const app = await createApp(false);
    await request(app.getHttpServer()).post('/api/demo/reset').expect(404);
    await app.close();
  });
});
