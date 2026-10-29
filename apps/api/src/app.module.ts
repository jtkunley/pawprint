import { type DynamicModule, Module } from '@nestjs/common';
import { AdoptionApplicationsModule } from './adoption-applications/adoption-applications.module.js';
import { CoreModule } from './core/core.module.js';
import { DemoModule } from './demo/demo.module.js';
import { HealthController } from './health/health.controller.js';
import { PetsModule } from './pets/pets.module.js';

export interface AppOptions {
  /** Registers `POST /api/demo/reset`. Must be false in production. */
  demoResetEnabled: boolean;
}

@Module({})
export class AppModule {
  static register({ demoResetEnabled }: AppOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        CoreModule,
        PetsModule,
        AdoptionApplicationsModule,
        ...(demoResetEnabled ? [DemoModule] : []),
      ],
      controllers: [HealthController],
    };
  }
}
