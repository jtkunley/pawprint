import { Module } from '@nestjs/common';
import { AdoptionApplicationsModule } from '../adoption-applications/adoption-applications.module.js';
import { PetsModule } from '../pets/pets.module.js';
import { DemoController } from './demo.controller.js';
import { DemoService } from './demo.service.js';

@Module({
  imports: [PetsModule, AdoptionApplicationsModule],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
