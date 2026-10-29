import {
  type AdoptionApplication,
  AdoptionApplicationSchema,
  type ApiErrorBody,
  ApiErrorSchema,
  type CreateAdoptionApplication,
  type DemoResetResult,
  DemoResetResultSchema,
  type Pet,
  type PetList,
  PetListSchema,
  type PetQuery,
  PetSchema,
} from '@pawprint/contracts';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody | null,
  ) {
    super(
      body?.message ?? (status === 0 ? 'Network request failed' : `Request failed (${status})`),
    );
    this.name = 'ApiError';
  }
}

interface Parser<T> {
  parse(data: unknown): T;
}

async function request<T>(path: string, parser: Parser<T>, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, null);
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const body = ApiErrorSchema.safeParse(payload);
    throw new ApiError(response.status, body.success ? body.data : null);
  }
  return parser.parse(payload);
}

function toSearchParams(query: PetQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const search = params.toString();
  return search ? `?${search}` : '';
}

export const api = {
  listPets: (query: PetQuery, signal?: AbortSignal): Promise<PetList> =>
    request(`/pets${toSearchParams(query)}`, PetListSchema, { signal }),

  getPet: (id: string, signal?: AbortSignal): Promise<Pet> =>
    request(`/pets/${encodeURIComponent(id)}`, PetSchema, { signal }),

  submitApplication: (input: CreateAdoptionApplication): Promise<AdoptionApplication> =>
    request('/adoption-applications', AdoptionApplicationSchema, {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  resetDemo: (): Promise<DemoResetResult> =>
    request('/demo/reset', DemoResetResultSchema, { method: 'POST' }),
};
