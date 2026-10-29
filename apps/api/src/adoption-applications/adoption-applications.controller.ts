import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  type AdoptionApplication,
  type AdoptionApplicationList,
  AdoptionApplicationListSchema,
  AdoptionApplicationSchema,
  ApiErrorSchema,
  type CreateAdoptionApplication,
  CreateAdoptionApplicationSchema,
} from '@pawprint/contracts';
import { AdoptionApplicationsService } from './adoption-applications.service.js';

@ApiTags('adoption-applications')
@Controller('adoption-applications')
export class AdoptionApplicationsController {
  constructor(private readonly applicationsService: AdoptionApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'List submitted adoption applications, newest first' })
  @ApiOkResponse({ standardSchema: AdoptionApplicationListSchema })
  list(): Promise<AdoptionApplicationList> {
    return this.applicationsService.list();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit an adoption application for a pet' })
  @ApiCreatedResponse({ standardSchema: AdoptionApplicationSchema })
  @ApiBadRequestResponse({ description: 'Validation failed', standardSchema: ApiErrorSchema })
  @ApiNotFoundResponse({ description: 'Pet not found', standardSchema: ApiErrorSchema })
  @ApiConflictResponse({ description: 'Pet already adopted', standardSchema: ApiErrorSchema })
  submit(
    @Body({ schema: CreateAdoptionApplicationSchema }) input: CreateAdoptionApplication,
  ): Promise<AdoptionApplication> {
    return this.applicationsService.submit(input);
  }
}
