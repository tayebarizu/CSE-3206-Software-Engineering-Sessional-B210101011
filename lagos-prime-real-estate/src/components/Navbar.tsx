import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  PlusCircle,
  User as UserIcon,
  LogOut,
  Calendar,
  Layers,
  Menu,
  X,
  Shield,
  Crown,
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenAuthModal: () => void;
  onOpenDashboard: (tab?: 'listings' | 'bookings') => void;
  onOpenAdminPanel?: () => void;
  onNavigateSection: (sectionId: string) => void;
  bookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenAuthModal,
  onOpenDashboard,
  onOpenAdminPanel,
  onNavigateSection,
  bookingsCount,
}) => {
  const { user, signOutUser, role, isAdmin } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <div
            onClick={() => onNavigateSection('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 bg-brand-brown rounded-xl flex items-center justify-center text-white shadow-md group-hover:bg-brand-brown-dark transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xl font-extrabold tracking-tight text-stone-900 font-display">
                LAGOS PRIME
              </span>
              <span className="block text-[11px] font-semibold tracking-widest text-brand-brown uppercase">
                Estates & Residences
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigateSection('properties')}
              className="text-sm font-semibold text-stone-700 hover:text-brand-brown transition-colors cursor-pointer"
            >
              Exclusive Properties
            </button>
            <button
              onClick={() => onNavigateSection('services')}
              className="text-sm font-semibold text-stone-700 hover:text-brand-brown transition-colors cursor-pointer"
            >
              Our Services
            </button>
            <button
              onClick={() => onNavigateSection('reviews')}
              className="text-sm font-semibold text-stone-700 hover:text-brand-brown transition-colors cursor-pointer"
            >
              Client Testimonials
            </button>
            <button
              onClick={() => onNavigateSection('footer')}
              className="text-sm font-semibold text-stone-700 hover:text-brand-brown transition-colors cursor-pointer"
            >
              Contact & Inquiries
            </button>
          </nav>

          {/* Action Buttons & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* If Admin: Direct Quick Access to Executive Admin Portal */}
            {isAdmin && onOpenAdminPanel && (
              <button
                onClick={onOpenAdminPanel}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer border border-amber-500"
              >
                <Shield className="w-4 h-4 text-stone-950" />
                <span>Admin Portal</span>
              </button>
            )}

            {/* If Customer or Guest: List Property Button */}
            {!isAdmin && (
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all border border-stone-200 cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-brand-brown" />
                <span>List Property</span>
              </button>
            )}

            {/* Auth / Profile Area */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-stone-100 transition-colors border cursor-pointer ${
                    isAdmin ? 'border-amber-300 bg-amber-50/50' : 'border-stone-200'
                  }`}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Profile'}
                      className={`w-8 h-8 rounded-full object-cover ring-2 ${
                        isAdmin ? 'ring-amber-500' : 'ring-brand-brown/20'
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                        isAdmin
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-brand-brown/10 text-brand-brown'
                      }`}
                    >
                      {isAdmin ? '👑' : user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-bold text-stone-800 max-w-[110px] truncate">
                    {user.displayName || (isAdmin ? 'Admin' : 'Client')}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      isAdmin
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate flex items-center gap-1.5">
                        {isAdmin && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        <span>{user.displayName || (isAdmin ? 'Administrator' : 'Client')}</span>
                      </p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            isAdmin
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          Role: {isAdmin ? 'Executive Administrator' : 'Verified Customer'}
                        </span>
                      </div>
                    </div>

                    {/* ADMIN DEDICATED CONTROLS (Only visible to Admin) */}
                    {isAdmin ? (
                      <>
                        {onOpenAdminPanel && (
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              onOpenAdminPanel();
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-amber-950 bg-amber-50 hover:bg-amber-100 font-bold flex items-center gap-2 border-b border-amber-200 cursor-pointer"
                          >
                            <Shield className="w-4 h-4 text-amber-600" />
                            <span>Executive Admin Portal</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenAddModal();
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-brand-brown flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4 text-stone-400" />
                          <span>Publish New Property</span>
                        </button>
                      </>
                    ) : (
                      /* CUSTOMER DEDICATED CONTROLS (Only visible to Customer) */
                      <>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenDashboard('bookings');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-brand-brown flex items-center justify-between font-medium cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-stone-400" />
                            <span>My Booked Tours</span>
                          </div>
                          {bookingsCount > 0 && (
                            <span className="text-xs px-2 py-0.5 bg-brand-brown text-white rounded-full font-bold">
                              {bookingsCount}
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenDashboard('listings');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-brand-brown flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <Layers className="w-4 h-4 text-stone-400" />
                          <span>My Listed Properties</span>
                        </button>
                      </>
                    )}

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOutUser();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-5 py-2.5 bg-brand-brown hover:bg-brand-brown-dark text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:bg-stone-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              onNavigateSection('properties');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-bold text-stone-800"
          >
            Exclusive Properties
          </button>
          <button
            onClick={() => {
              onNavigateSection('services');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-bold text-stone-800"
          >
            Our Services
          </button>
          <button
            onClick={() => {
              onNavigateSection('reviews');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-bold text-stone-800"
          >
            Client Reviews
          </button>

          <div className="pt-3 border-t border-stone-100 space-y-2">
            {isAdmin && onOpenAdminPanel && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminPanel();
                }}
                className="w-full py-2.5 px-4 bg-amber-500 text-stone-950 text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow"
              >
                <Shield className="w-4 h-4" />
                <span>Executive Admin Portal</span>
              </button>
            )}

            {!isAdmin && user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDashboard('bookings');
                }}
                className="w-full py-2.5 px-4 bg-stone-100 text-stone-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-stone-200"
              >
                <Calendar className="w-4 h-4 text-brand-brown" />
                <span>My Booked Tours ({bookingsCount})</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddModal();
              }}
              className="w-full py-2.5 px-4 bg-stone-100 text-stone-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-stone-200"
            >
              <PlusCircle className="w-4 h-4 text-brand-brown" />
              <span>List Property</span>
            </button>

            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOutUser();
                }}
                className="w-full py-2.5 px-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({isAdmin ? 'Admin' : 'Customer'})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-2.5 px-4 bg-brand-brown text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};