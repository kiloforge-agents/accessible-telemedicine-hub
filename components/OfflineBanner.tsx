'use client';

import { useOffline } from '@/hooks/useOffline';
import { WifiOff, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function OfflineBanner() {
  const { isOffline } = useOffline();
  const [show, setShow] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setShow(true);
      setWasOffline(true);
    } else if (wasOffline) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, wasOffline]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium ${
        isOffline ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
      }`}
      role="alert"
      aria-live="polite"
    >
      {isOffline ? (
        <><WifiOff className="w-4 h-4 flex-shrink-0" /><span>You are offline - viewing cached data. Bookings sync when reconnected.</span></>
      ) : (
        <><CheckCircle className="w-4 h-4 flex-shrink-0" /><span>You are back online! Your data is syncing.</span></>
      )}
    </div>
  );
}
