import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorSchema,
  type Pet,
  type PetList,
  type PetQuery,
  PetListSchema,
  PetQuerySchema,
  PetSchema,
} from '@pawprint/contracts';
import { PetsService } from './pets.service.js';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @ApiOperation({ summary: 'List pets, optionally filtered by name, species, and status' })
  @ApiOkResponse({ standardSchema: PetListSchema })
  list(@Query({ schema: PetQuerySchema }) query: PetQuery): Promise<PetList> {
    return this.petsService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single pet' })
  @ApiOkResponse({ standardSchema: PetSchema })
  @ApiNotFoundResponse({ standardSchema: ApiErrorSchema })
  get(@Param('id') id: string): Promise<Pet> {
    return this.petsService.getById(id);
  }
}
