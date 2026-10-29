import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type {
  AdoptionApplication,
  AdoptionApplicationList,
  CreateAdoptionApplication,
} from '@pawprint/contracts';
import { CLOCK, type Clock } from '../core/clock.js';
import { ID_GENERATOR, type IdGenerator } from '../core/id-generator.js';
import { PET_REPOSITORY, type PetRepository } from '../pets/pet.repository.js';
import { PetsService } from '../pets/pets.service.js';
import {
  ADOPTION_APPLICATION_REPOSITORY,
  type AdoptionApplicationRepository,
} from './adoption-application.repository.js';

@Injectable()
export class AdoptionApplicationsService {
  constructor(
    @Inject(ADOPTION_APPLICATION_REPOSITORY)
    private readonly applications: AdoptionApplicationRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    private readonly petsService: PetsService,
    @Inject(CLOCK) private readonly clock: Clock,
    @Inject(ID_GENERATOR) private readonly ids: IdGenerator,
  ) {}

  async list(): Promise<AdoptionApplicationList> {
    const items = await this.applications.findAll();
    return { items, total: items.length };
  }

  /**
   * Records an application. The first application for an available pet moves
   * it to `pending`; adopted pets no longer accept applications.
   */
  async submit(input: CreateAdoptionApplication): Promise<AdoptionApplication> {
    const pet = await this.petsService.getById(input.petId);
    if (pet.status === 'adopted') {
      throw new ConflictException(`${pet.name} has already been adopted`);
    }

    const application = await this.applications.save({
      ...input,
      id: this.ids.next('app'),
      petName: pet.name,
      status: 'received',
      submittedAt: this.clock.now().toISOString(),
    });

    if (pet.status === 'available') {
      await this.pets.save({ ...pet, status: 'pending' });
    }

    return application;
  }
}
