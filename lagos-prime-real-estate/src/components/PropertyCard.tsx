import React, { useState } from 'react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Check,
  Building,
  Home,
  Trees,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onOpenDetails: (property: Property) => void;
  onOpenBooking: (property: Property) => void;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => Promise<void>;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onOpenDetails,
  onOpenBooking,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isOwner = user && property.ownerId === user.uid;

  // Format currency (Naira)
  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price);

    if (type === 'Rent') return `${formatted}/yr`;
    if (type === 'Lease') return `${formatted}/yr`;
    return formatted;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'House':
        return <Home className="w-3.5 h-3.5" />;
      case 'Apartment':
        return <Building className="w-3.5 h-3.5" />;
      case 'Plot':
        return <Trees className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(property.id);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Category Tag */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md text-stone-900 font-bold text-xs shadow-sm">
            {getCategoryIcon(property.category)}
            <span>{property.category}</span>
          </span>

          {/* Type Badge (Sell, Rent, Lease) */}
          <span className="px-3 py-1 rounded-lg bg-brand-brown text-white font-extrabold text-xs uppercase tracking-wider shadow">
            {property.type === 'Sell' ? 'For Sale' : property.type === 'Rent' ? 'For Rent' : 'For Lease'}
          </span>
        </div>

        {/* Owner Controls Overlay */}
        {isOwner && (
          <div className="absolute top-12 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(property);
              }}
              title="Edit listing"
              className="p-2 bg-white/90 hover:bg-white text-stone-800 rounded-lg shadow hover:shadow-md transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmDelete(true);
              }}
              title="Delete listing"
              className="p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg shadow hover:shadow-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Delete Confirmation Box */}
        {showConfirmDelete && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center text-white z-20"
          >
            <p className="text-sm font-bold mb-2">Delete this property listing?</p>
            <p className="text-xs text-stone-300 mb-4">This action cannot be undone.</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1.5 bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold hover:bg-stone-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Price Tag in Bottom Left */}
        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-lg sm:text-xl font-extrabold font-display drop-shadow-md">
            {formatPrice(property.price, property.type)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-brown shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Title */}
          <h4
            onClick={() => onOpenDetails(property)}
            className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-brand-brown cursor-pointer transition-colors line-clamp-1"
          >
            {property.title}
          </h4>

          {/* Description snippet */}
          <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 mt-1.5 leading-relaxed">
            {property.description}
          </p>

          {/* Spec Badges (Bedrooms, Bathrooms, Area) */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700 font-semibold">
            {property.category !== 'Plot' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-stone-400" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-stone-400" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 text-brand-brown">
                <Trees className="w-4 h-4" />
                <span>Prime Land Plot</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-stone-400" />
              <span>{property.area}</span>
            </div>
          </div>
        </div>

        {/* Actions Button Row */}
        <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenDetails(property)}
            className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Details</span>
          </button>
          
          <button
            onClick={() => onOpenBooking(property)}
            className="w-full py-2.5 px-3 bg-brand-brown hover:bg-brand-brown-dark text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Book Tour</span>
          </button>
        </div>
      </div>
    </div>
  );
};
