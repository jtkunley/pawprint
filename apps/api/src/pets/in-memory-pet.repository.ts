import type { Pet, PetSort } from '@pawprint/contracts';
import type { PetCriteria, PetRepository } from './pet.repository.js';

const byName = (a: Pet, b: Pet) =>
  a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || a.id.localeCompare(b.id);

const comparators: Record<PetSort, (a: Pet, b: Pet) => number> = {
  name: byName,
  youngest: (a, b) => a.ageMonths - b.ageMonths || byName(a, b),
  oldest: (a, b) => b.ageMonths - a.ageMonths || byName(a, b),
  newest: (a, b) => b.intakeDate.localeCompare(a.intakeDate) || byName(a, b),
};

export class InMemoryPetRepository implements PetRepository {
  private readonly pets = new Map<string, Pet>();

  constructor(initialPets: Pet[] = []) {
    this.load(initialPets);
  }

  async findMany({ search, species, status, sort = 'name' }: PetCriteria = {}): Promise<Pet[]> {
    const needle = search?.trim().toLowerCase();

    return [...this.pets.values()]
      .filter((pet) => !needle || pet.name.toLowerCase().includes(needle))
      .filter((pet) => !species || pet.species === species)
      .filter((pet) => !status || pet.status === status)
      .sort(comparators[sort])
      .map((pet) => structuredClone(pet));
  }

  async findById(id: string): Promise<Pet | undefined> {
    const pet = this.pets.get(id);
    return pet && structuredClone(pet);
  }

  async save(pet: Pet): Promise<Pet> {
    this.pets.set(pet.id, structuredClone(pet));
    return structuredClone(pet);
  }

  async replaceAll(pets: Pet[]): Promise<void> {
    this.pets.clear();
    this.load(pets);
  }

  async count(): Promise<number> {
    return this.pets.size;
  }

  private load(pets: Pet[]): void {
    for (const pet of pets) {
      this.pets.set(pet.id, structuredClone(pet));
    }
  }
}
