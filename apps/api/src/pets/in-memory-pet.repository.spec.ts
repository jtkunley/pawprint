import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryPetRepository } from './in-memory-pet.repository.js';
import { createSeedPets } from './seed-pets.js';

describe('InMemoryPetRepository', () => {
  let repository: InMemoryPetRepository;

  beforeEach(() => {
    repository = new InMemoryPetRepository(createSeedPets());
  });

  it('returns every pet sorted by name by default', async () => {
    const pets = await repository.findMany();

    expect(pets).toHaveLength(12);
    expect(pets.map((pet) => pet.name).slice(0, 3)).toEqual(['Biscuit', 'Captain', 'Clover']);
  });

  it('searches names case-insensitively', async () => {
    const pets = await repository.findMany({ search: '  mOcH ' });
    expect(pets.map((pet) => pet.id)).toEqual(['pet-002']);
  });

  it('combines species and status filters', async () => {
    const pets = await repository.findMany({ species: 'cat', status: 'available' });
    expect(pets.map((pet) => pet.name)).toEqual([
      'Luna',
      'Mochi',
      'Sir Reginald Wigglesworth-Fluffington III',
    ]);
  });

  it.each([
    ['youngest', ['Thumper', 'Pepper', 'Mochi']],
    ['oldest', ['Olive', 'Juniper', 'Sir Reginald Wigglesworth-Fluffington III']],
    ['newest', ['Pepper', 'Thumper', 'Mochi']],
  ] as const)('sorts by %s', async (sort, expected) => {
    const pets = await repository.findMany({ sort });
    expect(pets.slice(0, 3).map((pet) => pet.name)).toEqual(expected);
  });

  it('returns copies so callers cannot mutate stored pets', async () => {
    const pet = await repository.findById('pet-001');
    pet!.name = 'Mutated';
    pet!.traits.push('Mutated');

    const [listed] = await repository.findMany({ search: 'biscuit' });
    listed!.status = 'adopted';

    const stored = await repository.findById('pet-001');
    expect(stored).toMatchObject({ name: 'Biscuit', status: 'available' });
    expect(stored!.traits).not.toContain('Mutated');
  });

  it('does not keep a reference to saved objects', async () => {
    const pet = (await repository.findById('pet-001'))!;
    await repository.save(pet);
    pet.name = 'Changed after save';

    expect((await repository.findById('pet-001'))!.name).toBe('Biscuit');
  });

  it('returns undefined for unknown ids', async () => {
    expect(await repository.findById('pet-999')).toBeUndefined();
  });

  it('replaces all pets', async () => {
    await repository.replaceAll([(await repository.findById('pet-001'))!]);
    expect(await repository.count()).toBe(1);
  });
});
