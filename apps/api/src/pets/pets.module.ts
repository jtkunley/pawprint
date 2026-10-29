import { Module } from '@nestjs/common';
import { InMemoryPetRepository } from './in-memory-pet.repository.js';
import { PET_REPOSITORY } from './pet.repository.js';
import { PetsController } from './pets.controller.js';
import { PetsService } from './pets.service.js';
import { createSeedPets } from './seed-pets.js';

@Module({
  controllers: [PetsController],
  providers: [
    PetsService,
    { provide: PET_REPOSITORY, useFactory: () => new InMemoryPetRepository(createSeedPets()) },
  ],
  exports: [PetsService, PET_REPOSITORY],
})
export class PetsModule {}
