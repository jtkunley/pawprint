import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './client';

export function createQueryClient(options: { retry?: boolean } = {}): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Retry network and server errors once; client errors (4xx) will not fix themselves.
        retry: options.retry === false
          ? false
          : (failureCount, error) =>
              failureCount < 1 && !(error instanceof ApiError && error.status >= 400 && error.status < 500),
      },
    },
  });
}
