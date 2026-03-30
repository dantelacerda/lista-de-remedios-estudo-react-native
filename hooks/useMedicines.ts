// Hooks de dados para remédios usando TanStack Query.
// Cada hook encapsula uma operação: listar, buscar por id, criar, atualizar e deletar.
// O TanStack Query cuida do cache, loading e refetch automático.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  medicinesApi,
  CreateMedicineInput,
  UpdateMedicineInput,
} from '@/services/medicinesApi';

// Chave de cache usada por todas as queries de remédios
const MEDICINES_KEY = 'medicines' as const;

/** Busca todos os remédios. Usado na tela inicial. */
export function useMedicinesList() {
  return useQuery({
    queryKey: [MEDICINES_KEY],
    queryFn: medicinesApi.getAll,
  });
}

/** Busca um remédio pelo ID. Usado na tela de edição. */
export function useMedicineDetail(id: string) {
  return useQuery({
    queryKey: [MEDICINES_KEY, id],
    queryFn: () => medicinesApi.getById(id),
    enabled: !!id,
  });
}

/** Cria um novo remédio. Após sucesso, invalida o cache da lista. */
export function useCreateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMedicineInput) => medicinesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICINES_KEY] });
    },
  });
}

/** Atualiza um remédio pelo ID. Após sucesso, invalida o cache da lista e do item. */
export function useUpdateMedicine(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateMedicineInput) => medicinesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICINES_KEY] });
    },
  });
}

/** Deleta um remédio pelo ID. Após sucesso, invalida o cache da lista. */
export function useDeleteMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicinesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICINES_KEY] });
    },
  });
}
