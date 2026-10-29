import type { Pet } from '@pawprint/contracts';
import { useState } from 'react';
import { PawIcon } from './PawIcon';

interface PetImageProps {
  pet: Pick<Pet, 'name' | 'species' | 'imageUrl'>;
  variant?: 'card' | 'hero';
}

/** Shows the pet photo, or a friendly placeholder when it is missing or fails to load. */
export function PetImage({ pet, variant = 'card' }: PetImageProps) {
  const [failed, setFailed] = useState(false);
  const className = `pet-image pet-image--${variant} pet-image--${pet.species}`;

  if (!pet.imageUrl || failed) {
    return (
      <div
        className={`${className} pet-image--missing`}
        role="img"
        aria-label={`No photo of ${pet.name} yet`}
      >
        <PawIcon size={variant === 'hero' ? 56 : 40} />
        <span aria-hidden="true">Photo coming soon</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={pet.imageUrl}
        alt={`Photo of ${pet.name}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
