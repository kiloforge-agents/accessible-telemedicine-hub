'use client';

import Link from 'next/link';
import { WifiOff, Heart, Phone, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <WifiOff className="w-10 h-10 text-amber-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">You are Offline</h1>
      <p className="text-slate-500 mb-8 leading-relaxed">
        No internet connection detected. You can still view your cached appointments and provider information.
      </p>
      <div className="space-y-3 mb-8">
        <Link href="/appointments" className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors text-left">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">My Appointments</p>
            <p className="text-sm text-slate-500">View cached bookings</p>
          </div>
        </Link>
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-left">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Phone className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-red-900">Emergency? Call 112</p>
            <p className="text-sm text-red-600">Emergency services available offline</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}
