'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { providers, specialties, regions, languages } from '@/lib/data';
import { ProviderCard } from '@/components/ProviderCard';
import { Search, SlidersHorizontal, X, WifiOff } from 'lucide-react';
import { clsx } from 'clsx';

function ProvidersContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || 'All Specialties');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedAvailability, setSelectedAvailability] = useState(searchParams.get('availability') || 'All');
  const [showFilters, setShowFilters] = useState(false);
  const [offlineOnly, setOfflineOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'availability'>('availability');

  useEffect(() => {
    const spec = searchParams.get('specialty');
    if (spec) setSelectedSpecialty(spec);
    const avail = searchParams.get('availability');
    if (avail) setSelectedAvailability(avail);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...providers];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.languages.some(l => l.toLowerCase().includes(q))
      );
    }
    if (selectedSpecialty !== 'All Specialties') result = result.filter(p => p.specialty === selectedSpecialty);
    if (selectedRegion !== 'All Regions') result = result.filter(p => p.region === selectedRegion);
    if (selectedLanguage !== 'All Languages') result = result.filter(p => p.languages.includes(selectedLanguage));
    if (selectedAvailability === 'available') result = result.filter(p => p.availability === 'available');
    if (offlineOnly) result = result.filter(p => p.acceptsOfflineBooking);
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.price - b.price;
      const order = { available: 0, busy: 1, offline: 2 };
      return order[a.availability] - order[b.availability];
    });
    return result;
  }, [query, selectedSpecialty, selectedRegion, selectedLanguage, selectedAvailability, offlineOnly, sortBy]);

  const activeFilterCount = [
    selectedSpecialty !== 'All Specialties',
    selectedRegion !== 'All Regions',
    selectedLanguage !== 'All Languages',
    selectedAvailability !== 'All',
    offlineOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedSpecialty('All Specialties');
    setSelectedRegion('All Regions');
    setSelectedLanguage('All Languages');
    setSelectedAvailability('All');
    setOfflineOnly(false);
    setQuery('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Find a Doctor</h1>
        <p className="text-slate-500 mt-1">
          {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} available
          {selectedSpecialty !== 'All Specialties' ? ` in ${selectedSpecialty}` : ''}
        </p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, specialty, language..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent shadow-sm"
            aria-label="Search providers" />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={clsx('flex items-center gap-2 px-4 py-3 rounded-2xl border font-medium text-sm transition-colors shadow-sm',
            showFilters || activeFilterCount > 0 ? 'bg-sky-500 text-white border-sky-500' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          )}>
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-white text-sky-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Specialty</label>
              <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                {specialties.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Region</label>
              <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                {regions.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Language</label>
              <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                {languages.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                <option value="availability">Availability</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Price</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedAvailability === 'available'}
                  onChange={e => setSelectedAvailability(e.target.checked ? 'available' : 'All')}
                  className="w-4 h-4 text-sky-500 rounded" />
                <span className="text-sm text-slate-700">Available now</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={offlineOnly} onChange={e => setOfflineOnly(e.target.checked)}
                  className="w-4 h-4 text-sky-500 rounded" />
                <span className="text-sm text-slate-700 flex items-center gap-1">
                  <WifiOff className="w-3.5 h-3.5" /> Offline booking
                </span>
              </label>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-sky-600 hover:underline font-medium flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['General Practice', 'Pediatrics', 'Mental Health', "Women's Health", 'Nutrition & Dietetics', 'Dermatology'].map(spec => (
          <button key={spec} onClick={() => setSelectedSpecialty(selectedSpecialty === spec ? 'All Specialties' : spec)}
            className={clsx('flex-shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-all',
              selectedSpecialty === spec ? 'bg-sky-500 text-white border-sky-500' : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300'
            )}>{spec}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No providers found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search query</p>
          <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-xl text-sm font-medium">Clear Filters</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(provider => <ProviderCard key={provider.id} provider={provider} />)}
        </div>
      )}
    </div>
  );
}

export default function ProvidersPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8"><div className="skeleton h-8 w-48 mb-6" /></div>}>
      <ProvidersContent />
    </Suspense>
  );
}
