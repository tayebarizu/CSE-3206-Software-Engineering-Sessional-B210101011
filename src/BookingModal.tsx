import React, { useState, useRef } from 'react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface BookingModalProps {
  property: Property | null;
  onClose: () => void;
  onConfirm: (bookingData: {
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

export const BookingModal: React.FC<BookingModalProps> = ({
  property,
  onClose,
  onConfirm,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [viewingType, setViewingType] = useState<'In-person' | 'Virtual'>('In-person');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ডাবল-ক্লিক আটকানোর জন্য Ref Lock
  const isSubmittingRef = useRef(false);

  if (!property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // অলরেডি সাবমিট হতে থাকলে সাথে সাথে থামিয়ে দেবে
    if (loading || isSubmittingRef.current) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    if (!preferredDate) {
      setError('Please select an inspection date.');
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      await onConfirm({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyPrice: property.price,
        propertyImageUrl: property.imageUrl,
        userPhone: phone || 'WhatsApp on file',
        preferredDate,
        preferredTime,
        viewingType,
        notes,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to book viewing.');
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 bg-brand-brown text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base font-display">Schedule Property Inspection</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Summary Pill */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 mb-5">
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-stone-900 truncate">{property.title}</h4>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-brand-brown" />
                <span className="truncate">{property.location}</span>
              </p>
            </div>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-stone-900">Viewing Reserved!</h4>
              <p className="text-xs text-stone-600 mt-1.5 max-w-xs mx-auto">
                Your inspection for <strong>{property.title}</strong> is booked for {preferredDate} at {preferredTime} ({viewingType}).
              </p>
              <button
                onClick={onClose}
                className="mt-5 w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-black"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Inspection Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preferred Time *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Format selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Viewing Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingType('In-person')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      viewingType === 'In-person'
                        ? 'bg-brand-brown text-white border-brand-brown shadow'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>In-Person Walk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingType('Virtual')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      viewingType === 'Virtual'
                        ? 'bg-brand-brown text-white border-brand-brown shadow'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Virtual Video</span>
                  </button>
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  WhatsApp / Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+234 811 223 1041"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Inquiries / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any particular questions regarding title or payment?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                />
              </div>

              {!user && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                  You will be prompted to sign in with Google or create an account to finalize your booking.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-brown hover:bg-brand-brown-dark text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Clock className="w-4 h-4 text-amber-300" />
                <span>{loading ? 'Reserving...' : user ? 'Confirm Appointment' : 'Sign In & Confirm'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};