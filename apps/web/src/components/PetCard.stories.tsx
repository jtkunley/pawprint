import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';
import { adoptedPet, availablePet, longNamePet, makePet, pendingPet } from '../mocks/fixtures';
import { PetCard, PetCardSkeleton, PetGridSkeleton } from './PetCard';

const meta = preview.meta({
  title: 'Components/PetCard',
  component: PetCard,
  args: { pet: availablePet },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 300 }}>
        <Story />
      </div>
    ),
  ],
});

export const Available = meta.story({
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Available')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Biscuit' })).toHaveAttribute('href', '/pets/pet-001');
  },
});

export const Pending = meta.story({
  args: { pet: pendingPet },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Adoption pending')).toBeVisible();
  },
});

export const Adopted = meta.story({
  args: { pet: adoptedPet },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Adopted')).toBeVisible();
  },
});

export const LongNameAndMissingImage = meta.story({
  args: { pet: longNamePet },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('img', { name: `No photo of ${longNamePet.name} yet` }),
    ).toBeVisible();
    await expect(canvas.getByRole('link', { name: longNamePet.name })).toBeVisible();
  },
});

export const BrokenImageUrl = meta.story({
  args: { pet: makePet({ name: 'Ghost', imageUrl: '/images/pets/does-not-exist.png' }) },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('img', { name: 'No photo of Ghost yet' })).toBeVisible();
  },
});

export const Skeleton = meta.story({
  render: () => <PetCardSkeleton />,
});

export const GridSkeleton = meta.story({
  decorators: [(Story) => <div style={{ width: 'min(960px, 100%)' }}><Story /></div>],
  render: () => <PetGridSkeleton count={3} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading pets…');
  },
});
