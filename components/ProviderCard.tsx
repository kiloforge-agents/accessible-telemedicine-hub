'use client';

import { Provider } from '@/lib/data';
import { Star, MapPin, Clock, Globe, WifiOff, Wifi, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface ProviderCardProps {
  provider: Provider;
  compact?: boolean;
}

const avatarColors = [
  'from-sky-400 to-blue-500',
  'from-teal-400 to-emerald-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-indigo-400 to-blue-600',
];

export function ProviderCard({ provider }: ProviderCardProps) {
  const colorIdx = provider.id.charCodeAt(1) % avatarColors.length;
  const avatarGradient = avatarColors[colorIdx];

  return (
    <Link href={`/providers/${provider.id}`} className="block group">
      <div className="provider-card bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-sky-200 focus-within:ring-2 focus-within:ring-sky-400">
        <div className={clsx('px-4 py-2 flex items-center justify-between text-xs font-medium',
          provider.availability === 'available' ? 'bg-emerald-50' :
          provider.availability === 'busy' ? 'bg-amber-50' : 'bg-slate-50'
        )}>
          <div className="flex items-center gap-1.5">
            <div className={clsx('w-2 h-2 rounded-full',
              provider.availability === 'available' ? 'bg-emerald-500 animate-pulse' :
              provider.availability === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
            )} />
            <span className={clsx(
              provider.availability === 'available' ? 'text-emerald-700' :
              provider.availability === 'busy' ? 'text-amber-700' : 'text-slate-500'
            )}>
              {provider.availability === 'available' ? 'Available Now' :
               provider.availability === 'busy' ? 'Currently Busy' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            {provider.acceptsOfflineBooking
              ? <><WifiOff className="w-3 h-3" /> Offline booking</>
              : <><Wifi className="w-3 h-3" /> Online only</>}
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <span className="text-white font-bold text-lg">{provider.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-sky-700 transition-colors">{provider.name}</h3>
                  <p className="text-sky-600 text-sm font-medium">{provider.specialty}</p>
                  <p className="text-slate-500 text-xs">{provider.subSpecialty}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
                  <span className="text-amber-700 font-bold text-sm">{provider.rating}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{provider.location}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />{provider.experience}y exp.
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 flex-wrap">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                {provider.languages.slice(0, 3).map(lang => (
                  <span key={lang} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">{lang}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Next: <span className="font-medium text-slate-700">{provider.nextSlot}</span></span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{provider.reviews} reviews</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-xl font-bold text-slate-900">${provider.price}</span>
                <span className="text-xs text-slate-500">/consult</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center group-hover:bg-sky-600 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
