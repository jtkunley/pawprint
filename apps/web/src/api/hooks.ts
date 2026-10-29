import type { PetQuery } from '@pawprint/contracts';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

export const petKeys = {
  all: ['pets'] as const,
  list: (query: PetQuery) => [...petKeys.all, 'list', query] as const,
  detail: (id: string) => [...petKeys.all, 'detail', id] as const,
};

export function usePets(query: PetQuery) {
  return useQuery({
    queryKey: petKeys.list(query),
    queryFn: ({ signal }) => api.listPets(query, signal),
    placeholderData: keepPreviousData,
  });
}

export function usePet(id: string) {
  return useQuery({
    queryKey: petKeys.detail(id),
    queryFn: ({ signal }) => api.getPet(id, signal),
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.submitApplication,
    // Submitting can move a pet from "available" to "pending".
    onSuccess: () => queryClient.invalidateQueries({ queryKey: petKeys.all }),
  });
}

export function useResetDemo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.resetDemo,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
