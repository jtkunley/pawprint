import { expect, fn } from 'storybook/test';
import preview from '../../.storybook/preview';
import { ApiError } from '../api/client';
import { availablePet, longNamePet } from '../mocks/fixtures';
import { AdoptionForm } from './AdoptionForm';

const meta = preview.meta({
  title: 'Components/AdoptionForm',
  component: AdoptionForm,
  args: { pet: availablePet, onSubmit: fn() },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
});

export const Empty = meta.story({});

export const ValidationErrors = meta.story({
  play: async ({ args, canvas, userEvent, step }) => {
    await step('Submit the empty form', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Send application' }));
    });

    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(canvas.getByText('Enter your full name')).toBeVisible();
    await expect(canvas.getByText('Enter a valid email address')).toBeVisible();
    await expect(canvas.getByText('Choose the type of home you live in')).toBeVisible();
    await expect(canvas.getByText('Tell us a little more (at least 20 characters)')).toBeVisible();

    const name = canvas.getByLabelText('Full name');
    await expect(name).toHaveFocus();
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAccessibleDescription('Enter your full name');

    await step('Fixing a field clears its error', async () => {
      await userEvent.type(name, 'Jordan Rivera');
      await expect(canvas.queryByText('Enter your full name')).not.toBeInTheDocument();
      await expect(canvas.getByText('Enter a valid email address')).toBeVisible();
    });
  },
});

export const ValidSubmission = meta.story({
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Full name'), '  Jordan Rivera ');
    await userEvent.type(canvas.getByLabelText('Email'), 'jordan@example.com');
    await userEvent.click(canvas.getByLabelText('Apartment'));
    await userEvent.click(canvas.getByLabelText('I have other pets at home'));
    await userEvent.type(
      canvas.getByLabelText('Why would you be a great match?'),
      'I work from home and walk twice a day.',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Send application' }));

    await expect(args.onSubmit).toHaveBeenCalledWith({
      petId: 'pet-001',
      applicantName: 'Jordan Rivera',
      email: 'jordan@example.com',
      homeType: 'apartment',
      hasOtherPets: true,
      message: 'I work from home and walk twice a day.',
    });
  },
});

export const Submitting = meta.story({
  args: { isSubmitting: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Sending application…' })).toBeDisabled();
  },
});

export const ServerValidationError = meta.story({
  args: {
    error: new ApiError(400, {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      issues: [{ path: 'email', message: 'This email address has been blocked' }],
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Email')).toHaveAccessibleDescription(
      'This email address has been blocked',
    );
  },
});

export const AlreadyAdoptedError = meta.story({
  args: {
    error: new ApiError(409, {
      statusCode: 409,
      error: 'Conflict',
      message: 'Biscuit has already been adopted',
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Biscuit has already been adopted');
  },
});

export const NetworkError = meta.story({
  args: { error: new ApiError(0, null) },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(/check your connection/);
  },
});

export const LongPetName = meta.story({
  args: { pet: longNamePet },
});
