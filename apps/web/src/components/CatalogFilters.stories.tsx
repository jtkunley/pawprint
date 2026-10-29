import { useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import preview from '../../.storybook/preview';
import { CatalogFilters, EMPTY_FILTERS, type PetFilters } from './CatalogFilters';

const meta = preview.meta({
  title: 'Components/CatalogFilters',
  component: CatalogFilters,
  args: { filters: EMPTY_FILTERS, onChange: fn(), debounceMs: 50 },
  // Keep filter state in the story so the controls behave like they do on the page.
  render: function Render(args) {
    const [filters, setFilters] = useState<PetFilters>(args.filters);
    return (
      <CatalogFilters
        {...args}
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          args.onChange(next);
        }}
      />
    );
  },
});

export const Default = meta.story({});

export const WithActiveFilters = meta.story({
  args: { filters: { search: 'mo', species: 'cat', status: 'available', sort: 'newest' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Clear filters' })).toBeVisible();
  },
});

export const ChangingFilters = meta.story({
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.selectOptions(canvas.getByLabelText('Species'), 'Cat');
    await expect(args.onChange).toHaveBeenLastCalledWith({ ...EMPTY_FILTERS, species: 'cat' });

    await userEvent.type(canvas.getByLabelText('Search by name'), 'Mochi');
    await waitFor(() =>
      expect(args.onChange).toHaveBeenLastCalledWith({ ...EMPTY_FILTERS, species: 'cat', search: 'Mochi' }),
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(EMPTY_FILTERS);
    await expect(canvas.getByLabelText('Search by name')).toHaveValue('');
  },
});
