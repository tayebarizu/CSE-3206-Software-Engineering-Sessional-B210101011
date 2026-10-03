import React from 'react';
import { Globe, Phone, Building2, Shield } from 'lucide-react';

interface FooterRibbonProps {
  onNavigateSection: (sectionId: string) => void;
}

export const FooterRibbon: React.FC<FooterRibbonProps> = ({ onNavigateSection }) => {
  return (
    <footer id="footer" className="mt-auto scroll-mt-20">
      {/* Upper Footer section */}
      <div className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-brown rounded-xl flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                LAGOS PRIME ESTATES
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Premier luxury real estate brokerage in Lagos, Nigeria. Representing landmark modern houses, lagoon-front penthouses, and prime development plots in Ikoyi, Lekki, Victoria Island, and Banana Island.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateSection('hero')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Featured Architectural Villa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('properties')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Browse Houses, Apartments & Plots
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('services')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  What We Do (Core Services)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('about')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  About Our Gated Estates
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Corporate Office & Registry
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Admiralty Way, Lekki Phase 1, Lagos, Nigeria.
              <br />
              Registered with LASRERA (Lagos State Real Estate Regulatory Authority).
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300">
              <Shield className="w-4 h-4 shrink-0" />
              <span>100% Certified Legal Documentation & Title Searches</span>
            </div>
          </div>

        </div>
      </div>

      {/* Signature Dark Chestnut Contact Ribbon */}
      <div className="bg-brand-brown text-white py-4 sm:py-5 border-t border-brand-brown-dark shadow-inner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* Left: visit our website */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] text-stone-200 font-medium tracking-wide">
                visit our website
              </span>
              <a
                href="#hero"
                className="text-sm sm:text-base font-extrabold tracking-wide hover:underline text-white font-sans"
              >
                www.lagosprimeestates.com
              </a>
            </div>
          </div>

          {/* Right: For more info */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] text-stone-200 font-medium tracking-wide">
                For more info & inspections
              </span>
              <span className="text-sm sm:text-base font-extrabold tracking-wider text-white font-sans">
                08112231041, 08142081903
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Sub-strip */}
      <div className="bg-brand-brown-dark text-stone-300 py-3 text-center text-[11px]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Lagos Prime Real Estate. All rights reserved.</span>
          <span>Designed with architectural excellence.</span>
        </div>
      </div>
    </footer>
  );
};