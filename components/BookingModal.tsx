'use client';

import { useState } from 'react';
import { Provider, TimeSlot, Appointment } from '@/lib/data';
import { saveAppointment } from '@/lib/offline-store';
import { X, Video, Phone, MessageCircle, Check, Calendar, Clock, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useOffline } from '@/hooks/useOffline';

interface BookingModalProps {
  provider: Provider;
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
}

type ConsultType = 'video' | 'audio' | 'chat';

const consultTypes: { value: ConsultType; label: string; icon: any; desc: string }[] = [
  { value: 'video', label: 'Video Call', icon: Video, desc: 'Face-to-face consultation' },
  { value: 'audio', label: 'Voice Call', icon: Phone, desc: 'Audio consultation only' },
  { value: 'chat', label: 'Chat', icon: MessageCircle, desc: 'Text-based consultation' },
];

export function BookingModal({ provider, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState<'slot' | 'type' | 'confirm' | 'success'>('slot');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedType, setSelectedType] = useState<ConsultType>('video');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOffline } = useOffline();

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    const appointment: Appointment = {
      id: `a-${Date.now()}`,
      providerId: provider.id,
      providerName: provider.name,
      specialty: provider.specialty,
      date: selectedSlot.date,
      time: selectedSlot.time,
      type: selectedType,
      status: 'upcoming',
      notes,
    };
    try {
      await saveAppointment(appointment);
      setTimeout(() => { setIsSubmitting(false); setStep('success'); setTimeout(() => onSuccess(appointment), 2000); }, 1000);
    } catch { setIsSubmitting(false); }
  };

  const availableSlots = provider.slots.filter(s => s.available);
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-sky-600 to-teal-600 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Book Appointment</h2>
            <p className="text-sky-200 text-sm">{provider.name} - {provider.specialty}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isOffline && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2 text-amber-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Offline -- booking will sync when you reconnect</span>
          </div>
        )}

        {step !== 'success' && (
          <div className="px-5 py-3 flex items-center gap-2">
            {(['slot', 'type', 'confirm'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                  step === s ? 'bg-sky-500 text-white' :
                  ['slot','type','confirm'].indexOf(step) > i ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                )}>
                  {['slot','type','confirm'].indexOf(step) > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {i < 2 && <div className={clsx('flex-1 h-0.5', ['slot','type','confirm'].indexOf(step) > i ? 'bg-emerald-400' : 'bg-slate-100')} />}
              </div>
            ))}
          </div>
        )}

        <div className="p-5">
          {step === 'slot' && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />Choose a time
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(groupedSlots).map(([date, slots]) => (
                  <div key={date}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{date}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map(slot => (
                        <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                          className={clsx('py-2.5 px-2 rounded-xl text-sm font-medium border-2 transition-all flex items-center justify-center gap-1',
                            selectedSlot?.id === slot.id ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50'
                          )}>
                          <Clock className="w-3 h-3" />{slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('type')} disabled={!selectedSlot}
                className="mt-4 w-full py-3 bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl transition-colors hover:bg-sky-600">
                Continue
              </button>
            </div>
          )}

          {step === 'type' && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">How would you like to consult?</h3>
              <div className="space-y-2">
                {consultTypes.map(({ value, label, icon: Icon, desc }) => (
                  <button key={value} onClick={() => setSelectedType(value)}
                    className={clsx('w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left',
                      selectedType === value ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-sky-300'
                    )}>
                    <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center',
                      selectedType === value ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    )}><Icon className="w-5 h-5" /></div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{label}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                    {selectedType === value && <Check className="w-5 h-5 text-sky-500 ml-auto" />}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600 block mb-1.5">Reason for visit (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Describe your symptoms or reason..." rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none" />
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setStep('slot')} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Back</button>
                <button onClick={() => setStep('confirm')} className="flex-1 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors">Continue</button>
              </div>
            </div>
          )}

          {step === 'confirm' && selectedSlot && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Confirm your booking</h3>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                {[
                  { label: 'Doctor', value: provider.name, bold: true },
                  { label: 'Specialty', value: provider.specialty },
                  { label: 'Date & Time', value: `${selectedSlot.date}, ${selectedSlot.time}`, bold: true },
                  { label: 'Consultation', value: selectedType },
                ].map(({ label, value, bold }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className={bold ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}>{value}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-3 flex justify-between text-sm">
                  <span className="text-slate-500">Total Cost</span>
                  <span className="font-bold text-slate-900 text-base">${provider.price}</span>
                </div>
              </div>
              {notes && (
                <div className="mt-3 bg-sky-50 rounded-xl p-3">
                  <p className="text-xs text-sky-700 font-medium">Your notes:</p>
                  <p className="text-sm text-sky-900 mt-0.5">{notes}</p>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <button onClick={() => setStep('type')} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">Back</button>
                <button onClick={handleConfirm} disabled={isSubmitting}
                  className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Booking...</> : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Appointment Booked!</h3>
              <p className="text-slate-500 text-sm mt-2">
                Your appointment with {provider.name} is confirmed{isOffline ? ' (will sync when online)' : ''}.
              </p>
              <div className="mt-4 bg-emerald-50 rounded-xl p-3 text-sm text-emerald-700 font-medium">
                {selectedSlot?.date}, {selectedSlot?.time} - {selectedType} consultation
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
