import { expect, waitFor, within } from 'storybook/test';
import preview from '../../.storybook/preview';
import { AppRoutes } from '../App';
import { petHandlers } from '../mocks/handlers';
import { CatalogPage } from './CatalogPage';

const meta = preview.meta({
  title: 'Pages/Catalog',
  component: CatalogPage,
  // Render the real routes so links into the detail page work.
  render: () => <AppRoutes />,
  parameters: { layout: 'fullscreen', route: '/' },
});

const cardNames = (canvasElement: HTMLElement) =>
  within(within(canvasElement).getByRole('list', { name: 'Results' }))
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent);

export const Default = meta.story({
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('6 pets found')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Biscuit' })).toBeVisible();
  },
});

export const Loading = meta.story({
  beforeEach({ msw }) {
    msw.use(petHandlers.loading());
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading pets…')).toBeInTheDocument();
  },
});

export const EmptyResults = meta.story({
  parameters: { route: '/?search=zzz' },
  play: async ({ canvas, userEvent }) => {
    await expect(await canvas.findByRole('heading', { name: 'No pets match your search' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Show all pets' }));
    await expect(await canvas.findByText('6 pets found')).toBeVisible();
    await expect(canvas.getByLabelText('Search by name')).toHaveValue('');
  },
});

export const EmptyCatalog = meta.story({
  beforeEach({ msw }) {
    msw.use(petHandlers.list([]));
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: 'No pets match your search' })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Show all pets' })).not.toBeInTheDocument();
  },
});

export const ApiError = meta.story({
  beforeEach({ msw }) {
    msw.use(petHandlers.error());
  },
  play: async ({ canvas }) => {
    const alert = await canvas.findByRole('alert');
    await expect(alert).toHaveTextContent('We couldn’t load the pets');
    await expect(within(alert).getByRole('button', { name: 'Try again' })).toBeVisible();
  },
});

export const Filtering = meta.story({
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    await canvas.findByText('6 pets found');

    await step('Filter by species', async () => {
      await userEvent.selectOptions(canvas.getByLabelText('Species'), 'Cat');
      await expect(await canvas.findByText('2 pets found')).toBeVisible();
      await expect(cardNames(canvasElement)).toEqual([
        'Mochi',
        'Sir Reginald Wigglesworth-Fluffington III',
      ]);
    });

    await step('Search by name', async () => {
      await userEvent.type(canvas.getByLabelText('Search by name'), 'moc');
      await expect(await canvas.findByText('1 pet found')).toBeVisible();
      await expect(cardNames(canvasElement)).toEqual(['Mochi']);
    });

    await step('Filter by status with no matches', async () => {
      await userEvent.selectOptions(canvas.getByLabelText('Status'), 'Adopted');
      await expect(await canvas.findByRole('heading', { name: 'No pets match your search' })).toBeVisible();
    });

    await step('Clear filters', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
      await waitFor(() => expect(cardNames(canvasElement)).toHaveLength(6));
    });
  },
});

export const OpeningDetails = meta.story({
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('link', { name: 'Clover' }));

    await expect(await canvas.findByRole('heading', { level: 1, name: 'Clover' })).toBeVisible();
    await expect(canvas.getByText('Holland Lop', { exact: false })).toBeVisible();
    await expect(canvas.getByRole('form', { name: 'Apply to adopt Clover' })).toBeVisible();
  },
});
