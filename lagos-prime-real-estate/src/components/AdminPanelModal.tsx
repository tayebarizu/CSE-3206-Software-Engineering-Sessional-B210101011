import React, { useState } from 'react';
import {
  X,
  Shield,
  Trash2,
} from 'lucide-react';
import { Property, Booking, Review } from '../types';
import { useAuth } from '../context/AuthContext';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  bookings: Booking[];
  reviews: Review[];
  onOpenAddProperty: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => Promise<void>;
  onUpdateBookingStatus: (bookingId: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => Promise<void>;
  onDeleteBooking: (bookingId: string) => Promise<void>;
  onDeleteReview: (id: string) => Promise<void>;
  onViewProperty: (property: Property) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  properties,
  bookings,
  reviews,
  onOpenAddProperty,
  onEditProperty,
  onDeleteProperty,
  onUpdateBookingStatus,
  onDeleteBooking,
  onDeleteReview,
}) => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'properties' | 'reviews'>('overview');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'Pending' | 'Confirmed' | 'Cancelled'>('all');

  if (!isOpen || !isAdmin) return null;

  const totalPropertyValue = properties.reduce((acc, p) => acc + (p.price || 0), 0);
  const pendingBookings = bookings.filter((b) => b.status === 'Pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== 'all' && b.status !== bookingFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold font-display">Executive Admin Portal</h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-stone-950 uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Manage all client inspections, properties & reviews.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2"></div>
              <span className="text-xs text-stone-300 font-bold">
                {user?.displayName || 'Administrator'}
              </span>
            </div>
            <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 bg-stone-50 border-b border-stone-200 flex gap-4 text-xs font-bold">
          {(['overview', 'bookings', 'properties', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 capitalize cursor-pointer ${
                activeTab === tab ? 'border-brand-brown text-brand-brown' : 'border-transparent text-stone-500'
              }`}
            >
              {tab === 'overview' ? 'Overview' : tab === 'bookings' ? `Bookings (${bookings.length})` : tab === 'properties' ? `Properties (${properties.length})` : `Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-xs text-stone-400 font-semibold">Total Listings</span>
                  <div className="text-2xl font-black text-stone-900 mt-1">{properties.length}</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <span className="text-xs text-amber-700 font-semibold">Pending Inspections</span>
                  <div className="text-2xl font-black text-amber-950 mt-1">{pendingBookings.length}</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-xs text-emerald-700 font-semibold">Confirmed Bookings</span>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{confirmedBookings.length}</div>
                </div>
              </div>

              <div className="p-5 bg-stone-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Total Portfolio Value</span>
                  <div className="text-xl sm:text-2xl font-black mt-1">₦{(totalPropertyValue / 1000000).toLocaleString()} Million</div>
                </div>
                <button
                  onClick={onOpenAddProperty}
                  className="px-4 py-2 bg-brand-brown text-white text-xs font-bold rounded-xl cursor-pointer shadow hover:bg-brand-brown-dark"
                >
                  + Add Property
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(['all', 'Pending', 'Confirmed', 'Cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                      bookingFilter === st ? 'bg-stone-900 text-white' : 'bg-white text-stone-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-10 text-xs text-stone-500">No bookings found.</div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => (
                    <div key={b.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-stone-900">{b.propertyTitle}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">Client: <strong>{b.userName}</strong> • Phone: {b.userPhone || 'N/A'}</p>
                        <p className="text-[11px] text-stone-400">Date: {b.preferredDate} ({b.preferredTime})</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.status !== 'Confirmed' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'Confirmed')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        {b.status !== 'Cancelled' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'Cancelled')}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                        <button onClick={() => onDeleteBooking(b.id)} className="p-1.5 text-stone-400 hover:text-red-600 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {properties.map((p) => (
                <div key={p.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex gap-3">
                  <img src={p.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs truncate">{p.title}</h4>
                      <p className="text-[11px] text-stone-500">{p.location}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <button onClick={() => onEditProperty(p)} className="text-[11px] font-bold text-brand-brown cursor-pointer">Edit</button>
                      <button onClick={() => onDeleteProperty(p.id)} className="text-[11px] font-bold text-red-600 ml-auto cursor-pointer">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs">{r.userName} ({r.rating}★)</span>
                    <p className="text-xs text-stone-600 mt-0.5">&ldquo;{r.comment}&rdquo;</p>
                  </div>
                  <button onClick={() => onDeleteReview(r.id)} className="p-2 text-stone-400 hover:text-red-600 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};