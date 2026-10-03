export type PropertyCategory = 'House' | 'Apartment' | 'Plot';
export type ListingType = 'Sell' | 'Rent' | 'Lease';

export interface Property {
  id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  type: ListingType;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  imageUrl: string;
  galleryImages?: {
    kitchen?: string;
    living?: string;
    bedroom?: string;
  };
  features: string[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: number;
  propertyImageUrl: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  preferredDate: string;
  preferredTime: string;
  viewingType: 'In-person' | 'Virtual';
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt?: string;
}

export interface FilterState {
  searchQuery: string;
  category: 'All' | PropertyCategory;
  type: 'All' | ListingType;
  maxPrice: number;
  location: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  rating: number;
  propertyTitle?: string;
  location?: string;
  comment: string;
  clientBadge?: string;
  createdAt: string;
}
