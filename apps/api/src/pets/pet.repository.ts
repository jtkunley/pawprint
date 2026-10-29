import type { AdoptionStatus, Pet, PetSort, Species } from '@pawprint/contracts';

export interface PetCriteria {
  search?: string;
  species?: Species;
  status?: AdoptionStatus;
  sort?: PetSort;
}

/**
 * Storage port for pets. Implementations must return copies so that callers
 * cannot mutate stored state without going through `save`.
 */
export interface PetRepository {
  findMany(criteria?: PetCriteria): Promise<Pet[]>;
  findById(id: string): Promise<Pet | undefined>;
  save(pet: Pet): Promise<Pet>;
  replaceAll(pets: Pet[]): Promise<void>;
  count(): Promise<number>;
}

export const PET_REPOSITORY = Symbol('PET_REPOSITORY');
