import type { Pet } from '@pawprint/contracts';
import { formatAge, formatDate, formatSize, speciesLabels } from '../lib/format';
import { PetImage } from './PetImage';
import { StatusBadge } from './StatusBadge';

export function PetDetails({ pet }: { pet: Pet }) {
  return (
    <article className="pet-details" aria-labelledby="pet-details-name">
      <PetImage pet={pet} variant="hero" />
      <div className="pet-details__body">
        <StatusBadge status={pet.status} />
        <h1 id="pet-details-name" className="pet-details__name">
          {pet.name}
        </h1>
        <p className="pet-details__breed">
          {speciesLabels[pet.species]} · {pet.breed}
        </p>
        <p className="pet-details__description">{pet.description}</p>

        <dl className="facts">
          <div>
            <dt>Age</dt>
            <dd>{formatAge(pet.ageMonths)}</dd>
          </div>
          <div>
            <dt>Sex</dt>
            <dd>{pet.sex === 'female' ? 'Female' : 'Male'}</dd>
          </div>
          <div>
            <dt>Size</dt>
            <dd>{formatSize(pet.size)}</dd>
          </div>
          <div>
            <dt>With us since</dt>
            <dd>{formatDate(pet.intakeDate)}</dd>
          </div>
        </dl>

        {pet.traits.length > 0 && (
          <>
            <h2 className="visually-hidden">Personality</h2>
            <ul className="traits">
              {pet.traits.map((trait) => (
                <li key={trait}>{trait}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}

export function PetDetailsSkeleton() {
  return (
    <div className="pet-details" aria-busy="true">
      <p className="visually-hidden" role="status">
        Loading pet details…
      </p>
      <div className="pet-image pet-image--hero skeleton" aria-hidden="true" />
      <div className="pet-details__body" aria-hidden="true">
        <div className="skeleton skeleton--badge" />
        <div className="skeleton skeleton--heading" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--paragraph" />
      </div>
    </div>
  );
}
