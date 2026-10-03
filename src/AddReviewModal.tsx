import React, { useState } from 'react';
import { X, Star, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Review } from '../types';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  onOpenAuth: () => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [location, setLocation] = useState('Lekki Phase 1, Lagos');
  const [clientBadge, setClientBadge] = useState('Verified Homeowner');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!comment.trim()) {
      setError('Please write a few words about your experience.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmitReview({
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Valued Client',
        userEmail: user.email || '',
        userAvatar: user.photoURL || undefined,
        rating,
        location: location.trim(),
        clientBadge,
        comment: comment.trim(),
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to publish review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        <div className="p-5 bg-brand-brown text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base font-display">Share Client Experience</h3>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h4 className="text-lg font-bold text-stone-900">Review Published!</h4>
              <p className="text-xs text-stone-600">Your review is now live on Lagos Prime.</p>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              {/* Star Rating */}
              <div className="text-center py-2 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="block text-xs font-bold text-stone-700 mb-1">Select Rating</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          rating >= star ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Location / City</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the property inspection, customer service..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none resize-none"
                />
              </div>

              {!user && (
                <div className="p-2.5 bg-amber-50 text-amber-900 text-xs rounded-xl">
                  Sign in required to publish your review.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-brown hover:bg-brand-brown-dark text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : user ? 'Publish Review' : 'Sign In & Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};