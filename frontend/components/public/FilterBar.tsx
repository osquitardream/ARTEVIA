'use client';

import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFilterStore } from '@/store/useFilterStore';

interface FilterBarProps {
  totalResults?: number;
}

export function FilterBar({ totalResults }: FilterBarProps) {
  const router = useRouter();
  const {
    location,
    operation,
    type,
    search,
    setLocation,
    setOperation,
    setType,
    setSearch,
    resetFilters,
  } = useFilterStore();

  const handleSearchClick = () => {
    router.push('/propiedades');
  };

  return (
    <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Filters Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:flex-1">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por distrito o zona..."
              value={search || (location !== 'all' ? location : '')}
              onChange={(e) => {
                setSearch(e.target.value);
                setLocation('all');
              }}
              className="w-full bg-white border border-slate-200 rounded-md px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#c89b5c] transition-colors"
            />
          </div>

          {/* Operation Select */}
          <div className="relative">
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#c89b5c] cursor-pointer appearance-none pr-8"
            >
              <option value="all">Venta / Alquiler</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
            <span className="absolute right-3 top-3 text-[10px] text-slate-400 pointer-events-none">▼</span>
          </div>

          {/* Property Type Select */}
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#c89b5c] cursor-pointer appearance-none pr-8"
            >
              <option value="all">Tipo de inmueble</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="oficina">Oficina</option>
              <option value="terreno">Terreno</option>
            </select>
            <span className="absolute right-3 top-3 text-[10px] text-slate-400 pointer-events-none">▼</span>
          </div>

          {/* Más Filtros Button */}
          <button
            onClick={handleSearchClick}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium px-4 py-2.5 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            Más filtros
          </button>
        </div>

        {/* Action Button & Counter */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          <button
            onClick={resetFilters}
            className="bg-[#c89b5c] hover:bg-[#b58a4b] text-white text-xs font-semibold px-5 py-2.5 rounded-md shadow-sm transition-all duration-300 flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Mostrar todo
          </button>

          {typeof totalResults === 'number' && (
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              {totalResults} {totalResults === 1 ? 'propiedad' : 'propiedades'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
