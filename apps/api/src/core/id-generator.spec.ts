import { describe, expect, it } from 'vitest';
import { SequentialIdGenerator } from './id-generator.js';

describe('SequentialIdGenerator', () => {
  it('keeps an independent, zero-padded sequence per prefix', () => {
    const ids = new SequentialIdGenerator();

    expect([ids.next('app'), ids.next('app'), ids.next('other')]).toEqual([
      'app-0001',
      'app-0002',
      'other-0001',
    ]);

    ids.reset();
    expect(ids.next('app')).toBe('app-0001');
  });
});
