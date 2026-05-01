'use client';

import Link from 'next/link';
import { providers, specialties } from '@/lib/data';
import { ProviderCard } from '@/components/ProviderCard';
import {
  Heart, Shield, Wifi, WifiOff, Volume2, Search, ChevronRight,
  Star, Users, Clock, Globe, Stethoscope, Brain, Baby, Leaf, Activity
} from 'lucide-react';

const stats = [
  { label: 'Providers', value: '500+', icon: Stethoscope, color: 'text-sky-600 bg-sky-50' },
  { label: 'Patients Served', value: '50K+', icon: Users, color: 'text-teal-600 bg-teal-50' },
  { label: 'Languages', value: '30+', icon: Globe, color: 'text-violet-600 bg-violet-50' },
  { label: 'Avg. Wait', value: '<15m', icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
];

const features = [
  { icon: Volume2, title: 'Voice-Guided Booking', desc: 'Navigate entirely by voice -- no reading required. Our assistant speaks and listens in your language.', color: 'from-sky-500 to-blue-600' },
  { icon: WifiOff, title: 'Works Offline', desc: 'Book appointments even without internet. Data syncs automatically when you reconnect.', color: 'from-teal-500 to-emerald-600' },
  { icon: Globe, title: 'Multi-Language Support', desc: 'Doctors available in 30+ languages including Swahili, Hindi, Arabic, Spanish, and more.', color: 'from-violet-500 to-purple-600' },
  { icon: Shield, title: 'Verified & Safe', desc: 'Every provider is vetted, licensed, and reviewed by real patients in your community.', color: 'from-emerald-500 to-green-600' },
];

const specialtyIcons: Record<string, any> = {
  'General Practice': Stethoscope,
  'Pediatrics': Baby,
  'Mental Health': Brain,
  "Women's Health": Heart,
  'Nutrition & Dietetics': Leaf,
  'Dermatology': Activity,
};

export default function HomePage() {
  const featuredProviders = providers.filter(p => p.availability === 'available').slice(0, 3);
  const displaySpecialties = specialties.filter(s => s !== 'All Specialties');

  return (
    <div>
      <section className="hero-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Healthcare access for underserved communities
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Quality Healthcare,<br />
              <span className="text-sky-300">No Barriers</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-sky-100 leading-relaxed max-w-2xl">
              Connect with certified doctors via voice, video, or chat -- in your language, on any device, even offline. Designed for communities that need it most.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/providers" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-sky-700 font-bold rounded-2xl shadow-xl hover:bg-sky-50 transition-colors text-base">
                <Search className="w-5 h-5" />Find a Doctor
              </Link>
              <Link href="/providers?urgency=emergency" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-red-500/20 border-2 border-red-400/50 text-white font-bold rounded-2xl hover:bg-red-500/30 transition-colors text-base">
                <Heart className="w-5 h-5" fill="currentColor" />Urgent Care
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['AO', 'PS', 'CR', 'FA'].map((av, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-teal-400 border-2 border-white/50 flex items-center justify-center text-xs font-bold text-white">{av}</div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />)}</div>
                <span className="text-sky-200 text-sm">50,000+ patients trust CareConnect</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-12 overflow-hidden">
          <svg viewBox="0 0 1440 48" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,48 L1440,48 L1440,0 Q720,48 0,0 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-2 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Browse by Specialty</h2>
          <Link href="/providers" className="text-sky-600 text-sm font-medium hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {displaySpecialties.map(specialty => {
            const Icon = specialtyIcons[specialty] || Stethoscope;
            return (
              <Link key={specialty} href={`/providers?specialty=${encodeURIComponent(specialty)}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all group">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-50 to-teal-50 rounded-xl flex items-center justify-center group-hover:from-sky-100 group-hover:to-teal-100 transition-colors">
                  <Icon className="w-5 h-5 text-sky-600" />
                </div>
                <span className="text-xs font-medium text-slate-700 text-center leading-tight">{specialty}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Available Now</h2>
            <p className="text-slate-500 text-sm">Doctors ready for immediate consultation</p>
          </div>
          <Link href="/providers?availability=available" className="text-sky-600 text-sm font-medium hover:underline flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProviders.map(provider => <ProviderCard key={provider.id} provider={provider} />)}
        </div>
      </section>

      <section className="bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Built for Everyone</h2>
            <p className="text-slate-400 mt-2 max-w-xl mx-auto">Designed with accessibility-first principles for users in areas with poor connectivity, limited literacy, or unfamiliar with technology.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-sky-600 to-teal-600 py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Start your care journey today</h2>
          <p className="text-sky-200 mb-8 max-w-md mx-auto">No registration required for browsing. Book instantly with your phone number.</p>
          <Link href="/providers" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-700 font-bold rounded-2xl shadow-xl hover:bg-sky-50 transition-colors text-base">
            <Search className="w-5 h-5" />Find Your Doctor
          </Link>
        </div>
      </section>
    </div>
  );
}
