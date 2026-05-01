'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { providers } from '@/lib/data';
import { BookingModal } from '@/components/BookingModal';
import { Appointment } from '@/lib/data';
import {
  Star, MapPin, Clock, Globe, Shield, ChevronLeft, Video, Phone,
  MessageCircle, Award, WifiOff, Wifi, Volume2, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useVoice } from '@/hooks/useVoice';

const avatarColors = [
  'from-sky-400 to-blue-500', 'from-teal-400 to-emerald-500',
  'from-violet-400 to-purple-500', 'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500', 'from-indigo-400 to-blue-600',
];

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showBooking, setShowBooking] = useState(false);
  const [booked, setBooked] = useState<Appointment | null>(null);
  const { speak } = useVoice();

  const provider = providers.find(p => p.id === params.id);

  if (!provider) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Provider not found</h1>
        <Link href="/providers" className="mt-4 inline-flex items-center gap-2 text-sky-600">
          <ChevronLeft className="w-4 h-4" /> Back to Providers
        </Link>
      </div>
    );
  }

  const colorIdx = provider.id.charCodeAt(1) % avatarColors.length;
  const avatarGradient = avatarColors[colorIdx];

  const handleSpeakBio = () => {
    speak(`${provider.name} is a ${provider.specialty} specialist with ${provider.experience} years of experience, based in ${provider.location}. ${provider.bio}`);
  };

  const handleSuccess = (appointment: Appointment) => {
    setBooked(appointment);
    setShowBooking(false);
    setTimeout(() => router.push('/appointments'), 1500);
  };

  const mockReviews = [
    { name: 'Sarah M.', rating: 5, text: 'Dr. was extremely helpful and patient. Easy to communicate with.', date: '2 weeks ago' },
    { name: 'John K.', rating: 5, text: 'Great experience. Clear explanation and the voice call worked perfectly.', date: '1 month ago' },
    { name: 'Amina B.', rating: 4, text: 'Very professional. Understood my situation well.', date: '1 month ago' },
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/providers" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-sky-600 text-sm font-medium mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />Back to Providers
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-5">
          <div className="bg-gradient-to-br from-slate-50 to-sky-50 p-6 border-b border-slate-100">
            <div className="flex gap-4">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <span className="text-white font-extrabold text-2xl">{provider.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{provider.name}</h1>
                    <p className="text-sky-600 font-semibold">{provider.specialty}</p>
                    <p className="text-slate-500 text-sm">{provider.subSpecialty}</p>
                  </div>
                  <div className={clsx('px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5',
                    provider.availability === 'available' ? 'status-available' :
                    provider.availability === 'busy' ? 'status-busy' : 'status-offline'
                  )}>
                    <div className={clsx('w-2 h-2 rounded-full',
                      provider.availability === 'available' ? 'bg-emerald-500 animate-pulse' :
                      provider.availability === 'busy' ? 'bg-amber-500' : 'bg-red-400'
                    )} />
                    {provider.availability === 'available' ? 'Available Now' : provider.availability === 'busy' ? 'Busy' : 'Offline'}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                    <span className="font-bold">{provider.rating}</span>
                    <span className="text-slate-400">({provider.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />{provider.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Shield className="w-4 h-4 text-slate-400" />{provider.experience} years experience
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 border-b border-slate-100">
            <div className="p-4 text-center"><p className="text-2xl font-bold text-slate-900">${provider.price}</p><p className="text-xs text-slate-500 mt-0.5">per consultation</p></div>
            <div className="p-4 text-center"><p className="text-2xl font-bold text-slate-900">{provider.experience}y</p><p className="text-xs text-slate-500 mt-0.5">experience</p></div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                {provider.acceptsOfflineBooking ? <WifiOff className="w-4 h-4 text-emerald-500" /> : <Wifi className="w-4 h-4 text-sky-500" />}
              </div>
              <p className="text-xs text-slate-500 mt-1">{provider.acceptsOfflineBooking ? 'Offline bookings' : 'Online only'}</p>
            </div>
            <div className="p-4 text-center"><p className="text-sm font-semibold text-sky-600">{provider.network}</p><p className="text-xs text-slate-500 mt-0.5">network</p></div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900">About</h2>
              <button onClick={handleSpeakBio}
                className="flex items-center gap-1.5 text-sky-600 text-sm hover:bg-sky-50 px-3 py-1.5 rounded-xl transition-colors font-medium"
                aria-label="Listen to bio">
                <Volume2 className="w-4 h-4" />Listen
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed">{provider.bio}</p>
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-500" /> Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {provider.languages.map(lang => (
                  <span key={lang} className="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-xl text-sm font-medium border border-sky-100">{lang}</span>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-500" /> Qualifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {provider.qualifications.map(q => (
                  <span key={q} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100">{q}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Consultation Options</h2>
          <div className="grid grid-cols-3 gap-3">
            {[{icon: Video, label: 'Video', desc: 'Face-to-face'}, {icon: Phone, label: 'Audio', desc: 'Voice only'}, {icon: MessageCircle, label: 'Chat', desc: 'Text-based'}].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <Icon className="w-5 h-5 text-sky-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <span className="text-xs text-slate-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-500" />Available Times
          </h2>
          <div className="flex flex-wrap gap-2">
            {provider.slots.filter(s => s.available).slice(0, 6).map(slot => (
              <div key={slot.id} className="px-3 py-2 bg-sky-50 border border-sky-200 rounded-xl text-sm text-sky-700 font-medium">
                <span className="text-sky-500 text-xs">{slot.date}</span><br />{slot.time}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" fill="currentColor" />Patient Reviews
          </h2>
          <div className="space-y-4">
            {mockReviews.map((review, i) => (
              <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">{review.name[0]}</div>
                    <span className="font-semibold text-slate-800 text-sm">{review.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />)}
                    <span className="text-xs text-slate-400 ml-1">{review.date}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 ml-10">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-20 md:bottom-4">
          <button onClick={() => setShowBooking(true)}
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01] transition-all">
            Book Appointment -- ${provider.price}
          </button>
        </div>

        {booked && (
          <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-emerald-600 text-white rounded-2xl p-4 shadow-2xl z-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Appointment Booked!</p>
              <p className="text-emerald-200 text-sm">{booked.date} at {booked.time}</p>
            </div>
          </div>
        )}
      </div>

      {showBooking && (
        <BookingModal provider={provider} onClose={() => setShowBooking(false)} onSuccess={handleSuccess} />
      )}
    </>
  );
}
