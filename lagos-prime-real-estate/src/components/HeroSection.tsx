import React, { useState } from 'react';
import { Property, ListingType } from '../types';
import villaHeroImg from '../assets/images/modern_lagos_villa_1790611187841.jpg';
import villaKitchenImg from '../assets/images/villa_kitchen_1790611204778.jpg';
import villaLivingImg from '../assets/images/villa_living_1790611221276.jpg';
import villaBedroomImg from '../assets/images/villa_bedroom_1790611235261.jpg';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Maximize2,
  Globe,
  Phone,
} from 'lucide-react';

interface HeroSectionProps {
  featuredProperty?: Property;
  onFilterType: (type: ListingType | 'All') => void;
  onOpenBooking: (property: Property) => void;
  onOpenDetails: (property: Property) => void;
  onExploreProperties: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProperty,
  onFilterType,
  onOpenBooking,
  onOpenDetails,
  onExploreProperties,
}) => {
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);
  const [activeRoomLabel, setActiveRoomLabel] = useState<string>('');

  const fallbackFeatured: Property = {
    id: 'hero-featured',
    title: 'Modern House in Lagos',
    description:
      'Monumental English Manor Positioned On A Secluded, Fully Gated Estate Encompassing More Than Five Acer In Scale With Park-like grounds, floor-to-ceiling glass architecture, custom hardwood balconies, and state-of-the-art smart home integration.',
    category: 'House',
    type: 'Sell',
    price: 380000000,
    location: 'Lekki Phase 1, Lagos',
    bedrooms: 5,
    bathrooms: 3,
    area: '650 sqm',
    imageUrl: villaHeroImg,
    galleryImages: {
      kitchen: villaKitchenImg,
      living: villaLivingImg,
      bedroom: villaBedroomImg,
    },
    features: [
      '5 Bedrooms',
      'Guest Room',
      '2 Bedrooms',
      '3 Bath Room',
      'laundry Room',
      'Dinning Room',
    ],
    ownerId: 'system_admin',
    ownerName: 'Lagos Prime Estates',
    ownerEmail: 'tayebarizu@gmail.com',
  };

  const prop = featuredProperty || fallbackFeatured;

  const roomInsets = [
    {
      title: 'Kitchen',
      img: prop.galleryImages?.kitchen || villaKitchenImg,
    },
    {
      title: 'Living Room',
      img: prop.galleryImages?.living || villaLivingImg,
    },
    {
      title: 'Bedroom',
      img: prop.galleryImages?.bedroom || villaBedroomImg,
    },
  ];

  return (
    <section id="hero" className="relative pt-4 pb-12 bg-stone-100/60 overflow-hidden">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        
        {/* Main Poster Container - Exact replica of user's uploaded reference flyer card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden p-4 sm:p-8 md:p-10 transition-all">
          
          {/* Top Villa Architectural Render */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-900 shadow-md">
            <img
              src={prop.imageUrl || villaHeroImg}
              alt={prop.title}
              className="w-full h-[360px] sm:h-[480px] md:h-[540px] object-cover object-center"
            />

            {/* Subtle top floating tag */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold tracking-widest uppercase rounded-full">
                Featured Architectural Estate
              </span>
              <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-stone-900 text-[11px] font-bold rounded-full shadow">
                {prop.location}
              </span>
            </div>

            {/* Quick action bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-white">
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-widest text-amber-200 font-bold drop-shadow">
                  Exclusive Listing
                </p>
                <h3 className="text-xl font-extrabold font-display drop-shadow">
                  {prop.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => onOpenBooking(prop)}
                  className="px-4 py-2 bg-[#744322] hover:bg-[#583116] text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>Book Viewing</span>
                </button>
                <button
                  onClick={() => onOpenDetails(prop)}
                  className="px-3.5 py-2 bg-white/25 hover:bg-white/35 backdrop-blur-md text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Signature Rounded Inset Windows (Kitchen, Living Room, Bedroom) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-4">
            {roomInsets.map((room, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActivePreviewImage(room.img);
                  setActiveRoomLabel(room.title);
                }}
                className="group relative cursor-pointer rounded-2xl overflow-hidden border-[3px] border-[#583116] bg-stone-900 shadow-md hover:border-[#744322] hover:scale-102 transition-all"
              >
                <div className="h-24 sm:h-32 md:h-36 overflow-hidden">
                  <img
                    src={room.img}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-white">
                  <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-white drop-shadow">
                    {room.title}
                  </span>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-stone-200 hidden sm:inline">
                    Zoom
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Middle Row: EXACT Headline & WHAT WE DO Buttons from Reference Flyer */}
          <div className="mt-8 pt-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left Column: Bold Typography matching Reference Image */}
            <div className="leading-tight">
              <span className="block text-2xl sm:text-3xl font-extrabold tracking-wider text-[#744322] uppercase font-flyer-sub">
                MODERN
              </span>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-black tracking-tight leading-[0.9] uppercase font-flyer-heavy">
                HOUSE
              </h1>
              <span className="block text-2xl sm:text-3xl font-black tracking-wide text-black uppercase font-flyer-sub mt-0.5">
                IN LAGOS
              </span>
            </div>

            {/* Right Column: WHAT WE DO.... with 2x2 Grid of Solid Brown Buttons */}
            <div className="md:text-right">
              <span className="block text-sm sm:text-base font-black tracking-widest text-black uppercase mb-3 font-sans">
                WHAT WE DO....
              </span>
              <div className="grid grid-cols-2 gap-2.5 max-w-[280px] md:ml-auto">
                {(['SELL', 'RENT', 'MANAGE', 'LEASE'] as const).map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      if (action === 'MANAGE') {
                        onFilterType('All');
                        const el = document.getElementById('what-we-do');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onFilterType(action as ListingType);
                        onExploreProperties();
                      }
                    }}
                    className="py-2.5 px-6 bg-[#744322] hover:bg-[#583116] active:scale-95 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase rounded-md shadow transition-all text-center cursor-pointer font-sans"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Row: Split Features Card (Solid Brown Box) + About Us Card */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Box: Solid Rich Brown Box with Crisp White Bullet Points */}
            <div className="md:col-span-6 bg-[#744322] rounded-xl p-6 sm:p-7 text-white shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold font-sans mb-4">
                  Features
                </h3>

                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-sm sm:text-base font-semibold">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 inline-block shadow-sm" />
                    <span>5 Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 inline-block shadow-sm" />
                    <span>Guest Room</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 inline-block shadow-sm" />
                    <span>2 Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 inline-block shadow-sm" />
                    <span>3 Bath Room</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 inline-block shadow-sm" />
                    <span>laundry Room</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shrink-0 inline-block shadow-sm" />
                    <span>Dinning Room</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-stone-200">
                <span>Scale: <strong className="text-white">Five Acres Estate</strong></span>
                <span>Type: <strong className="text-white">Gated Sanctuary</strong></span>
              </div>
            </div>

            {/* Right Box: About Us (Exact wording & typography from reference flyer) */}
            <div className="md:col-span-6 p-2 sm:p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-black font-sans mb-3">
                  About Us
                </h3>
                <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-medium">
                  Monumental English Manor Positioned On A Secluded, Fully Gated Estate Encompassing More Than Five Acer In Scale With Park-like.
                </p>
                <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed">
                  Impeccable architectural standards featuring bespoke double-height living areas, curated Italian chef kitchens, and 24/7 dedicated estate facility management.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onOpenDetails(prop)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#744322] hover:text-[#583116] group cursor-pointer"
                >
                  <span>Explore Full Architectural Specs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onOpenBooking(prop)}
                  className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Schedule Tour
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Inset Modal */}
      {activePreviewImage && (
        <div
          onClick={() => setActivePreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-stone-900 rounded-2xl overflow-hidden max-w-2xl w-full border border-stone-700 shadow-2xl relative"
          >
            <div className="p-3.5 bg-stone-900/90 flex items-center justify-between text-white border-b border-stone-800">
              <span className="font-bold text-sm tracking-wide text-amber-300">
                {activeRoomLabel} - Interior Inspection
              </span>
              <button
                onClick={() => setActivePreviewImage(null)}
                className="text-stone-400 hover:text-white px-2 py-1 text-sm font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
            <img
              src={activePreviewImage}
              alt={activeRoomLabel}
              className="w-full max-h-[70vh] object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
};
