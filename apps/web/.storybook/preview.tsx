import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import { definePreview } from '@storybook/react-vite';
import { QueryClientProvider } from '@tanstack/react-query';
import addonMsw from 'msw-storybook-addon';
import { type ReactNode, useState } from 'react';
import { MemoryRouter } from 'react-router';
import { createQueryClient } from '../src/api/query-client';
import { defaultHandlers } from '../src/mocks/handlers';
import '../src/styles.css';

/** Each story gets an isolated query cache and an in-memory router starting at `parameters.route`. */
function StoryProviders({ route, children }: { route: string; children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient({ retry: false }));
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

export default definePreview({
  addons: [addonDocs(), addonA11y(), addonMsw()],
  parameters: {
    layout: 'padded',
    // Fail Storybook tests on any axe violation.
    a11y: { test: 'error' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  beforeEach({ msw }) {
    msw.use(...defaultHandlers);
  },
  decorators: [
    (Story, { parameters }) => (
      <StoryProviders route={typeof parameters.route === 'string' ? parameters.route : '/'}>
        <Story />
      </StoryProviders>
    ),
  ],
});
