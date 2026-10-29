import {
  AdoptionStatusSchema,
  type PetQuery,
  PetSortSchema,
  SpeciesSchema,
} from '@pawprint/contracts';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { usePets } from '../api/hooks';
import {
  CatalogFilters,
  EMPTY_FILTERS,
  hasActiveFilters,
  type PetFilters,
} from '../components/CatalogFilters';
import { PetCard, PetGridSkeleton } from '../components/PetCard';
import { StateMessage } from '../components/StateMessage';

/** Reads filters from the URL, ignoring values that are not valid options. */
function readFilters(params: URLSearchParams): PetFilters {
  return {
    search: params.get('search') ?? '',
    species: SpeciesSchema.safeParse(params.get('species')).data ?? '',
    status: AdoptionStatusSchema.safeParse(params.get('status')).data ?? '',
    sort: PetSortSchema.safeParse(params.get('sort')).data ?? EMPTY_FILTERS.sort,
  };
}

function toSearchParams(filters: PetFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.species) params.set('species', filters.species);
  if (filters.status) params.set('status', filters.status);
  if (filters.sort !== EMPTY_FILTERS.sort) params.set('sort', filters.sort);
  return params;
}

function toQuery(filters: PetFilters): PetQuery {
  return {
    search: filters.search.trim() || undefined,
    species: filters.species || undefined,
    status: filters.status || undefined,
    sort: filters.sort === EMPTY_FILTERS.sort ? undefined : filters.sort,
  };
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);
  const pets = usePets(toQuery(filters));

  const updateFilters = useCallback(
    (next: PetFilters) => setParams(toSearchParams(next), { replace: true }),
    [setParams],
  );
  const clearFilters = () => updateFilters({ ...EMPTY_FILTERS, sort: filters.sort });

  let results;
  if (pets.isPending) {
    results = <PetGridSkeleton />;
  } else if (!pets.data) {
    results = (
      <StateMessage
        tone="error"
        title="We couldn’t load the pets"
        action={
          <button type="button" className="button button--primary" onClick={() => pets.refetch()}>
            Try again
          </button>
        }
      >
        <p>Something went wrong while talking to the server. Please try again in a moment.</p>
      </StateMessage>
    );
  } else if (pets.data.total === 0) {
    results = (
      <StateMessage
        title="No pets match your search"
        action={
          hasActiveFilters(filters) && (
            <button type="button" className="button button--secondary" onClick={clearFilters}>
              Show all pets
            </button>
          )
        }
      >
        <p>Try a different name or widen your filters. New friends arrive every week!</p>
      </StateMessage>
    );
  } else {
    results = (
      <ul className="pet-grid" aria-busy={pets.isPlaceholderData} aria-labelledby="results-title">
        {pets.data.items.map((pet) => (
          <li key={pet.id}>
            <PetCard pet={pet} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <title>Pawprint · Find a pet to adopt</title>
      <section className="hero" aria-labelledby="catalog-title">
        <h1 id="catalog-title">Meet your new best friend</h1>
        <p>Browse dogs, cats, rabbits, and birds who are looking for a loving home.</p>
      </section>

      <CatalogFilters filters={filters} onChange={updateFilters} />

      <h2 id="results-title" className="visually-hidden">
        Results
      </h2>
      <p className="results-summary" role="status">
        {pets.data && `${pets.data.total} ${pets.data.total === 1 ? 'pet' : 'pets'} found`}
      </p>

      {results}
    </>
  );
}
