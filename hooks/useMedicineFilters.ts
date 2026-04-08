import { useState, useMemo } from 'react';
import type { Medicine } from '@/services/medicinesApi';

type DateSort = 'asc' | 'desc' | 'none';

interface UseMedicineFiltersReturn {
  filteredMedicines: Medicine[];
  nameQuery: string;
  setNameQuery: (query: string) => void;
  dateSort: DateSort;
  cycleDateSort: () => void;
  isFilterActive: boolean;
  clearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export function useMedicineFilters(medicines: Medicine[] | undefined): UseMedicineFiltersReturn {
  const [nameQuery, setNameQuery] = useState('');
  const [dateSort, setDateSort] = useState<DateSort>('none');

  const cycleDateSort = () => {
    setDateSort((current) => {
      if (current === 'none') return 'asc';
      if (current === 'asc') return 'desc';
      return 'none';
    });
  };

  const clearFilters = () => {
    setNameQuery('');
    setDateSort('none');
  };

  const isFilterActive = useMemo(
    () => nameQuery !== '' || dateSort !== 'none',
    [nameQuery, dateSort]
  );

  const totalCount = medicines?.length ?? 0;

  const filteredMedicines = useMemo(() => {
    if (!medicines) return [];

    let result = medicines;

    if (nameQuery.trim() !== '') {
      const lowerQuery = nameQuery.trim().toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(lowerQuery));
    }

    if (dateSort !== 'none') {
      result = [...result].sort((a, b) => {
        const hasA = !!a.expiry_date;
        const hasB = !!b.expiry_date;

        // Items without a date always go to the end
        if (!hasA && !hasB) return 0;
        if (!hasA) return 1;
        if (!hasB) return -1;

        const dateA = new Date(a.expiry_date!).getTime();
        const dateB = new Date(b.expiry_date!).getTime();

        return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }, [medicines, nameQuery, dateSort]);

  const filteredCount = filteredMedicines.length;

  return {
    filteredMedicines,
    nameQuery,
    setNameQuery,
    dateSort,
    cycleDateSort,
    isFilterActive,
    clearFilters,
    totalCount,
    filteredCount,
  };
}
