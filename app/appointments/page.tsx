'use client';

import { useState, useEffect } from 'react';
import { Appointment } from '@/lib/data';
import { getAppointments, deleteAppointment } from '@/lib/offline-store';
import { sampleAppointments } from '@/lib/data';
import {
  Calendar, Video, Phone, MessageCircle, Clock, Trash2,
  Plus, CheckCircle, XCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useOffline } from '@/hooks/useOffline';

const typeIcons = { video: Video, audio: Phone, chat: MessageCircle };

const statusConfig = {
  upcoming: { label: 'Upcoming', color: 'text-sky-700 bg-sky-50 border-sky-200', icon: Clock },
  completed: { label: 'Completed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { isOffline } = useOffline();

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const stored = await getAppointments();
      const allIds = new Set(stored.map((a: Appointment) => a.id));
      const merged = [...stored, ...sampleAppointments.filter(a => !allIds.has(a.id))];
      setAppointments(merged);
    } catch {
      setAppointments(sampleAppointments);
    }
    setLoading(false);
  };

  useEffect(() => { loadAppointments(); }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteAppointment(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const completed = appointments.filter(a => a.status === 'completed');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Appointments</h1>
          <p className="text-slate-500 mt-1">
            {upcoming.length} upcoming · {completed.length} completed
            {isOffline && <span className="ml-2 text-amber-600">(Offline)</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadAppointments} className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors" aria-label="Refresh">
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link href="/providers" className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors text-sm">
            <Plus className="w-4 h-4" />Book New
          </Link>
        </div>
      </div>

      {isOffline && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Offline Mode</p>
            <p className="text-sm text-amber-600">Showing cached appointments. New bookings will sync when you are back online.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Upcoming', count: upcoming.length, color: 'text-sky-600 bg-sky-50' },
          { label: 'Completed', count: completed.length, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total', count: appointments.length, color: 'text-slate-600 bg-slate-50' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`${color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs font-medium mt-0.5 opacity-75">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5 bg-slate-100 p-1 rounded-xl">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={clsx('flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize',
              filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}>{f}</button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No appointments</h3>
          <p className="text-slate-500 text-sm mt-1 mb-5">
            {filter === 'all' ? 'You have not booked any appointments yet.' : `No ${filter} appointments.`}
          </p>
          <Link href="/providers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors">
            <Plus className="w-4 h-4" />Book Your First Appointment
          </Link>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(appt => {
            const TypeIcon = typeIcons[appt.type];
            const status = statusConfig[appt.status];
            const StatusIcon = status.icon;
            return (
              <div key={appt.id} className="appointment-card bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      appt.status === 'upcoming' ? 'bg-sky-100' : appt.status === 'completed' ? 'bg-emerald-100' : 'bg-slate-100'
                    )}>
                      <TypeIcon className={clsx('w-6 h-6',
                        appt.status === 'upcoming' ? 'text-sky-600' : appt.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900">{appt.providerName}</h3>
                        <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium border', status.color)}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />{status.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{appt.specialty}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />{appt.date}, {appt.time}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 capitalize">
                          <TypeIcon className="w-3.5 h-3.5" />{appt.type} call
                        </div>
                      </div>
                      {appt.notes && (
                        <p className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1.5 line-clamp-1">{appt.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {appt.status === 'upcoming' && (
                      <button className="px-3 py-1.5 bg-sky-500 text-white text-xs font-bold rounded-lg hover:bg-sky-600 transition-colors whitespace-nowrap">Join Call</button>
                    )}
                    <button onClick={() => handleDelete(appt.id)} disabled={deletingId === appt.id}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete">
                      {deletingId === appt.id
                        ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="mt-8 bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl border border-sky-100 p-5 text-center">
          <p className="text-slate-700 font-medium mb-3">Need to see a different doctor?</p>
          <Link href="/providers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors text-sm">
            <Plus className="w-4 h-4" />Browse Providers
          </Link>
        </div>
      )}
    </div>
  );
}
