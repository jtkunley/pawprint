import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type DemoResetResult, DemoResetResultSchema } from '@pawprint/contracts';
import { DemoService } from './demo.service.js';

@ApiTags('demo')
@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restore seed data and clear applications',
    description: 'Only registered when NODE_ENV is not "production".',
  })
  @ApiOkResponse({ standardSchema: DemoResetResultSchema })
  reset(): Promise<DemoResetResult> {
    return this.demoService.reset();
  }
}
