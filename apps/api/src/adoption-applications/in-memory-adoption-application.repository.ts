import type { AdoptionApplication } from '@pawprint/contracts';
import type { AdoptionApplicationRepository } from './adoption-application.repository.js';

export class InMemoryAdoptionApplicationRepository implements AdoptionApplicationRepository {
  private readonly applications = new Map<string, AdoptionApplication>();

  async findAll(): Promise<AdoptionApplication[]> {
    return [...this.applications.values()]
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt) || b.id.localeCompare(a.id))
      .map((application) => structuredClone(application));
  }

  async save(application: AdoptionApplication): Promise<AdoptionApplication> {
    this.applications.set(application.id, structuredClone(application));
    return structuredClone(application);
  }

  async clear(): Promise<void> {
    this.applications.clear();
  }
}
