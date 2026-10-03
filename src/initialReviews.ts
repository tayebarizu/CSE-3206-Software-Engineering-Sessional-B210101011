import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'client-1',
    userName: 'Chief Adeleke Bamidele',
    userEmail: 'adeleke.b@lagosprime.com',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    propertyTitle: '5-Bedroom Waterfront Villa',
    location: 'Banana Island, Ikoyi',
    clientBadge: 'Verified Homeowner',
    comment:
      'Acquiring our family residence on Banana Island was completely stress-free with Lagos Prime. Their legal team verified Governor’s Consent in record time, and the private boat escort for site inspection was top-tier.',
    createdAt: '2026-08-14T10:30:00Z',
  },
  {
    id: 'rev-2',
    userId: 'client-2',
    userName: 'Dr. Funmi Alabi-Davies',
    userEmail: 'funmi.alabi@londonmed.co.uk',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    propertyTitle: 'Skyline Modern Penthouse',
    location: 'Eko Atlantic City, VI',
    clientBadge: 'Diaspora Investor',
    comment:
      'Living in London, investing back home always felt daunting. Lagos Prime arranged high-definition live drone and walk-through tours over WhatsApp, and all title documentation was transparent from start to finish.',
    createdAt: '2026-08-28T14:15:00Z',
  },
  {
    id: 'rev-3',
    userId: 'client-3',
    userName: 'Babatunde Olatunji',
    userEmail: 'b.olatunji@fintechlagos.ng',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    propertyTitle: 'Contemporary Duplex Residence',
    location: 'Lekki Phase 1, Lagos',
    clientBadge: 'VIP Tenant',
    comment:
      'Rented an executive duplex for a 2-year lease. The concierge attended the physical inspection promptly at 10 AM, answered every engineering question, and lease handover was completed in under 48 hours.',
    createdAt: '2026-09-05T09:00:00Z',
  },
  {
    id: 'rev-4',
    userId: 'client-4',
    userName: 'Hajiya Zainab Danjuma',
    userEmail: 'zainab.d@danjuma-group.com',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    propertyTitle: 'Waterfront Sandfilled Plot (2,000 sqm)',
    location: 'Lekki Peninsula Corridor',
    clientBadge: 'Land Acquirer',
    comment:
      'Purchased commercial and residential acreage along the coastal expansion route. Survey coordinates, Gazette, and perimeter beacons were 100% accurate. True professionals in Nigerian luxury real estate.',
    createdAt: '2026-09-18T16:40:00Z',
  },
];