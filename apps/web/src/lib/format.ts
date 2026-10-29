import type { AdoptionStatus, HomeType, Pet, PetSort, Species } from '@pawprint/contracts';

export const speciesLabels: Record<Species, string> = {
  dog: 'Dog',
  cat: 'Cat',
  rabbit: 'Rabbit',
  bird: 'Bird',
};

export const statusLabels: Record<AdoptionStatus, string> = {
  available: 'Available',
  pending: 'Adoption pending',
  adopted: 'Adopted',
};

export const sortLabels: Record<PetSort, string> = {
  name: 'Name (A–Z)',
  youngest: 'Youngest first',
  oldest: 'Oldest first',
  newest: 'Newest arrivals',
};

export const homeTypeLabels: Record<HomeType, string> = {
  house: 'House',
  apartment: 'Apartment',
  other: 'Other',
};

const sizeLabels: Record<Pet['size'], string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export function formatAge(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'}`;
}

export function formatSize(size: Pet['size']): string {
  return sizeLabels[size];
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(isoDate),
  );
}
