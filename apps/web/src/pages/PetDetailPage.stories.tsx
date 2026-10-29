import { expect, within } from 'storybook/test';
import preview from '../../.storybook/preview';
import { AppRoutes } from '../App';
import { applicationHandlers, petHandlers } from '../mocks/handlers';
import { PetDetailPage } from './PetDetailPage';

const meta = preview.meta({
  title: 'Pages/PetDetail',
  component: PetDetailPage,
  render: () => <AppRoutes />,
  parameters: { layout: 'fullscreen', route: '/pets/pet-001' },
});

export const Available = meta.story({
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { level: 1, name: 'Biscuit' })).toBeVisible();
    await expect(canvas.getByRole('form', { name: 'Apply to adopt Biscuit' })).toBeVisible();
  },
});

export const LongNameWithoutPhoto = meta.story({
  parameters: { route: '/pets/pet-006' },
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole('img', { name: 'No photo of Sir Reginald Wigglesworth-Fluffington III yet' }),
    ).toBeVisible();
  },
});

export const Adopted = meta.story({
  parameters: { route: '/pets/pet-005' },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: 'Juniper has found a home' })).toBeVisible();
    await expect(canvas.queryByRole('form')).not.toBeInTheDocument();
  },
});

export const Loading = meta.story({
  beforeEach({ msw }) {
    msw.use(petHandlers.detailLoading());
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading pet details…')).toBeInTheDocument();
  },
});

export const NotFound = meta.story({
  parameters: { route: '/pets/pet-999' },
  play: async ({ canvas }) => {
    const alert = await canvas.findByRole('alert');
    await expect(alert).toHaveTextContent('We couldn’t find that pet');
    await expect(within(alert).getByRole('link', { name: 'Browse all pets' })).toBeVisible();
  },
});

export const ApiError = meta.story({
  beforeEach({ msw }) {
    msw.use(petHandlers.detailError());
  },
  play: async ({ canvas }) => {
    const alert = await canvas.findByRole('alert');
    await expect(alert).toHaveTextContent('We couldn’t load this pet');
    await expect(within(alert).getByRole('button', { name: 'Try again' })).toBeVisible();
  },
});

export const FormValidation = meta.story({
  play: async ({ canvas, userEvent }) => {
    const form = await canvas.findByRole('form', { name: 'Apply to adopt Biscuit' });
    await userEvent.type(within(form).getByLabelText('Email'), 'not-an-email');
    await userEvent.click(within(form).getByRole('button', { name: 'Send application' }));

    await expect(within(form).getByText('Enter a valid email address')).toBeVisible();
    await expect(within(form).getByLabelText('Full name')).toHaveFocus();
  },
});

export const SuccessfulSubmission = meta.story({
  play: async ({ canvas, userEvent, step }) => {
    const form = await canvas.findByRole('form', { name: 'Apply to adopt Biscuit' });

    await step('Fill in the application', async () => {
      await userEvent.type(within(form).getByLabelText('Full name'), 'Jordan Rivera');
      await userEvent.type(within(form).getByLabelText('Email'), 'jordan@example.com');
      await userEvent.click(within(form).getByLabelText('House'));
      await userEvent.type(
        within(form).getByLabelText('Why would you be a great match?'),
        'We have a fenced yard and love long weekend walks.',
      );
    });

    await step('Submit', async () => {
      await userEvent.click(within(form).getByRole('button', { name: 'Send application' }));
      await expect(within(form).getByRole('button', { name: 'Sending application…' })).toBeDisabled();
    });

    const heading = await canvas.findByRole('heading', { name: 'Application received!' });
    await expect(heading).toHaveFocus();
    await expect(canvas.getByText('jordan@example.com')).toBeVisible();
    await expect(canvas.queryByRole('form')).not.toBeInTheDocument();
  },
});

export const ServerValidationError = meta.story({
  beforeEach({ msw }) {
    msw.use(applicationHandlers.rejectEmail());
  },
  play: async ({ canvas, userEvent }) => {
    const form = await canvas.findByRole('form', { name: 'Apply to adopt Biscuit' });
    await userEvent.type(within(form).getByLabelText('Full name'), 'Jordan Rivera');
    await userEvent.type(within(form).getByLabelText('Email'), 'blocked@example.com');
    await userEvent.click(within(form).getByLabelText('House'));
    await userEvent.type(
      within(form).getByLabelText('Why would you be a great match?'),
      'We have a fenced yard and love long weekend walks.',
    );
    await userEvent.click(within(form).getByRole('button', { name: 'Send application' }));

    await expect(await within(form).findByText('This email address has been blocked')).toBeVisible();
  },
});

export const AlreadyAdoptedConflict = meta.story({
  beforeEach({ msw }) {
    msw.use(applicationHandlers.conflict());
  },
  play: async ({ canvas, userEvent }) => {
    const form = await canvas.findByRole('form', { name: 'Apply to adopt Biscuit' });
    await userEvent.type(within(form).getByLabelText('Full name'), 'Jordan Rivera');
    await userEvent.type(within(form).getByLabelText('Email'), 'jordan@example.com');
    await userEvent.click(within(form).getByLabelText('House'));
    await userEvent.type(
      within(form).getByLabelText('Why would you be a great match?'),
      'We have a fenced yard and love long weekend walks.',
    );
    await userEvent.click(within(form).getByRole('button', { name: 'Send application' }));

    await expect(await within(form).findByRole('alert')).toHaveTextContent(
      'Biscuit has already been adopted',
    );
  },
});
