import {
  ADOPTION_STATUSES,
  type AdoptionStatus,
  PET_SORTS,
  type PetSort,
  SPECIES,
  type Species,
} from '@pawprint/contracts';
import { type FormEvent, useEffect, useId, useState } from 'react';
import { sortLabels, speciesLabels, statusLabels } from '../lib/format';

export interface PetFilters {
  search: string;
  species: Species | '';
  status: AdoptionStatus | '';
  sort: PetSort;
}

export const EMPTY_FILTERS: PetFilters = { search: '', species: '', status: '', sort: 'name' };

export const hasActiveFilters = (filters: PetFilters) =>
  Boolean(filters.search || filters.species || filters.status);

interface CatalogFiltersProps {
  filters: PetFilters;
  onChange: (filters: PetFilters) => void;
  /** Delay before typed search text is applied. */
  debounceMs?: number;
}

export function CatalogFilters({ filters, onChange, debounceMs = 250 }: CatalogFiltersProps) {
  const id = useId();
  const [searchText, setSearchText] = useState(filters.search);
  const [appliedSearch, setAppliedSearch] = useState(filters.search);

  // Keep the input in sync when the search is changed externally (e.g. "Clear filters").
  if (filters.search !== appliedSearch) {
    setAppliedSearch(filters.search);
    setSearchText(filters.search);
  }

  useEffect(() => {
    if (searchText === filters.search) return;
    const timer = setTimeout(() => onChange({ ...filters, search: searchText }), debounceMs);
    return () => clearTimeout(timer);
  }, [searchText, filters, onChange, debounceMs]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onChange({ ...filters, search: searchText });
  };

  return (
    <form className="filters" role="search" aria-label="Find a pet" onSubmit={handleSubmit}>
      <div className="field filters__search">
        <label htmlFor={`${id}-search`}>Search by name</label>
        <input
          id={`${id}-search`}
          type="search"
          value={searchText}
          placeholder="e.g. Biscuit"
          autoComplete="off"
          onChange={(event) => setSearchText(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor={`${id}-species`}>Species</label>
        <select
          id={`${id}-species`}
          value={filters.species}
          onChange={(event) =>
            onChange({ ...filters, species: event.target.value as Species | '' })
          }
        >
          <option value="">All species</option>
          {SPECIES.map((species) => (
            <option key={species} value={species}>
              {speciesLabels[species]}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor={`${id}-status`}>Status</label>
        <select
          id={`${id}-status`}
          value={filters.status}
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value as AdoptionStatus | '' })
          }
        >
          <option value="">Any status</option>
          {ADOPTION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor={`${id}-sort`}>Sort by</label>
        <select
          id={`${id}-sort`}
          value={filters.sort}
          onChange={(event) => onChange({ ...filters, sort: event.target.value as PetSort })}
        >
          {PET_SORTS.map((sort) => (
            <option key={sort} value={sort}>
              {sortLabels[sort]}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters(filters) && (
        <button
          type="button"
          className="button button--ghost filters__clear"
          onClick={() => onChange({ ...EMPTY_FILTERS, sort: filters.sort })}
        >
          Clear filters
        </button>
      )}
    </form>
  );
}
