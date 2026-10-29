import type { AdoptionApplication } from '@pawprint/contracts';

/**
 * Storage port for adoption applications. Implementations must return copies
 * so that callers cannot mutate stored state.
 */
export interface AdoptionApplicationRepository {
  /** Returns applications newest first. */
  findAll(): Promise<AdoptionApplication[]>;
  save(application: AdoptionApplication): Promise<AdoptionApplication>;
  clear(): Promise<void>;
}

export const ADOPTION_APPLICATION_REPOSITORY = Symbol('ADOPTION_APPLICATION_REPOSITORY');
