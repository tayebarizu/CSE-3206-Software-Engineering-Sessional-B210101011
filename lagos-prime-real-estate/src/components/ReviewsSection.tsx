import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle, PlusCircle, MapPin, Building, Sparkles, Trash2 } from 'lucide-react';
import { Review } from '../types';
import { useAuth } from '../context/AuthContext';

interface ReviewsSectionProps {
  reviews: Review[];
  onOpenAddReview: () => void;
  onDeleteReview?: (id: string) => Promise<void>;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onOpenAddReview,
  onDeleteReview,
}) => {
  const { user } = useAuth();
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : '5.0';

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-stone-100/70 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-brown" />
              <span>Verified Client Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-display tracking-tight">
              What Lagos Prime Clients Say
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Authentic inspection reports and reviews from verified homeowners, diaspora buyers, and tenants.
            </p>
          </div>

          <button
            onClick={onOpenAddReview}
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-brown hover:bg-brand-brown-dark text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Rating Metrics Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="text-center md:text-left md:border-r border-stone-200 pr-4">
            <span className="text-4xl sm:text-5xl font-black text-stone-900 font-display">
              {averageRating}
            </span>
            <div className="flex items-center justify-center md:justify-start gap-1 my-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-500 font-semibold">
              {reviews.length} Verified Reviews
            </p>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Title Verified</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Governor&apos;s Consent & C of O verified.</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-brand-brown" />
                <span>VIP Inspection</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Dedicated real estate concierge.</p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Top Rated</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Ranked #1 for luxury acquisitions.</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              filterRating === 'all'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-200'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filterRating === star
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200'
              }`}
            >
              {star} Stars ({reviews.filter((r) => r.rating === star).length})
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => {
            const isAuthor = user && user.uid === rev.userId;
            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      {rev.clientBadge || 'Verified Client'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{rev.userName}</h4>
                      <span className="text-[10px] text-stone-400">{rev.location || 'Lagos, Nigeria'}</span>
                    </div>
                    {isAuthor && onDeleteReview && (
                      <button
                        onClick={() => onDeleteReview(rev.id)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};