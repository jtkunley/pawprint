import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';
import { makeApplication } from '../mocks/fixtures';
import { ApplicationConfirmation } from './ApplicationConfirmation';

const meta = preview.meta({
  title: 'Components/ApplicationConfirmation',
  component: ApplicationConfirmation,
  args: { application: makeApplication() },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
});

export const Default = meta.story({
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { name: 'Application received!' });
    await expect(heading).toHaveFocus();
    await expect(canvas.getByText('app-0001')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Browse more pets' })).toHaveAttribute('href', '/');
  },
});
