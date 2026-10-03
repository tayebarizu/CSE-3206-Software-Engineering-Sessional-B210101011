import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertyProvider, useProperty } from './context/PropertyContext';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { INITIAL_REVIEWS } from './data/initialReviews';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertyFilter } from './components/PropertyFilter';
import { PropertyCard } from './components/PropertyCard';
import { PropertyModal } from './components/PropertyModal';
import { BookingModal } from './components/BookingModal';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { MyDashboardModal } from './components/MyDashboardModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AuthModal } from './components/AuthModal';
import { WhatWeDoSection } from './components/WhatWeDoSection';
import { ReviewsSection } from './components/ReviewsSection';
import { AddReviewModal } from './components/AddReviewModal';
import { FooterRibbon } from './components/FooterRibbon';
import { Property, ListingType, Review, Booking } from './types';
import {
  Sparkles,
  Home,
  CheckCircle,
  Crown,
  Shield,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, role, isAdmin } = useAuth();
  const {
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
  } = useProperty();

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<Property | null>(null);
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = useState<Property | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardInitialTab, setDashboardInitialTab] = useState<'listings' | 'bookings'>('listings');
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    try {
      const colRef = collection(db, 'reviews');
      const unsub = onSnapshot(colRef, (snapshot) => {
        const fetched: Review[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          fetched.push({
            id: d.id,
            userId: data.userId || '',
            userName: data.userName || 'Client',
            userEmail: data.userEmail || '',
            userAvatar: data.userAvatar || undefined,
            rating: typeof data.rating === 'number' ? data.rating : 5,
            propertyTitle: data.propertyTitle || undefined,
            location: data.location || '',
            comment: data.comment || '',
            clientBadge: data.clientBadge || 'Verified Client',
            createdAt: data.createdAt || new Date().toISOString(),
          });
        });
        const combined = [
          ...fetched,
          ...INITIAL_REVIEWS.filter((ir) => !fetched.some((fr) => fr.id === ir.id)),
        ];
        setReviews(combined);
      });
      return () => unsub();
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const colRef = collection(db, 'bookings');
      const unsub = onSnapshot(colRef, (snapshot) => {
        const fetched: Booking[] = [];
        snapshot.forEach((d) => {
          fetched.push({ id: d.id, ...(d.data() as Omit<Booking, 'id'>) });
        });
        setAllBookings(fetched);
      });
      return () => unsub();
    } catch {}
  }, []);

  const handleAddReviewSubmit = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      const newRef = doc(collection(db, 'reviews'));
      const payload: Omit<Review, 'id'> = {
        ...reviewData,
        createdAt: new Date().toISOString(),
      };
      await setDoc(newRef, payload);
      setReviews((prev) => [{ id: newRef.id, ...payload }, ...prev]);
      showToast('Review published successfully!');
    } catch {
      const fallbackId = `rev-${Date.now()}`;
      setReviews((prev) => [
        { id: fallbackId, ...reviewData, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      showToast('Review posted successfully!');
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch {}
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review removed.');
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: 'Confirmed' | 'Pending' | 'Cancelled'
  ) => {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { status });
      setAllBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      showToast(`Status updated to ${status}!`);
    } catch {
      setAllBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      showToast(`Status updated to ${status}!`);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch {}
    setAllBookings((prev) => prev.filter((b) => b.id !== bookingId));
    showToast('Booking deleted.');
  };

  const handleOpenAddModal = () => {
    if (!user) {
      showToast('Please sign in first.');
      setIsAuthModalOpen(true);
      return;
    }
    setPropertyToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleEditProperty = (prop: Property) => {
    setPropertyToEdit(prop);
    setIsAddEditOpen(true);
  };

  const handleAddOrEditSubmit = async (
    data: Omit<Property, 'id' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'createdAt' | 'updatedAt'>
  ) => {
    if (propertyToEdit) {
      await updateProperty(propertyToEdit.id, data);
      showToast('Property updated successfully!');
    } else {
      await addProperty(data);
      showToast('Property published successfully!');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    await deleteProperty(id);
    showToast('Listing removed.');
  };

  const handleBookViewingConfirm = async (bookingData: {
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
  }) => {
    const id = await bookViewing(bookingData);
    showToast('Inspection booked successfully!');
    return id;
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterType = (type: ListingType | 'All') => {
    setFilters((prev) => ({ ...prev, type }));
  };

  const handleOpenDashboard = (tab: 'listings' | 'bookings' = 'listings') => {
    setDashboardInitialTab(tab);
    setIsDashboardOpen(true);
  };

  const heroProperty = properties.find((p) => p.category === 'House') || properties[0];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য অ্যাডমিন নোটিশ বার */}
      {isAdmin && (
        <div className="bg-stone-900 text-amber-300 text-xs px-4 py-2 border-b border-stone-800 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold">ADMINISTRATOR:</span>
            <span className="text-stone-300">Authorized Admin Mode Active</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Open Admin Portal</span>
            </button>
          </div>
        </div>
      )}

      <Navbar
        onOpenAddModal={handleOpenAddModal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDashboard={handleOpenDashboard}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onNavigateSection={handleNavigateSection}
        bookingsCount={userBookings.length}
      />

      <main className="flex-1">
        <HeroSection
          featuredProperty={heroProperty}
          onFilterType={handleFilterType}
          onOpenBooking={(prop) => setSelectedPropertyForBooking(prop)}
          onOpenDetails={(prop) => setSelectedPropertyDetails(prop)}
          onExploreProperties={() => handleNavigateSection('properties')}
        />

        <section id="properties" className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-bold uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-brown" />
                <span>Prime Portfolio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
                Curated Luxury Residences & Land
              </h2>
            </div>
            <span className="text-xs font-bold text-stone-500">
              Showing {filteredProperties.length} of {properties.length} listings
            </span>
          </div>

          <div className="mb-8">
            <PropertyFilter
              filters={filters}
              setFilters={setFilters}
              onReset={resetFilters}
              totalResults={filteredProperties.length}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200 animate-pulse h-64" />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
              <Home className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-stone-900">No properties found</h3>
              <button onClick={resetFilters} className="mt-4 px-4 py-2 bg-brand-brown text-white text-xs font-bold rounded-xl">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onOpenDetails={(p) => setSelectedPropertyDetails(p)}
                  onOpenBooking={(p) => setSelectedPropertyForBooking(p)}
                  onEdit={handleEditProperty}
                  onDelete={handleDeleteProperty}
                />
              ))}
            </div>
          )}
        </section>

        <WhatWeDoSection
          onSelectType={(t) => handleFilterType(t)}
          onExplore={() => handleNavigateSection('properties')}
        />

        <ReviewsSection
          reviews={reviews}
          onOpenAddReview={() => setIsAddReviewOpen(true)}
          onDeleteReview={handleDeleteReview}
        />
      </main>

      <FooterRibbon onNavigateSection={handleNavigateSection} />

      {/* Modals */}
      <PropertyModal
        property={selectedPropertyDetails}
        onClose={() => setSelectedPropertyDetails(null)}
        onBookViewing={handleBookViewingConfirm}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <BookingModal
        property={selectedPropertyForBooking}
        onClose={() => setSelectedPropertyForBooking(null)}
        onConfirm={handleBookViewingConfirm}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {isAddEditOpen && (
        <AddEditPropertyModal
          propertyToEdit={propertyToEdit}
          onClose={() => setIsAddEditOpen(false)}
          onSubmit={handleAddOrEditSubmit}
        />
      )}

      {isDashboardOpen && (
        <MyDashboardModal
          initialTab={dashboardInitialTab}
          onClose={() => setIsDashboardOpen(false)}
          properties={properties}
          bookings={userBookings}
          onOpenAddModal={handleOpenAddModal}
          onEditProperty={handleEditProperty}
          onDeleteProperty={handleDeleteProperty}
          onCancelBooking={cancelBooking}
          onViewProperty={(p) => setSelectedPropertyDetails(p)}
        />
      )}

      {isAdminPanelOpen && (
        <AdminPanelModal
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          properties={properties}
          bookings={allBookings.length > 0 ? allBookings : userBookings}
          reviews={reviews}
          onOpenAddProperty={handleOpenAddModal}
          onEditProperty={handleEditProperty}
          onDeleteProperty={handleDeleteProperty}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          onDeleteBooking={handleDeleteBooking}
          onDeleteReview={handleDeleteReview}
          onViewProperty={(p) => setSelectedPropertyDetails(p)}
        />
      )}

      <AddReviewModal
        isOpen={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        onSubmitReview={handleAddReviewSubmit}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <MainApp />
      </PropertyProvider>
    </AuthProvider>
  );
}