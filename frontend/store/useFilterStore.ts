import { create } from 'zustand';

interface FilterState {
  search: string;
  operation: string; // 'all' | 'venta' | 'alquiler'
  type: string; // 'all' | 'casa' | 'departamento' | 'oficina' | 'terreno'
  location: string;
  minPrice: string;
  maxPrice: string;
  setSearch: (search: string) => void;
  setOperation: (op: string) => void;
  setType: (type: string) => void;
  setLocation: (loc: string) => void;
  setMinPrice: (price: string) => void;
  setMaxPrice: (price: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  operation: 'all',
  type: 'all',
  location: 'all',
  minPrice: '',
  maxPrice: '',

  setSearch: (search) => set({ search }),
  setOperation: (operation) => set({ operation }),
  setType: (type) => set({ type }),
  setLocation: (location) => set({ location }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),

  resetFilters: () =>
    set({
      search: '',
      operation: 'all',
      type: 'all',
      location: 'all',
      minPrice: '',
      maxPrice: '',
    }),
}));
