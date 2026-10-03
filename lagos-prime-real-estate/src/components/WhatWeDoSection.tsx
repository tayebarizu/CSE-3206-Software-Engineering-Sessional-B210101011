import React from 'react';
import { ListingType } from '../types';
import {
  TrendingUp,
  Key,
  ShieldCheck,
  FileCheck2,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface WhatWeDoSectionProps {
  onSelectType: (type: ListingType) => void;
  onExplore: () => void;
}

export const WhatWeDoSection: React.FC<WhatWeDoSectionProps> = ({
  onSelectType,
  onExplore,
}) => {
  const services: {
    title: string;
    type: ListingType;
    tag: string;
    desc: string;
    icon: React.ReactNode;
    features: string[];
  }[] = [
    {
      title: 'Property Sales',
      type: 'Sell',
      tag: 'SELL',
      desc: 'Exclusive representation for prime villas, modern luxury duplexes, and verified dry plots across Lagos prime enclaves.',
      icon: <TrendingUp className="w-5 h-5 text-amber-300" />,
      features: ['Certified Valuation', 'High-Net-Worth Network', 'Escrow & Legal Verification'],
    },
    {
      title: 'Luxury Rentals',
      type: 'Rent',
      tag: 'RENT',
      desc: 'Curated portfolio of fully serviced waterfront apartments, skyline penthouses, and gated private residences.',
      icon: <Key className="w-5 h-5 text-amber-300" />,
      features: ['Expat & Corporate Relocation', 'Flexible Tenancy Terms', 'Furnished Turnkey Options'],
    },
    {
      title: 'Facility Management',
      type: 'Sell', // default link
      tag: 'MANAGE',
      desc: 'End-to-end estate and facility management ensuring maximum asset appreciation, zero downtime, and elite tenant retention.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-300" />,
      features: ['24/7 Power & Security', 'Preventive Facility Care', 'Rent Collection & Reporting'],
    },
    {
      title: 'Long-term Leasing',
      type: 'Lease',
      tag: 'LEASE',
      desc: 'Multi-year commercial, diplomatic, and executive residential leases tailored with institutional security standards.',
      icon: <FileCheck2 className="w-5 h-5 text-amber-300" />,
      features: ['Diplomatic Mission Leases', 'Commercial Land Rights', 'Inflation-Hedging Clauses'],
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-stone-50 border-t border-stone-200 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 bg-stone-200 text-brand-brown text-xs font-black tracking-widest uppercase rounded-full mb-3">
            Core Real Estate Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 font-display tracking-tight uppercase">
            What We Do
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            From iconic modern architecture in Lekki and Ikoyi to private waterfront plots, we provide end-to-end luxury real estate brokerage.
          </p>
        </div>

        {/* 4 Pillars Grid (SELL, RENT, MANAGE, LEASE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-brand-brown rounded-2xl flex items-center justify-center text-white shadow-md group-hover:bg-brand-brown-dark transition-colors">
                    {item.icon}
                  </div>
                  <span className="px-3 py-1 bg-brand-brown/10 text-brand-brown text-xs font-extrabold tracking-wider uppercase rounded-lg">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 font-display mb-2 group-hover:text-brand-brown transition-colors">
                  {item.title}
                </h3>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>

                <ul className="space-y-2 mb-6">
                  {item.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-brown shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  if (item.tag === 'MANAGE') {
                    onExplore();
                  } else {
                    onSelectType(item.type);
                    onExplore();
                  }
                }}
                className="w-full py-2.5 px-3 bg-stone-100 hover:bg-brand-brown hover:text-white text-stone-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View {item.tag} Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Detailed About Us Section Card */}
        <div id="about" className="mt-16 bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-extrabold tracking-widest text-brand-brown uppercase">
                ESTABLISHED EXCELLENCE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-display">
                Monumental Modern Architecture in Secluded Gated Enclaves
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                Positioned on secluded, fully gated estates encompassing park-like grounds, Lagos Prime brings architectural prestige to West Africa’s most dynamic commercial and residential metropolis.
              </p>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Whether purchasing a 5-bedroom private family estate, leasing an executive lagoon-front penthouse, or securing clean-titled sandfilled plots in Banana Island and Epe, our team provides seamless legal due diligence, title verification, and discreet viewing tours.
              </p>

              {/* Stats Ribbon */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-stone-100">
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-brand-brown font-display">
                    450+
                  </span>
                  <span className="text-xs text-stone-500 font-semibold">Properties Sold</span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-brand-brown font-display">
                    100%
                  </span>
                  <span className="text-xs text-stone-500 font-semibold">Verified Titles</span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-brand-brown font-display">
                    15+
                  </span>
                  <span className="text-xs text-stone-500 font-semibold">Years Experience</span>
                </div>
              </div>
            </div>

            {/* Right Card: Signature Brown Feature Box */}
            <div className="lg:col-span-5 bg-brand-brown rounded-2xl p-7 text-white shadow-xl">
              <h4 className="text-xl font-bold font-display mb-4">
                Our Estate Standards
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                  <span>5-Bedroom & 4-Bedroom Configurations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                  <span>En-Suite Guest Rooms & Staff Quarters</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                  <span>Chef Kitchens & Dining Rooms</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                  <span>Dedicated Laundry Rooms & Pantries</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                  <span>Private Swimming Pools & Landscaping</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                  <span>Governor’s Consent & Clean C of O Titles</span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
                <span>Inquiries & Inspections:</span>
                <strong className="text-amber-300">+234 811 223 1041</strong>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};