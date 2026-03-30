import { apiClient } from './api';
import {
  Medicine,
  CreateMedicineInput,
  PaginatedResponse,
} from '../types/medicine';

export const medicinesService = {
  async getMedicines(page: number = 1, perPage: number = 50) {
    const response = await apiClient.get<any>(
      `/medicines?page=${page}&per_page=${perPage}`
    );
    // A API retorna dados em um objeto diferente
    if (response.data && Array.isArray(response.data)) {
      return {
        data: response.data,
        current_page: response.pagination?.current_page || page,
        per_page: response.pagination?.per_page || perPage,
        total: response.pagination?.total || response.data.length,
        last_page: response.pagination?.last_page || 1,
      };
    }
    return response;
  },

  async getMedicineById(id: number) {
    const response = await apiClient.get<any>(`/medicines/${id}`);
    return response.data || response;
  },

  async createMedicine(input: CreateMedicineInput) {
    const response = await apiClient.post<any>('/medicines', input);
    return response.data || response;
  },

  async updateMedicine(id: number, input: Partial<CreateMedicineInput>) {
    const response = await apiClient.put<any>(`/medicines/${id}`, input);
    return response.data || response;
  },

  async deleteMedicine(id: number) {
    try {
      const response = await apiClient.delete<any>(`/medicines/${id}`);
      return response;
    } catch (error) {
      console.error(`Erro ao deletar medicamento ${id}:`, error);
      throw error;
    }
  },

  async getExpiringMedicines(
    days: number = 30,
    sortBy: string = 'expiry_date',
    includeExpired: boolean = false
  ) {
    const response = await apiClient.get<any>(
      `/medicines/expiring?days=${days}&sort_by=${sortBy}&include_expired=${includeExpired}`
    );
    // A API retorna dados em um objeto diferente
    if (response.data && Array.isArray(response.data)) {
      return {
        data: response.data,
        current_page: response.pagination?.current_page || 1,
        per_page: response.pagination?.per_page || 50,
        total: response.pagination?.total || response.data.length,
        last_page: response.pagination?.last_page || 1,
      };
    }
    return response;
  },
};
