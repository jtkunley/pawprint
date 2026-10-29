import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Health, HealthSchema } from '@pawprint/contracts';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Liveness check' })
  @ApiOkResponse({ standardSchema: HealthSchema })
  check(): Health {
    return { status: 'ok' };
  }
}
