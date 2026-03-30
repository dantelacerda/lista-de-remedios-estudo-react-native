import { useState, useCallback, useEffect } from 'react';
import { Medicine, CreateMedicineInput } from '../types/medicine';
import { medicinesService } from '../services/medicines';

interface UseMedicinesState {
  medicines: Medicine[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
}

export function useMedicines() {
  const [state, setState] = useState<UseMedicinesState>({
    medicines: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchMedicines = useCallback(async (page: number = 1) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      console.log(`[Fetch] Iniciando fetch de medicamentos (página ${page})`);
      const response = await medicinesService.getMedicines(page, 50);
      console.log(`[Fetch] Medicamentos carregados: ${response.data.length} de ${response.total}`);
      setState({
        medicines: response.data,
        loading: false,
        error: null,
        currentPage: response.current_page,
        totalPages: response.last_page,
        total: response.total,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar remédios';
      console.error('[Fetch] Erro:', errorMsg);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg,
      }));
    }
  }, []);

  const createMedicine = useCallback(async (input: CreateMedicineInput) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const newMedicine = await medicinesService.createMedicine(input);
      setState((prev) => ({
        ...prev,
        medicines: [newMedicine, ...prev.medicines],
        loading: false,
        error: null,
      }));
      return newMedicine;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar remédio';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg,
      }));
      throw err;
    }
  }, []);

  const deleteMedicine = useCallback(async (id: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      console.log(`[Delete] Iniciando deleção do medicamento ${id}`);
      await medicinesService.deleteMedicine(id);
      console.log(`[Delete] Medicamento ${id} deletado com sucesso da API`);
      setState((prev) => {
        const filtered = prev.medicines.filter((m) => m.id !== id);
        console.log(`[Delete] Estado atualizado. Medicamentos restantes: ${filtered.length}`);
        return {
          ...prev,
          medicines: filtered,
          loading: false,
          error: null,
        };
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar remédio';
      console.error(`[Delete] Erro ao deletar medicamento ${id}:`, errorMsg);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg,
      }));
      throw err;
    }
  }, []);

  const updateMedicine = useCallback(
    async (id: number, input: Partial<CreateMedicineInput>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const updated = await medicinesService.updateMedicine(id, input);
        setState((prev) => ({
          ...prev,
          medicines: prev.medicines.map((m) => (m.id === id ? updated : m)),
          loading: false,
          error: null,
        }));
        return updated;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar remédio';
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    fetchMedicines();
  }, []);

  return {
    ...state,
    fetchMedicines,
    createMedicine,
    deleteMedicine,
    updateMedicine,
  };
}
