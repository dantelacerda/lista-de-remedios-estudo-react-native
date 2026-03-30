// Toda comunicação com a API de remédios está centralizada aqui.
// Os hooks em @/hooks/useMedicines.ts consomem estas funções.

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// --- Tipos ---

export interface Medicine {
  id: number;
  name: string;
  expiry_date?: string;
  created_at?: string;
}

export interface CreateMedicineInput {
  name: string;
  expiry_date?: string;
}

export interface UpdateMedicineInput {
  name: string;
  expiry_date?: string;
}

// --- Helpers ---

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// --- Funções da API ---

export const medicinesApi = {
  getAll: async (): Promise<Medicine[]> => {
    const response = await fetch(`${API_BASE_URL}/medicines?per_page=100`);
    const body = await handleResponse<{ data: Medicine[] }>(response);
    return body.data;
  },

  getById: async (id: string): Promise<Medicine> => {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`);
    // A API pode retornar { data: Medicine } ou Medicine diretamente
    const body = await handleResponse<{ data?: Medicine } & Medicine>(response);
    return body.data ?? (body as Medicine);
  },

  create: async (input: CreateMedicineInput): Promise<Medicine> => {
    const response = await fetch(`${API_BASE_URL}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Medicine>(response);
  },

  update: async (id: string, input: UpdateMedicineInput): Promise<Medicine> => {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Medicine>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
  },
};
