export interface Medicine {
  id: number;
  name: string;
  expiry_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMedicineInput {
  name: string;
  expiry_date?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
