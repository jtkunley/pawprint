import { describe, expect, it } from 'vitest';
import { InMemoryAdoptionApplicationRepository } from '../adoption-applications/in-memory-adoption-application.repository.js';
import { SequentialIdGenerator } from '../core/id-generator.js';
import { InMemoryPetRepository } from '../pets/in-memory-pet.repository.js';
import { createSeedPets } from '../pets/seed-pets.js';
import { DemoService } from './demo.service.js';

describe('DemoService', () => {
  it('restores seed pets, clears applications, and restarts id sequences', async () => {
    const pets = new InMemoryPetRepository(createSeedPets());
    const applications = new InMemoryAdoptionApplicationRepository();
    const ids = new SequentialIdGenerator();
    const service = new DemoService(pets, applications, ids);

    const biscuit = (await pets.findById('pet-001'))!;
    await pets.save({ ...biscuit, status: 'adopted' });
    await applications.save({
      id: ids.next('app'),
      petId: 'pet-001',
      petName: 'Biscuit',
      applicantName: 'Jordan Rivera',
      email: 'jordan@example.com',
      homeType: 'house',
      hasOtherPets: false,
      message: 'We would love to give Biscuit a home.',
      status: 'received',
      submittedAt: '2026-10-28T12:00:00.000Z',
    });

    expect(await service.reset()).toEqual({ pets: 12, applications: 0 });
    expect((await pets.findById('pet-001'))!.status).toBe('available');
    expect(await applications.findAll()).toEqual([]);
    expect(ids.next('app')).toBe('app-0001');
  });
});
