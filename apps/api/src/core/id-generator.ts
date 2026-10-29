export interface IdGenerator {
  next(prefix: string): string;
  reset(): void;
}

export const ID_GENERATOR = Symbol('ID_GENERATOR');

/** Produces `prefix-0001`, `prefix-0002`, ... with an independent counter per prefix. */
export class SequentialIdGenerator implements IdGenerator {
  private readonly counters = new Map<string, number>();

  next(prefix: string): string {
    const value = (this.counters.get(prefix) ?? 0) + 1;
    this.counters.set(prefix, value);
    return `${prefix}-${String(value).padStart(4, '0')}`;
  }

  reset(): void {
    this.counters.clear();
  }
}
