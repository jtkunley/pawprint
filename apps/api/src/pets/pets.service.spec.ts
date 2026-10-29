import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryPetRepository } from './in-memory-pet.repository.js';
import { PetsService } from './pets.service.js';
import { createSeedPets } from './seed-pets.js';

describe('PetsService', () => {
  let service: PetsService;

  beforeEach(() => {
    service = new PetsService(new InMemoryPetRepository(createSeedPets()));
  });

  it('lists pets with a total that matches the filtered items', async () => {
    const result = await service.list({ species: 'rabbit' });

    expect(result.total).toBe(2);
    expect(result.items.map((pet) => pet.name)).toEqual(['Clover', 'Thumper']);
  });

  it('returns an empty list when nothing matches', async () => {
    expect(await service.list({ search: 'zzz' })).toEqual({ items: [], total: 0 });
  });

  it('gets a pet by id', async () => {
    expect(await service.getById('pet-004')).toMatchObject({ name: 'Captain', species: 'bird' });
  });

  it('throws NotFoundException for an unknown pet', async () => {
    await expect(service.getById('pet-999')).rejects.toBeInstanceOf(NotFoundException);
  });
});
