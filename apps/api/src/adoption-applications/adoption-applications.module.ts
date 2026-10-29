import { Module } from '@nestjs/common';
import { PetsModule } from '../pets/pets.module.js';
import { ADOPTION_APPLICATION_REPOSITORY } from './adoption-application.repository.js';
import { AdoptionApplicationsController } from './adoption-applications.controller.js';
import { AdoptionApplicationsService } from './adoption-applications.service.js';
import { InMemoryAdoptionApplicationRepository } from './in-memory-adoption-application.repository.js';

@Module({
  imports: [PetsModule],
  controllers: [AdoptionApplicationsController],
  providers: [
    AdoptionApplicationsService,
    { provide: ADOPTION_APPLICATION_REPOSITORY, useClass: InMemoryAdoptionApplicationRepository },
  ],
  exports: [ADOPTION_APPLICATION_REPOSITORY],
})
export class AdoptionApplicationsModule {}
