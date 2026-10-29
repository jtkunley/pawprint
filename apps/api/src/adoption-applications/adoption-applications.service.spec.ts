import { ConflictException, NotFoundException } from '@nestjs/common';
import type { CreateAdoptionApplication } from '@pawprint/contracts';
import { beforeEach, describe, expect, it } from 'vitest';
import { FixedClock } from '../core/clock.js';
import { SequentialIdGenerator } from '../core/id-generator.js';
import { InMemoryPetRepository } from '../pets/in-memory-pet.repository.js';
import { PetsService } from '../pets/pets.service.js';
import { createSeedPets } from '../pets/seed-pets.js';
import { AdoptionApplicationsService } from './adoption-applications.service.js';
import { InMemoryAdoptionApplicationRepository } from './in-memory-adoption-application.repository.js';

const NOW = new Date('2026-10-28T12:00:00.000Z');

const input = (overrides: Partial<CreateAdoptionApplication> = {}): CreateAdoptionApplication => ({
  petId: 'pet-001',
  applicantName: 'Jordan Rivera',
  email: 'jordan@example.com',
  homeType: 'house',
  hasOtherPets: false,
  message: 'We have a fenced yard and love long walks.',
  ...overrides,
});

describe('AdoptionApplicationsService', () => {
  let pets: InMemoryPetRepository;
  let service: AdoptionApplicationsService;

  beforeEach(() => {
    pets = new InMemoryPetRepository(createSeedPets());
    service = new AdoptionApplicationsService(
      new InMemoryAdoptionApplicationRepository(),
      pets,
      new PetsService(pets),
      new FixedClock(NOW),
      new SequentialIdGenerator(),
    );
  });

  it('creates an application with a predictable id and timestamp', async () => {
    expect(await service.submit(input())).toEqual({
      ...input(),
      id: 'app-0001',
      petName: 'Biscuit',
      status: 'received',
      submittedAt: '2026-10-28T12:00:00.000Z',
    });
    expect((await service.submit(input({ petId: 'pet-002' }))).id).toBe('app-0002');
  });

  it('moves an available pet to pending', async () => {
    await service.submit(input());
    expect((await pets.findById('pet-001'))!.status).toBe('pending');
  });

  it('accepts additional applications for pending pets', async () => {
    await service.submit(input({ petId: 'pet-003' }));
    expect((await pets.findById('pet-003'))!.status).toBe('pending');
  });

  it('rejects applications for adopted pets', async () => {
    await expect(service.submit(input({ petId: 'pet-005' }))).rejects.toThrow(
      new ConflictException('Juniper has already been adopted'),
    );
  });

  it('rejects applications for unknown pets', async () => {
    await expect(service.submit(input({ petId: 'pet-999' }))).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lists submitted applications', async () => {
    await service.submit(input());
    expect(await service.list()).toMatchObject({ total: 1, items: [{ id: 'app-0001' }] });
  });
});
