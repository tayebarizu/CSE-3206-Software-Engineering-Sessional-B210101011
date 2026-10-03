import React, { useState } from 'react';
import { Property, Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Layers,
  Calendar,
  Trash2,
  Edit3,
  Plus,
  MapPin,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

interface MyDashboardModalProps {
  initialTab?: 'listings' | 'bookings';
  onClose: () => void;
  properties: Property[];
  bookings: Booking[];
  onOpenAddModal: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => Promise<void>;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onViewProperty: (property: Property) => void;
}

export const MyDashboardModal: React.FC<MyDashboardModalProps> = ({
  initialTab = 'listings',
  onClose,
  properties,
  bookings,
  onOpenAddModal,
  onEditProperty,
  onDeleteProperty,
  onCancelBooking,
  onViewProperty,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>(initialTab);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter properties owned by current user
  const myListings = properties.filter((p) => user && p.ownerId === user.uid);

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) return;
    setActionLoading(id);
    try {
      await onDeleteProperty(id);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Cancel this viewing inspection appointment?')) return;
    setActionLoading(id);
    try {
      await onCancelBooking(id);
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold font-display">Client Management Portal</h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Manage your published listings and inspection viewing schedule.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-6 pt-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'listings'
                  ? 'border-brand-brown text-brand-brown'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>My Property Listings</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-stone-200 text-stone-800">
                {myListings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'bookings'
                  ? 'border-brand-brown text-brand-brown'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>My Viewing Appointments</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-brand-brown text-white">
                {bookings.length}
              </span>
            </button>
          </div>

          {activeTab === 'listings' && (
            <button
              onClick={() => {
                onClose();
                onOpenAddModal();
              }}
              className="mb-2 px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>Add Listing</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: LISTINGS */}
          {activeTab === 'listings' && (
            <div>
              {myListings.length === 0 ? (
                <div className="text-center py-12 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                  <div className="w-12 h-12 bg-stone-200 text-stone-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900">No properties listed yet</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                    List your house, apartment, or plot for sale, rent, or lease and reach qualified buyers across Lagos.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAddModal();
                    }}
                    className="px-5 py-2.5 bg-brand-brown text-white rounded-xl text-xs font-bold shadow hover:bg-brand-brown-dark transition-all"
                  >
                    Create Your First Listing
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myListings.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-brand-brown/50 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={prop.imageUrl}
                          alt={prop.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-100"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-brown text-white uppercase">
                              {prop.type}
                            </span>
                            <span className="text-xs font-semibold text-stone-500">
                              {prop.category}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-stone-900">{prop.title}</h4>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-brand-brown" />
                            <span>{prop.location}</span>
                          </p>
                          <p className="text-xs font-bold text-brand-brown mt-1">
                            {formatPrice(prop.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            onClose();
                            onViewProperty(prop);
                          }}
                          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onEditProperty(prop);
                          }}
                          className="p-2 text-stone-700 hover:text-brand-brown hover:bg-stone-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteListing(prop.id)}
                          disabled={actionLoading === prop.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            {actionLoading === prop.id ? 'Deleting...' : 'Delete'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              {bookings.length === 0 ? (
                <div className="text-center py-12 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                  <div className="w-12 h-12 bg-stone-200 text-stone-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900">No viewing appointments booked</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                    Browse our luxury properties and book an in-person walkthrough or virtual video tour.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-brand-brown text-white rounded-xl text-xs font-bold shadow hover:bg-brand-brown-dark transition-all"
                  >
                    Browse Available Properties
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-brand-brown/50 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={booking.propertyImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                          alt={booking.propertyTitle}
                          className="w-18 h-18 rounded-xl object-cover shrink-0 bg-stone-100"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                              {booking.status}
                            </span>
                            <span className="text-xs font-semibold text-stone-600">
                              {booking.viewingType === 'Virtual' ? '🎥 Live Virtual Tour' : '🚶 In-Person Inspection'}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-stone-900">
                            {booking.propertyTitle}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                            <span className="flex items-center gap-1 font-semibold text-stone-800">
                              <Calendar className="w-3.5 h-3.5 text-brand-brown" />
                              {booking.preferredDate}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-stone-800">
                              <Clock className="w-3.5 h-3.5 text-brand-brown" />
                              {booking.preferredTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {booking.propertyLocation}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="text-[11px] text-stone-500 mt-1 italic">
                              Note: &quot;{booking.notes}&quot;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{actionLoading === booking.id ? 'Cancelling...' : 'Cancel Appointment'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
