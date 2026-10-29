import { http, HttpResponse } from 'msw';
import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';
import { DemoResetControl } from './DemoResetControl';

const meta = preview.meta({
  title: 'Components/DemoResetControl',
  component: DemoResetControl,
});

export const Default = meta.story({
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Reset demo data' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent(
      'Demo data restored: 12 pets, no applications.',
    );
  },
});

export const DisabledInProduction = meta.story({
  beforeEach({ msw }) {
    msw.use(
      http.post('/api/demo/reset', () =>
        HttpResponse.json(
          { statusCode: 404, error: 'Not Found', message: 'Cannot POST /api/demo/reset' },
          { status: 404 },
        ),
      ),
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Reset demo data' }));
    await expect(await canvas.findByText('Demo reset is disabled in this environment.')).toBeVisible();
  },
});
