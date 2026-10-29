import { z } from 'zod';

export const SPECIES = ['dog', 'cat', 'rabbit', 'bird'] as const;
export const SpeciesSchema = z.enum(SPECIES);
export type Species = z.infer<typeof SpeciesSchema>;

export const ADOPTION_STATUSES = ['available', 'pending', 'adopted'] as const;
export const AdoptionStatusSchema = z.enum(ADOPTION_STATUSES);
export type AdoptionStatus = z.infer<typeof AdoptionStatusSchema>;

export const PET_SORTS = ['name', 'youngest', 'oldest', 'newest'] as const;
export const PetSortSchema = z.enum(PET_SORTS);
export type PetSort = z.infer<typeof PetSortSchema>;

export const PetSchema = z
  .object({
    id: z.string().min(1).meta({ example: 'pet-001' }),
    name: z.string().min(1).meta({ example: 'Biscuit' }),
    species: SpeciesSchema,
    breed: z.string().min(1).meta({ example: 'Beagle mix' }),
    ageMonths: z.int().nonnegative().meta({ example: 26 }),
    sex: z.enum(['female', 'male']),
    size: z.enum(['small', 'medium', 'large']),
    status: AdoptionStatusSchema,
    description: z.string(),
    traits: z.array(z.string()),
    imageUrl: z
      .string()
      .nullable()
      .meta({ description: 'Relative URL of the pet photo, or null when no photo exists.' }),
    intakeDate: z.iso.date().meta({ example: '2026-03-14' }),
  })
  .meta({ id: 'Pet' });
export type Pet = z.infer<typeof PetSchema>;

export const PetListSchema = z
  .object({
    items: z.array(PetSchema),
    total: z.int().nonnegative(),
  })
  .meta({ id: 'PetList' });
export type PetList = z.infer<typeof PetListSchema>;

/** Query params arrive as strings; blank values are treated as "not provided". */
const optionalParam = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional());

export const PetQuerySchema = z.object({
  search: optionalParam(
    z.string().trim().max(100).meta({ description: 'Case-insensitive match on pet name.' }),
  ),
  species: optionalParam(SpeciesSchema),
  status: optionalParam(AdoptionStatusSchema),
  sort: optionalParam(PetSortSchema.meta({ description: 'Sort order. Defaults to `name`.' })),
});
export type PetQuery = z.infer<typeof PetQuerySchema>;
