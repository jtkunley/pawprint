import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import { createQueryClient } from './api/query-client';
import { Layout } from './components/Layout';
import { StateMessage } from './components/StateMessage';
import { CatalogPage } from './pages/CatalogPage';
import { PetDetailPage } from './pages/PetDetailPage';

export function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/pets/:petId" element={<PetDetailPage />} />
        <Route
          path="*"
          element={
            <StateMessage
              headingLevel="h1"
              title="Page not found"
              action={
                <Link to="/" className="button button--primary">
                  Browse all pets
                </Link>
              }
            />
          }
        />
      </Routes>
    </Layout>
  );
}

export function App() {
  const [queryClient] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
