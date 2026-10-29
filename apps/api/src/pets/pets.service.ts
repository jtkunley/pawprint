import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pet, PetList, PetQuery } from '@pawprint/contracts';
import { PET_REPOSITORY, type PetRepository } from './pet.repository.js';

@Injectable()
export class PetsService {
  constructor(@Inject(PET_REPOSITORY) private readonly pets: PetRepository) {}

  async list(query: PetQuery = {}): Promise<PetList> {
    const items = await this.pets.findMany(query);
    return { items, total: items.length };
  }

  async getById(id: string): Promise<Pet> {
    const pet = await this.pets.findById(id);
    if (!pet) {
      throw new NotFoundException(`Pet "${id}" was not found`);
    }
    return pet;
  }
}
