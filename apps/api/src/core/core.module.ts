import { Global, Module } from '@nestjs/common';
import { CLOCK, SystemClock } from './clock.js';
import { ID_GENERATOR, SequentialIdGenerator } from './id-generator.js';

@Global()
@Module({
  providers: [
    { provide: CLOCK, useClass: SystemClock },
    { provide: ID_GENERATOR, useClass: SequentialIdGenerator },
  ],
  exports: [CLOCK, ID_GENERATOR],
})
export class CoreModule {}
