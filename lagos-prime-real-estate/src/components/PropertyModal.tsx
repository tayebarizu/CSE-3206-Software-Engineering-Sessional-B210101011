import React, { useState } from 'react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
  onBookViewing: (bookingData: {
    propertyId: string;
    propertyTitle: string;
    propertyLocation: string;
    propertyPrice: number;
    propertyImageUrl: string;
    userPhone: string;
    preferredDate: string;
    preferredTime: string;
    viewingType: 'In-person' | 'Virtual';
    notes?: string;
  }) => Promise<string>;
  onOpenAuth: () => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  onClose,
  onBookViewing,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  // Booking Form State
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('10:00 AM');
  const [viewingType, setViewingType] = useState<'In-person' | 'Virtual'>('In-person');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!property) return null;

  const currentDisplayPhoto = selectedPhoto || property.imageUrl;

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price);
    if (type === 'Rent' || type === 'Lease') return `${formatted}/yr`;
    return formatted;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!preferredDate) {
      setBookingError('Please choose a preferred inspection date.');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      await onBookViewing({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyPrice: property.price,
        propertyImageUrl: property.imageUrl,
        userPhone: phone || 'Provided upon confirmation',
        preferredDate,
        preferredTime,
        viewingType,
        notes,
      });
      setBookingSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not schedule booking.';
      setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-brand-brown text-white text-xs font-bold uppercase rounded-md">
              {property.type === 'Sell' ? 'For Sale' : property.type === 'Rent' ? 'For Rent' : 'For Lease'}
            </span>
            <span className="text-xs text-stone-300 font-semibold">• {property.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors text-xs flex items-center gap-1 font-semibold"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-8 space-y-8">
          
          {/* Main Visual & 3 Inset Rooms (Reference Flyer Design) */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 aspect-[16/9] sm:aspect-[21/9]">
              <img
                src={currentDisplayPhoto}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-300 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-brown-light" />
                    <span>{property.location}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                    {property.title}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="block text-xs uppercase text-stone-300 font-semibold">Pricing</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-display">
                    {formatPrice(property.price, property.type)}
                  </span>
                </div>
              </div>
            </div>

            {/* Inset Thumbnails: Main, Kitchen, Living, Bedroom */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-3">
              <button
                onClick={() => setSelectedPhoto(property.imageUrl)}
                className={`relative rounded-xl overflow-hidden border-2 aspect-[4/3] bg-stone-900 ${
                  currentDisplayPhoto === property.imageUrl ? 'border-brand-brown ring-2 ring-brand-brown' : 'border-stone-200'
                }`}
              >
                <img src={property.imageUrl} alt="Exterior" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                  Exterior
                </span>
              </button>

              <button
                onClick={() => setSelectedPhoto(property.galleryImages?.kitchen || property.imageUrl)}
                className={`relative rounded-xl overflow-hidden border-2 aspect-[4/3] bg-stone-900 ${
                  currentDisplayPhoto === (property.galleryImages?.kitchen || '') ? 'border-brand-brown ring-2 ring-brand-brown' : 'border-stone-200'
                }`}
              >
                <img
                  src={property.galleryImages?.kitchen || property.imageUrl}
                  alt="Kitchen"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                  Kitchen
                </span>
              </button>

              <button
                onClick={() => setSelectedPhoto(property.galleryImages?.living || property.imageUrl)}
                className={`relative rounded-xl overflow-hidden border-2 aspect-[4/3] bg-stone-900 ${
                  currentDisplayPhoto === (property.galleryImages?.living || '') ? 'border-brand-brown ring-2 ring-brand-brown' : 'border-stone-200'
                }`}
              >
                <img
                  src={property.galleryImages?.living || property.imageUrl}
                  alt="Living"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                  Living Room
                </span>
              </button>

              <button
                onClick={() => setSelectedPhoto(property.galleryImages?.bedroom || property.imageUrl)}
                className={`relative rounded-xl overflow-hidden border-2 aspect-[4/3] bg-stone-900 ${
                  currentDisplayPhoto === (property.galleryImages?.bedroom || '') ? 'border-brand-brown ring-2 ring-brand-brown' : 'border-stone-200'
                }`}
              >
                <img
                  src={property.galleryImages?.bedroom || property.imageUrl}
                  alt="Bedroom"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                  Bedroom
                </span>
              </button>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-center">
              <span className="block text-xs text-stone-500 font-semibold mb-1">Bedrooms</span>
              <span className="text-lg font-bold text-stone-900 flex items-center justify-center gap-1.5">
                <Bed className="w-4 h-4 text-brand-brown" />
                {property.bedrooms > 0 ? property.bedrooms : 'N/A'}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-center">
              <span className="block text-xs text-stone-500 font-semibold mb-1">Bathrooms</span>
              <span className="text-lg font-bold text-stone-900 flex items-center justify-center gap-1.5">
                <Bath className="w-4 h-4 text-brand-brown" />
                {property.bathrooms > 0 ? property.bathrooms : 'N/A'}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-center">
              <span className="block text-xs text-stone-500 font-semibold mb-1">Plot / Floor Area</span>
              <span className="text-lg font-bold text-stone-900 flex items-center justify-center gap-1.5">
                <Maximize className="w-4 h-4 text-brand-brown" />
                {property.area}
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-center">
              <span className="block text-xs text-stone-500 font-semibold mb-1">Estate Security</span>
              <span className="text-lg font-bold text-stone-900 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-700" />
                24/7 Gated
              </span>
            </div>
          </div>

          {/* Dual Layout: Features Card (Brown) + Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Features (Signature Brown Box from Reference Flyer) */}
            <div className="md:col-span-6 bg-brand-brown text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-display mb-4">
                  Features
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm font-medium">
                  {property.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 text-xs text-stone-200 flex items-center justify-between">
                <span>Developer / Host: <strong className="text-white">{property.ownerName}</strong></span>
                <span>Category: <strong className="text-white">{property.category}</strong></span>
              </div>
            </div>

            {/* Description & Host details */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display mb-2">
                  Property Overview
                </h3>
                <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Listing Agent / Owner:</span>
                  <span className="font-bold text-stone-900">{property.ownerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Contact:</span>
                  <span className="font-bold text-stone-900">{property.ownerEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Direct Line:</span>
                  <span className="font-bold text-brand-brown">+234 811 223 1041</span>
                </div>
              </div>
            </div>

          </div>

          {/* Book A Property Viewing Section */}
          <div className="mt-8 pt-6 border-t border-stone-200 bg-stone-50 rounded-2xl p-6 sm:p-7 border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-display flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-brown" />
                  <span>Schedule an Exclusive Viewing</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Book a private walkthrough with our property specialist.
                </p>
              </div>

              {bookingSuccess && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 text-xs font-bold rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Viewing Confirmed!</span>
                </div>
              )}
            </div>

            {bookingSuccess ? (
              <div className="p-6 bg-green-50 rounded-xl border border-green-200 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-green-900">Your viewing is confirmed</h4>
                <p className="text-xs text-green-700 mt-1">
                  We look forward to hosting you on <strong>{preferredDate}</strong> at <strong>{preferredTime}</strong> ({viewingType}).
                  Our representative will contact you shortly.
                </p>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
                >
                  Book Another Slot
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {bookingError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-200">
                    {bookingError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                    />
                  </div>

                  {/* Preferred Time Slot */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Time Slot *
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                    >
                      <option value="10:00 AM">10:00 AM (Morning)</option>
                      <option value="12:00 PM">12:00 PM (Noon)</option>
                      <option value="02:30 PM">02:30 PM (Afternoon)</option>
                      <option value="04:30 PM">04:30 PM (Evening Sunset)</option>
                    </select>
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Tour Format
                    </label>
                    <select
                      value={viewingType}
                      onChange={(e) => setViewingType(e.target.value as 'In-person' | 'Virtual')}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                    >
                      <option value="In-person">In-Person Walkthrough</option>
                      <option value="Virtual">Virtual Video Tour (Live)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Phone Number / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +234 811 223 1041"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                    />
                  </div>

                  {/* Special requests */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Special Inquiries or Questions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Inquire on payment plan, title search"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    {user ? `Booking as ${user.displayName || user.email}` : 'Sign-in required to confirm booking'}
                  </span>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="px-6 py-2.5 bg-brand-brown hover:bg-brand-brown-dark text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-amber-300" />
                    <span>{bookingLoading ? 'Reserving Slot...' : 'Confirm Viewing Appointment'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
