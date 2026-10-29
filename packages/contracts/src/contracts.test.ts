import { describe, expect, it } from 'vitest';
import { CreateAdoptionApplicationSchema, PetQuerySchema, toValidationIssues } from './index.js';

describe('PetQuerySchema', () => {
  it('treats blank query params as absent', () => {
    expect(PetQuerySchema.parse({ search: '', species: '', status: '', sort: '' })).toEqual({});
  });

  it('trims search text and rejects unknown enum values', () => {
    expect(PetQuerySchema.parse({ search: '  Biscuit ' }).search).toBe('Biscuit');
    expect(PetQuerySchema.safeParse({ species: 'dragon' }).success).toBe(false);
  });
});

describe('CreateAdoptionApplicationSchema', () => {
  it('reports friendly field-level messages', () => {
    const result = CreateAdoptionApplicationSchema.safeParse({
      petId: 'pet-001',
      applicantName: 'A',
      email: 'nope',
      homeType: 'house',
      hasOtherPets: false,
      message: 'Too short',
    });

    expect(result.success).toBe(false);
    expect(toValidationIssues(result.error!)).toEqual([
      { path: 'applicantName', message: 'Enter your full name' },
      { path: 'email', message: 'Enter a valid email address' },
      { path: 'message', message: 'Tell us a little more (at least 20 characters)' },
    ]);
  });
});
