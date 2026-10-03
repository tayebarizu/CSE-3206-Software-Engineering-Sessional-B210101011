import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from './AuthContext';
import { Property, Booking, FilterState, PropertyCategory, ListingType } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredProperties: Property[];
  addProperty: (propertyData: Omit<Property, 'id' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProperty: (id: string, propertyData: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  bookViewing: (bookingData: Omit<Booking, 'id' | 'userId' | 'userName' | 'userEmail' | 'createdAt' | 'status'>) => Promise<string>;
  userBookings: Booking[];
  cancelBooking: (bookingId: string) => Promise<void>;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'All',
  type: 'All',
  maxPrice: 1000000000, // ₦1 Billion
  location: 'All',
  sortBy: 'featured',
};

const BASE_PROPERTIES: Property[] = INITIAL_PROPERTIES.map((p, idx) => ({
  id: `prop-base-${idx + 1}`,
  ...p,
}));

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Always initialize with all 7 luxury properties so the catalog is never sparse
  const [properties, setProperties] = useState<Property[]>(BASE_PROPERTIES);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const isInitialSnapshotDone = useRef<boolean>(false);

  // Subscribe to public properties in real time from Firestore and merge with base properties
  useEffect(() => {
    const colRef = collection(db, 'properties');

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        isInitialSnapshotDone.current = true;
        setLoading(false);

        const fetched: Property[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Property, 'id'>),
          });
        });

        let deletedIds = new Set<string>();
        try {
          const stored = localStorage.getItem('deleted_properties');
          if (stored) deletedIds = new Set(JSON.parse(stored));
        } catch {}

        // Combine user created properties from Firestore with the 7 curated base properties
        const combined: Property[] = [
          ...fetched,
          ...BASE_PROPERTIES.filter(
            (bp) =>
              !deletedIds.has(bp.id) &&
              !fetched.some((fp) => fp.id === bp.id || (fp.title === bp.title && fp.location === bp.location))
          ),
        ];

        setProperties(combined);
      },
      (error) => {
        setLoading(false);
        try {
          handleFirestoreError(error, OperationType.GET, 'properties');
        } catch (e) {
          console.warn('Firestore subscription fallback to local catalog:', e);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to current user's viewing bookings
  useEffect(() => {
    if (!user) {
      setUserBookings([]);
      return;
    }

    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingsList: Booking[] = [];
        snapshot.forEach((docSnap) => {
          bookingsList.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Booking, 'id'>),
          });
        });
        setUserBookings(bookingsList);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, 'bookings');
        } catch (e) {
          console.warn('Firestore bookings subscription error:', e);
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Add property listing
  const addProperty = async (
    propertyData: Omit<Property, 'id' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    if (!user) {
      throw new Error('You must be signed in to add a property listing.');
    }

    const path = 'properties';
    try {
      const newDocRef = doc(collection(db, path));
      const payload: Omit<Property, 'id'> = {
        ...propertyData,
        ownerId: user.uid,
        ownerName: user.displayName || 'Property Host',
        ownerEmail: user.email || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(newDocRef, payload);
      
      // Optimistic update
      setProperties((prev) => [{ id: newDocRef.id, ...payload }, ...prev.filter((p) => p.id !== newDocRef.id)]);
      return newDocRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      throw err;
    }
  };

  // Update property listing
  const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<void> => {
    if (!user) throw new Error('You must be signed in to edit properties.');
    
    if (!id.startsWith('prop-base-')) {
      const path = `properties/${id}`;
      try {
        const docRef = doc(db, 'properties', id);
        const updatePayload = {
          ...propertyData,
          updatedAt: new Date().toISOString(),
        };
        await updateDoc(docRef, updatePayload);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
        throw err;
      }
    }

    // Optimistic update
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...propertyData } : item))
    );
  };

  // Delete property listing
  const deleteProperty = async (id: string): Promise<void> => {
    if (!user) throw new Error('You must be signed in to delete properties.');
    
    // Save to deleted list so base properties stay removed if deleted
    try {
      const stored = localStorage.getItem('deleted_properties');
      const deletedIds: string[] = stored ? JSON.parse(stored) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('deleted_properties', JSON.stringify(deletedIds));
      }
    } catch {}

    if (!id.startsWith('prop-base-')) {
      const path = `properties/${id}`;
      try {
        const docRef = doc(db, 'properties', id);
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    }

    // Optimistic update
    setProperties((prev) => prev.filter((item) => item.id !== id));
  };

  // Book a viewing appointment
  const bookViewing = async (
    bookingData: Omit<Booking, 'id' | 'userId' | 'userName' | 'userEmail' | 'createdAt' | 'status'>
  ): Promise<string> => {
    if (!user) throw new Error('Please sign in or create an account to book a viewing.');
    const path = 'bookings';
    try {
      const newDocRef = doc(collection(db, path));
      const payload: Omit<Booking, 'id'> = {
        ...bookingData,
        userId: user.uid,
        userName: user.displayName || bookingData.userPhone || 'Guest Client',
        userEmail: user.email || 'client@example.com',
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };

      await setDoc(newDocRef, payload);
      setUserBookings((prev) => [{ id: newDocRef.id, ...payload }, ...prev]);
      return newDocRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
      throw err;
    }
  };

  // Cancel viewing appointment
  const cancelBooking = async (bookingId: string): Promise<void> => {
    if (!user) throw new Error('Please sign in to manage appointments.');
    const path = `bookings/${bookingId}`;
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await deleteDoc(docRef);
      setUserBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
      throw err;
    }
  };

  // Instant reset of filters
  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      category: 'All',
      type: 'All',
      maxPrice: 1000000000,
      location: 'All',
      sortBy: 'featured',
    });
  }, []);

  // Filter and sort properties safely
  const filteredProperties = properties.filter((prop) => {
    if (!prop) return false;

    // Category filter: House, Apartment, Plot
    if (filters.category !== 'All' && prop.category !== filters.category) return false;

    // Type filter: Sell, Rent, Lease
    if (filters.type !== 'All' && prop.type !== filters.type) return false;

    // Price filter
    if (typeof prop.price === 'number' && prop.price > filters.maxPrice) return false;

    // Location filter
    if (filters.location && filters.location !== 'All') {
      const propLoc = (prop.location || '').toLowerCase();
      const filterLoc = filters.location.toLowerCase();
      if (!propLoc.includes(filterLoc)) return false;
    }

    // Search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = (prop.title || '').toLowerCase().includes(q);
      const matchDesc = (prop.description || '').toLowerCase().includes(q);
      const matchLoc = (prop.location || '').toLowerCase().includes(q);
      const matchCat = (prop.category || '').toLowerCase().includes(q);
      const matchFeat = Array.isArray(prop.features) && prop.features.some((f) => (f || '').toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchLoc && !matchCat && !matchFeat) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (filters.sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (filters.sortBy === 'newest') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
    return 0; // featured default
  });

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        filters,
        setFilters,
        resetFilters,
        filteredProperties,
        addProperty,
        updateProperty,
        deleteProperty,
        bookViewing,
        userBookings,
        cancelBooking,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};
