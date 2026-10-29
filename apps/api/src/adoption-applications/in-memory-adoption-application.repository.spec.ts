import type { AdoptionApplication } from '@pawprint/contracts';
import { describe, expect, it } from 'vitest';
import { InMemoryAdoptionApplicationRepository } from './in-memory-adoption-application.repository.js';

const application = (id: string, submittedAt: string): AdoptionApplication => ({
  id,
  petId: 'pet-001',
  petName: 'Biscuit',
  applicantName: 'Jordan Rivera',
  email: 'jordan@example.com',
  homeType: 'house',
  hasOtherPets: false,
  message: 'We would love to give Biscuit a home.',
  status: 'received',
  submittedAt,
});

describe('InMemoryAdoptionApplicationRepository', () => {
  it('lists applications newest first', async () => {
    const repository = new InMemoryAdoptionApplicationRepository();
    await repository.save(application('app-0001', '2026-10-01T10:00:00.000Z'));
    await repository.save(application('app-0002', '2026-10-02T10:00:00.000Z'));

    expect((await repository.findAll()).map((item) => item.id)).toEqual(['app-0002', 'app-0001']);
  });

  it('stores and returns copies', async () => {
    const repository = new InMemoryAdoptionApplicationRepository();
    const input = application('app-0001', '2026-10-01T10:00:00.000Z');

    const saved = await repository.save(input);
    input.applicantName = 'Changed input';
    saved.applicantName = 'Changed result';
    (await repository.findAll())[0]!.applicantName = 'Changed listing';

    expect((await repository.findAll())[0]!.applicantName).toBe('Jordan Rivera');
  });

  it('clears all applications', async () => {
    const repository = new InMemoryAdoptionApplicationRepository();
    await repository.save(application('app-0001', '2026-10-01T10:00:00.000Z'));
    await repository.clear();

    expect(await repository.findAll()).toEqual([]);
  });
});
