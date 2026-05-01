'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Heart, Calendar, Search, Home, Menu, X, Wifi, WifiOff } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';
import { clsx } from 'clsx';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/providers', label: 'Find Doctors', icon: Search },
  { href: '/appointments', label: 'My Appointments', icon: Calendar },
];

export function Navbar() {
  const pathname = usePathname();
  const { isOffline } = useOffline();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-md shadow-sky-500/25 group-hover:shadow-sky-500/40 transition-shadow">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="font-bold text-lg text-slate-900">Care<span className="text-sky-500">Connect</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    pathname === href ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}>
                  <Icon className="w-4 h-4" />{label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className={clsx('hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium',
                isOffline ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
              )}>
                {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                {isOffline ? 'Offline' : 'Online'}
              </div>
              <Link href="/providers?urgency=emergency"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
                <Heart className="w-4 h-4" fill="currentColor" />Urgent Care
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors" aria-label="Toggle menu">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={clsx('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  pathname === href ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}>
                <Icon className="w-5 h-5" />{label}
              </Link>
            ))}
          </div>
        )}
      </nav>
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-slate-200 shadow-lg">
        <div className="flex">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={clsx('flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                pathname === href ? 'text-sky-600' : 'text-slate-500'
              )}>
              <Icon className={clsx('w-5 h-5', pathname === href && 'text-sky-600')} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
