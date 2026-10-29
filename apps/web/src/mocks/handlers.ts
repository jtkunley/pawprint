import {
  type ApiErrorBody,
  CreateAdoptionApplicationSchema,
  type Pet,
  PetQuerySchema,
  toValidationIssues,
} from '@pawprint/contracts';
import { delay, http, HttpResponse } from 'msw';
import { allPets, makeApplication } from './fixtures';

const error = (statusCode: number, errorName: string, message: string) =>
  HttpResponse.json<ApiErrorBody>(
    { statusCode, error: errorName, message },
    { status: statusCode },
  );

/** Mirrors the API's filtering closely enough for stories; sorting is by name only. */
function filterPets(pets: Pet[], url: URL): Pet[] {
  const query = PetQuerySchema.parse(Object.fromEntries(url.searchParams));
  const needle = query.search?.toLowerCase();
  return pets
    .filter((pet) => !needle || pet.name.toLowerCase().includes(needle))
    .filter((pet) => !query.species || pet.species === query.species)
    .filter((pet) => !query.status || pet.status === query.status)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const petHandlers = {
  list: (pets: Pet[] = allPets) =>
    http.get('/api/pets', async ({ request }) => {
      await delay(150);
      const items = filterPets(pets, new URL(request.url));
      return HttpResponse.json({ items, total: items.length });
    }),

  loading: () =>
    http.get('/api/pets', async () => {
      await delay('infinite');
      return HttpResponse.json({ items: [], total: 0 });
    }),

  error: () => http.get('/api/pets', () => error(500, 'Internal Server Error', 'Something broke')),

  detail: (pets: Pet[] = allPets) =>
    http.get('/api/pets/:id', async ({ params }) => {
      await delay(100);
      const pet = pets.find((candidate) => candidate.id === params.id);
      return pet
        ? HttpResponse.json(pet)
        : error(404, 'Not Found', `Pet "${String(params.id)}" was not found`);
    }),

  detailLoading: () =>
    http.get('/api/pets/:id', async () => {
      await delay('infinite');
      return new HttpResponse(null);
    }),

  detailError: () =>
    http.get('/api/pets/:id', () => error(500, 'Internal Server Error', 'Something broke')),
};

export const applicationHandlers = {
  submit: () =>
    http.post('/api/adoption-applications', async ({ request }) => {
      await delay(300);
      const result = CreateAdoptionApplicationSchema.safeParse(await request.json());
      if (!result.success) {
        return HttpResponse.json<ApiErrorBody>(
          {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Validation failed',
            issues: toValidationIssues(result.error),
          },
          { status: 400 },
        );
      }
      const pet = allPets.find((candidate) => candidate.id === result.data.petId);
      return HttpResponse.json(
        makeApplication({ ...result.data, petName: pet?.name ?? 'your pet' }),
        {
          status: 201,
        },
      );
    }),

  /** Server-side validation failure that the client could not have predicted. */
  rejectEmail: () =>
    http.post('/api/adoption-applications', () =>
      HttpResponse.json<ApiErrorBody>(
        {
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed',
          issues: [{ path: 'email', message: 'This email address has been blocked' }],
        },
        { status: 400 },
      ),
    ),

  conflict: () =>
    http.post('/api/adoption-applications', () =>
      error(409, 'Conflict', 'Biscuit has already been adopted'),
    ),
};

export const demoHandlers = {
  reset: () => http.post('/api/demo/reset', () => HttpResponse.json({ pets: 12, applications: 0 })),
};

export const defaultHandlers = [
  petHandlers.list(),
  petHandlers.detail(),
  applicationHandlers.submit(),
  demoHandlers.reset(),
];
