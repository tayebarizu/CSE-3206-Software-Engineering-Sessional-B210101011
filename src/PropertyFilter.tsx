import React from 'react';
import { FilterState, PropertyCategory, ListingType } from '../types';
import {
  Search,
  SlidersHorizontal,
  Home,
  Building,
  MapPin,
  RefreshCw,
  Trees,
} from 'lucide-react';

interface PropertyFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  totalResults: number;
}

export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  filters,
  setFilters,
  onReset,
  totalResults,
}) => {
  const categories: { label: string; value: 'All' | PropertyCategory; icon: React.ReactNode }[] = [
    { label: 'All Properties', value: 'All', icon: null },
    { label: 'Houses & Villas', value: 'House', icon: <Home className="w-4 h-4" /> },
    { label: 'Apartments', value: 'Apartment', icon: <Building className="w-4 h-4" /> },
    { label: 'Plots & Land', value: 'Plot', icon: <Trees className="w-4 h-4" /> },
  ];

  const types: { label: string; value: 'All' | ListingType }[] = [
    { label: 'All Types', value: 'All' },
    { label: 'For Sale', value: 'Sell' },
    { label: 'For Rent', value: 'Rent' },
    { label: 'For Lease', value: 'Lease' },
  ];

  const locations = [
    'All Locations',
    'Lekki',
    'Ikoyi',
    'Banana Island',
    'Victoria Island',
    'Eko Atlantic',
    'Epe',
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-6 mb-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-5 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mr-2 hidden sm:inline-block">
          Category:
        </span>
        {categories.map((cat) => {
          const isActive = filters.category === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.value }))}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-brand-brown text-white shadow-md'
                  : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Filter Bar: Search, Type, Location, Sort */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
        
        {/* Search input */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search by title, location or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent text-stone-800 placeholder-stone-400 font-medium"
          />
        </div>

        {/* Listing Type Selector */}
        <div className="lg:col-span-3">
          <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => setFilters((prev) => ({ ...prev, type: t.value }))}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                  filters.type === t.value
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="lg:col-span-3 relative">
          <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filters.location}
            onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value === 'All Locations' ? 'All' : e.target.value }))}
            className="w-full pl-10 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown text-stone-800 font-medium appearance-none cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc === 'All Locations' ? 'All' : loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as FilterState['sortBy'],
              }))
            }
            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown text-stone-800 font-medium cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Recently Listed</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* Sub-bar: Result counter and Reset */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900 text-sm">{totalResults}</span>
          <span>Properties Available</span>
          {(filters.category !== 'All' ||
            filters.type !== 'All' ||
            filters.location !== 'All' ||
            filters.searchQuery !== '') && (
            <span className="text-brand-brown font-semibold">• Active Filters Applied</span>
          )}
        </div>

        {(filters.category !== 'All' ||
          filters.type !== 'All' ||
          filters.location !== 'All' ||
          filters.searchQuery !== '') && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 hover:text-brand-brown font-bold text-xs transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
