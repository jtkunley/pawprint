import type { Pet } from '@pawprint/contracts';
import { Link } from 'react-router';
import { formatAge, speciesLabels } from '../lib/format';
import { PetImage } from './PetImage';
import { StatusBadge } from './StatusBadge';

export function PetCard({ pet }: { pet: Pet }) {
  return (
    <article className="pet-card" aria-labelledby={`pet-${pet.id}-name`}>
      <PetImage pet={pet} />
      <div className="pet-card__body">
        <StatusBadge status={pet.status} />
        <h3 className="pet-card__name" id={`pet-${pet.id}-name`}>
          {/* The link stretches over the whole card via CSS so the card is one large target. */}
          <Link to={`/pets/${pet.id}`} className="pet-card__link">
            {pet.name}
          </Link>
        </h3>
        <p className="pet-card__meta">
          {speciesLabels[pet.species]} · {pet.breed} · {formatAge(pet.ageMonths)}
        </p>
      </div>
    </article>
  );
}

export function PetCardSkeleton() {
  return (
    <div className="pet-card pet-card--skeleton" aria-hidden="true">
      <div className="pet-image pet-image--card skeleton" />
      <div className="pet-card__body">
        <div className="skeleton skeleton--badge" />
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--text" />
      </div>
    </div>
  );
}

export function PetGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="pet-grid" aria-busy="true">
      <p className="visually-hidden" role="status">
        Loading pets…
      </p>
      {Array.from({ length: count }, (_, index) => (
        <PetCardSkeleton key={index} />
      ))}
    </div>
  );
}
