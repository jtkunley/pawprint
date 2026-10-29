import type { AdoptionApplication, Pet } from '@pawprint/contracts';

export function makePet(overrides: Partial<Pet> = {}): Pet {
  return {
    id: 'pet-001',
    name: 'Biscuit',
    species: 'dog',
    breed: 'Beagle mix',
    ageMonths: 26,
    sex: 'male',
    size: 'medium',
    status: 'available',
    description:
      'Biscuit is a cheerful nose-first explorer who loves sniff walks, squeaky toys, and an evening cuddle.',
    traits: ['Good with kids', 'House-trained', 'Loves walks'],
    imageUrl: '/images/pets/dog.svg',
    intakeDate: '2026-08-12',
    ...overrides,
  };
}

export const availablePet = makePet();

export const pendingPet = makePet({
  id: 'pet-003',
  name: 'Clover',
  species: 'rabbit',
  breed: 'Holland Lop',
  ageMonths: 18,
  sex: 'female',
  size: 'small',
  status: 'pending',
  description: 'Clover is a gentle lop-eared bunny who enjoys fresh greens and cardboard castles.',
  traits: ['Gentle', 'Litter-trained'],
  imageUrl: '/images/pets/rabbit.svg',
  intakeDate: '2026-07-21',
});

export const adoptedPet = makePet({
  id: 'pet-005',
  name: 'Juniper',
  breed: 'Labrador retriever',
  ageMonths: 84,
  sex: 'female',
  size: 'large',
  status: 'adopted',
  description: 'Juniper is a calm senior who has found her forever couch.',
  traits: ['Calm', 'Senior'],
  intakeDate: '2026-02-11',
});

export const longNamePet = makePet({
  id: 'pet-006',
  name: 'Sir Reginald Wigglesworth-Fluffington III',
  species: 'cat',
  breed: 'Maine Coon',
  ageMonths: 60,
  size: 'large',
  description: 'A dignified gentleman with an impressive mane and an even more impressive purr.',
  traits: ['Affectionate', 'Vocal'],
  imageUrl: null,
  intakeDate: '2026-05-19',
});

export const catPet = makePet({
  id: 'pet-002',
  name: 'Mochi',
  species: 'cat',
  breed: 'Domestic shorthair',
  ageMonths: 14,
  sex: 'female',
  size: 'small',
  description: 'Mochi is playful and curious, then naps in the nearest sunbeam.',
  traits: ['Playful', 'Indoor only'],
  imageUrl: '/images/pets/cat.svg',
  intakeDate: '2026-09-03',
});

export const birdPet = makePet({
  id: 'pet-004',
  name: 'Captain',
  species: 'bird',
  breed: 'Cockatiel',
  ageMonths: 40,
  size: 'small',
  description: 'Captain whistles the first few notes of every song he has ever heard.',
  traits: ['Talkative', 'Hand-tame'],
  imageUrl: '/images/pets/bird.svg',
  intakeDate: '2026-06-30',
});

export const allPets: Pet[] = [availablePet, catPet, pendingPet, birdPet, adoptedPet, longNamePet];

export function makeApplication(overrides: Partial<AdoptionApplication> = {}): AdoptionApplication {
  return {
    id: 'app-0001',
    petId: availablePet.id,
    petName: availablePet.name,
    applicantName: 'Jordan Rivera',
    email: 'jordan@example.com',
    homeType: 'house',
    hasOtherPets: false,
    message: 'We have a fenced yard and love long weekend walks.',
    status: 'received',
    submittedAt: '2026-10-28T12:00:00.000Z',
    ...overrides,
  };
}
