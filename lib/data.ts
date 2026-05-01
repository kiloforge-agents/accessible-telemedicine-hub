export interface Provider {
  id: string;
  name: string;
  specialty: string;
  subSpecialty: string;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  languages: string[];
  availability: 'available' | 'busy' | 'offline';
  nextSlot: string;
  experience: number;
  location: string;
  region: string;
  avatar: string;
  bio: string;
  slots: TimeSlot[];
  acceptsOfflineBooking: boolean;
  network: string;
  qualifications: string[];
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'video' | 'audio' | 'chat';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

export const providers: Provider[] = [
  {
    id: 'p1',
    name: 'Dr. Amara Osei',
    specialty: 'General Practice',
    subSpecialty: 'Family Medicine',
    rating: 4.9,
    reviews: 312,
    price: 15,
    currency: 'USD',
    languages: ['English', 'Twi', 'French'],
    availability: 'available',
    nextSlot: 'Today, 2:30 PM',
    experience: 12,
    location: 'Accra, Ghana',
    region: 'West Africa',
    avatar: 'AO',
    bio: 'Experienced family physician specializing in preventive care and chronic disease management in rural communities.',
    acceptsOfflineBooking: true,
    network: 'AfriHealth Network',
    qualifications: ['MBBS', 'MRCGP', 'FWACP'],
    slots: [
      { id: 's1', date: 'Today', time: '2:30 PM', available: true },
      { id: 's2', date: 'Today', time: '4:00 PM', available: true },
      { id: 's3', date: 'Tomorrow', time: '9:00 AM', available: true },
      { id: 's4', date: 'Tomorrow', time: '11:30 AM', available: false },
      { id: 's5', date: 'May 3', time: '3:00 PM', available: true },
    ],
  },
  {
    id: 'p2',
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrics',
    subSpecialty: 'Child & Adolescent Health',
    rating: 4.8,
    reviews: 245,
    price: 20,
    currency: 'USD',
    languages: ['English', 'Hindi', 'Tamil'],
    availability: 'available',
    nextSlot: 'Today, 3:00 PM',
    experience: 8,
    location: 'Mumbai, India',
    region: 'South Asia',
    avatar: 'PS',
    bio: 'Pediatrician with a focus on child nutrition and vaccination programs for underserved communities.',
    acceptsOfflineBooking: true,
    network: 'RuralCare India',
    qualifications: ['MBBS', 'MD Pediatrics', 'DCH'],
    slots: [
      { id: 's1', date: 'Today', time: '3:00 PM', available: true },
      { id: 's2', date: 'Today', time: '5:00 PM', available: true },
      { id: 's3', date: 'Tomorrow', time: '10:00 AM', available: true },
      { id: 's4', date: 'Tomorrow', time: '2:00 PM', available: true },
      { id: 's5', date: 'May 3', time: '9:30 AM', available: false },
    ],
  },
  {
    id: 'p3',
    name: 'Dr. Carlos Rivera',
    specialty: 'Mental Health',
    subSpecialty: 'Anxiety & Depression',
    rating: 4.7,
    reviews: 189,
    price: 25,
    currency: 'USD',
    languages: ['Spanish', 'English', 'Portuguese'],
    availability: 'busy',
    nextSlot: 'Tomorrow, 10:00 AM',
    experience: 15,
    location: 'Bogota, Colombia',
    region: 'Latin America',
    avatar: 'CR',
    bio: 'Psychiatrist specializing in community mental health, with a focus on anxiety and depression in low-income populations.',
    acceptsOfflineBooking: true,
    network: 'LatinSalud',
    qualifications: ['MD', 'Psychiatry Residency', 'CBT Certified'],
    slots: [
      { id: 's1', date: 'Tomorrow', time: '10:00 AM', available: true },
      { id: 's2', date: 'Tomorrow', time: '1:00 PM', available: true },
      { id: 's3', date: 'May 3', time: '11:00 AM', available: true },
      { id: 's4', date: 'May 4', time: '9:00 AM', available: true },
    ],
  },
  {
    id: 'p4',
    name: 'Dr. Fatima Al-Hassan',
    specialty: "Women's Health",
    subSpecialty: 'OB/GYN & Maternal Care',
    rating: 4.9,
    reviews: 421,
    price: 18,
    currency: 'USD',
    languages: ['Arabic', 'English', 'French'],
    availability: 'available',
    nextSlot: 'Today, 5:00 PM',
    experience: 20,
    location: 'Cairo, Egypt',
    region: 'North Africa',
    avatar: 'FA',
    bio: "Women's health specialist with extensive experience in maternal care and reproductive health in rural Egypt.",
    acceptsOfflineBooking: true,
    network: 'WomenFirst MENA',
    qualifications: ['MBBCh', 'MD OB/GYN', 'MRCOG'],
    slots: [
      { id: 's1', date: 'Today', time: '5:00 PM', available: true },
      { id: 's2', date: 'Tomorrow', time: '8:30 AM', available: true },
      { id: 's3', date: 'Tomorrow', time: '12:00 PM', available: true },
      { id: 's4', date: 'May 3', time: '4:00 PM', available: true },
    ],
  },
  {
    id: 'p5',
    name: 'Dr. James Mwangi',
    specialty: 'Nutrition & Dietetics',
    subSpecialty: 'Community Nutrition',
    rating: 4.6,
    reviews: 98,
    price: 12,
    currency: 'USD',
    languages: ['English', 'Swahili'],
    availability: 'available',
    nextSlot: 'Today, 6:00 PM',
    experience: 6,
    location: 'Nairobi, Kenya',
    region: 'East Africa',
    avatar: 'JM',
    bio: 'Nutritionist specializing in community dietary programs, malnutrition prevention, and healthy eating on a budget.',
    acceptsOfflineBooking: false,
    network: 'EastAfrica Health',
    qualifications: ['BSc Nutrition', 'MSc Public Health', 'RD'],
    slots: [
      { id: 's1', date: 'Today', time: '6:00 PM', available: true },
      { id: 's2', date: 'Tomorrow', time: '9:00 AM', available: true },
      { id: 's3', date: 'Tomorrow', time: '3:00 PM', available: true },
    ],
  },
  {
    id: 'p6',
    name: 'Dr. Li Wei',
    specialty: 'Dermatology',
    subSpecialty: 'Skin Conditions & Infections',
    rating: 4.7,
    reviews: 156,
    price: 22,
    currency: 'USD',
    languages: ['Mandarin', 'English'],
    availability: 'offline',
    nextSlot: 'May 3, 9:00 AM',
    experience: 10,
    location: 'Chengdu, China',
    region: 'East Asia',
    avatar: 'LW',
    bio: 'Dermatologist focusing on tropical skin conditions and infectious dermatology in Southeast Asian communities.',
    acceptsOfflineBooking: true,
    network: 'AsiaHealth Connect',
    qualifications: ['MD', 'Dermatology Board Certified', 'FSDV'],
    slots: [
      { id: 's1', date: 'May 3', time: '9:00 AM', available: true },
      { id: 's2', date: 'May 3', time: '11:00 AM', available: true },
      { id: 's3', date: 'May 4', time: '2:00 PM', available: true },
    ],
  },
];

export const specialties = [
  'All Specialties',
  'General Practice',
  'Pediatrics',
  'Mental Health',
  "Women's Health",
  'Nutrition & Dietetics',
  'Dermatology',
];

export const regions = [
  'All Regions',
  'West Africa',
  'South Asia',
  'Latin America',
  'North Africa',
  'East Africa',
  'East Asia',
];

export const languages = [
  'All Languages',
  'English',
  'Spanish',
  'French',
  'Arabic',
  'Hindi',
  'Swahili',
  'Mandarin',
  'Portuguese',
];

export const sampleAppointments: Appointment[] = [
  {
    id: 'a1',
    providerId: 'p1',
    providerName: 'Dr. Amara Osei',
    specialty: 'General Practice',
    date: 'Today',
    time: '2:30 PM',
    type: 'video',
    status: 'upcoming',
    notes: 'Follow-up for blood pressure medication',
  },
  {
    id: 'a2',
    providerId: 'p2',
    providerName: 'Dr. Priya Sharma',
    specialty: 'Pediatrics',
    date: 'Yesterday',
    time: '10:00 AM',
    type: 'audio',
    status: 'completed',
    notes: 'Child vaccination review',
  },
];
