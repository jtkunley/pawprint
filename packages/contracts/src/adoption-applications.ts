import { z } from 'zod';

export const HOME_TYPES = ['house', 'apartment', 'other'] as const;
export const HomeTypeSchema = z.enum(HOME_TYPES, { error: 'Choose the type of home you live in' });
export type HomeType = z.infer<typeof HomeTypeSchema>;

export const CreateAdoptionApplicationSchema = z
  .object({
    petId: z.string().min(1, 'Choose a pet to apply for').meta({ example: 'pet-001' }),
    applicantName: z
      .string()
      .trim()
      .min(2, 'Enter your full name')
      .max(100, 'Name must be 100 characters or fewer')
      .meta({ example: 'Jordan Rivera' }),
    email: z.email('Enter a valid email address').meta({ example: 'jordan@example.com' }),
    homeType: HomeTypeSchema,
    hasOtherPets: z.boolean(),
    message: z
      .string()
      .trim()
      .min(20, 'Tell us a little more (at least 20 characters)')
      .max(1000, 'Message must be 1000 characters or fewer')
      .meta({ example: 'We have a fenced yard and love long weekend walks.' }),
  })
  .meta({ id: 'CreateAdoptionApplication' });
export type CreateAdoptionApplication = z.infer<typeof CreateAdoptionApplicationSchema>;

export const AdoptionApplicationSchema = CreateAdoptionApplicationSchema.extend({
  id: z.string().min(1).meta({ example: 'app-0001' }),
  petName: z.string().min(1).meta({ example: 'Biscuit' }),
  status: z.literal('received'),
  submittedAt: z.iso.datetime(),
}).meta({ id: 'AdoptionApplication' });
export type AdoptionApplication = z.infer<typeof AdoptionApplicationSchema>;

export const AdoptionApplicationListSchema = z
  .object({
    items: z.array(AdoptionApplicationSchema),
    total: z.int().nonnegative(),
  })
  .meta({ id: 'AdoptionApplicationList' });
export type AdoptionApplicationList = z.infer<typeof AdoptionApplicationListSchema>;
