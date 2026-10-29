import { Inject, Injectable } from '@nestjs/common';
import type { DemoResetResult } from '@pawprint/contracts';
import {
  ADOPTION_APPLICATION_REPOSITORY,
  type AdoptionApplicationRepository,
} from '../adoption-applications/adoption-application.repository.js';
import { ID_GENERATOR, type IdGenerator } from '../core/id-generator.js';
import { PET_REPOSITORY, type PetRepository } from '../pets/pet.repository.js';
import { createSeedPets } from '../pets/seed-pets.js';

@Injectable()
export class DemoService {
  constructor(
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(ADOPTION_APPLICATION_REPOSITORY)
    private readonly applications: AdoptionApplicationRepository,
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
  ) {}

  /** Restores the seeded catalog and discards all applications. */
  async reset(): Promise<DemoResetResult> {
    await this.pets.replaceAll(createSeedPets());
    await this.applications.clear();
    this.ids.reset();
    return { pets: await this.pets.count(), applications: 0 };
  }
}
