import React, { useState, useEffect, useRef } from 'react';
import { Property, PropertyCategory, ListingType } from '../types';
import {
  X,
  Plus,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Upload,
  Link,
  Eye,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface AddEditPropertyModalProps {
  propertyToEdit?: Property | null;
  onClose: () => void;
  onSubmit: (data: Omit<Property, 'id' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'createdAt' | 'updatedAt'>) => Promise<string | void>;
}

// Curated high-res architectural presets (reliable CDN web URLs)
const PRESET_IMAGES = [
  {
    label: 'Modern Luxury Villa',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    category: 'House',
  },
  {
    label: 'Minimalist White Residence',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    category: 'House',
  },
  {
    label: 'Waterfront Penthouse',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    category: 'Apartment',
  },
  {
    label: 'Skyline Modern Highrise',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    category: 'Apartment',
  },
  {
    label: 'Waterfront Sandfilled Land',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    category: 'Plot',
  },
  {
    label: 'Gated Estate Corner Plot',
    url: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80',
    category: 'Plot',
  },
];

const DEFAULT_KITCHEN_IMG = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80';
const DEFAULT_LIVING_IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
const DEFAULT_BEDROOM_IMG = 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80';

const DEFAULT_FEATURES = [
  '5 Bedrooms',
  'Guest Room',
  '3 Bath Room',
  'laundry Room',
  'Dinning Room',
  'Fully Gated Estate',
  'Swimming Pool',
  '24/7 Security & CCTV',
  'Smart Home Automation',
  'Backup Generator',
  'Governor’s Consent Title',
];

function cleanImageUrl(raw: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('data:image')) return trimmed;
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('blob:')) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    return 'https://' + trimmed;
  }
  return trimmed;
}

// Compress uploaded photos so they fit within Firestore document limits (< 200KB)
function compressImageFile(file: File, maxWidth = 1200, maxHeight = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  propertyToEdit,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(propertyToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('House');
  const [type, setType] = useState<ListingType>('Sell');
  const [price, setPrice] = useState<number | string>('');
  const [location, setLocation] = useState('Lekki Phase 1, Lagos');
  const [bedrooms, setBedrooms] = useState<number>(4);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [area, setArea] = useState('500 sqm');
  
  // Image state
  const [imageUrl, setImageUrl] = useState<string>(PRESET_IMAGES[0].url);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const [imageLoadSuccess, setImageLoadSuccess] = useState<boolean>(true);
  
  // Inset images
  const [kitchenUrl, setKitchenUrl] = useState(DEFAULT_KITCHEN_IMG);
  const [livingUrl, setLivingUrl] = useState(DEFAULT_LIVING_IMG);
  const [bedroomUrl, setBedroomUrl] = useState(DEFAULT_BEDROOM_IMG);

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    '5 Bedrooms',
    'Guest Room',
    '3 Bath Room',
    'laundry Room',
    'Dinning Room',
    'Fully Gated Estate',
  ]);
  const [customFeature, setCustomFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyToEdit) {
      setTitle(propertyToEdit.title);
      setDescription(propertyToEdit.description);
      setCategory(propertyToEdit.category);
      setType(propertyToEdit.type);
      setPrice(propertyToEdit.price);
      setLocation(propertyToEdit.location);
      setBedrooms(propertyToEdit.bedrooms);
      setBathrooms(propertyToEdit.bathrooms);
      setArea(propertyToEdit.area);
      setImageUrl(propertyToEdit.imageUrl);
      if (propertyToEdit.galleryImages) {
        setKitchenUrl(propertyToEdit.galleryImages.kitchen || DEFAULT_KITCHEN_IMG);
        setLivingUrl(propertyToEdit.galleryImages.living || DEFAULT_LIVING_IMG);
        setBedroomUrl(propertyToEdit.galleryImages.bedroom || DEFAULT_BEDROOM_IMG);
      }
      setSelectedFeatures(propertyToEdit.features || []);
    }
  }, [propertyToEdit]);

  const handleUrlChange = (val: string) => {
    setImageUrl(val);
    setImageLoadError(false);
    setImageLoadSuccess(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    try {
      setError(null);
      // Compress the image via canvas to ~80-120KB so Firestore accepts it instantly
      const compressed = await compressImageFile(file);
      setImageUrl(compressed);
      setImageLoadError(false);
      setImageLoadSuccess(true);
    } catch {
      setError('Failed to process image file. Please try another image.');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      setSelectedFeatures([...selectedFeatures, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a property title or name.');
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError('Please enter a valid listing price.');
      return;
    }

    const cleanedImage = cleanImageUrl(imageUrl);
    if (!cleanedImage) {
      setError('Please provide an image URL or choose a preset/upload.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || 'Exquisite modern residence in prime location.',
        category,
        type,
        price: numericPrice,
        location: location.trim(),
        bedrooms: category === 'Plot' ? 0 : Number(bedrooms),
        bathrooms: category === 'Plot' ? 0 : Number(bathrooms),
        area: area.trim() || (category === 'Plot' ? '1,000 sqm' : '450 sqm'),
        imageUrl: cleanedImage,
        galleryImages: {
          kitchen: cleanImageUrl(kitchenUrl) || DEFAULT_KITCHEN_IMG,
          living: cleanImageUrl(livingUrl) || DEFAULT_LIVING_IMG,
          bedroom: cleanImageUrl(bedroomUrl) || DEFAULT_BEDROOM_IMG,
        },
        features: selectedFeatures,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display">
              {isEditing ? 'Edit Property Listing' : 'List a New Property for Sale or Rent'}
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Enter property specifications, upload photos or paste image URLs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-brand-brown">
              1. General Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Property Title / Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 5 Bedroom Ultra-Luxury Waterfront Villa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Description / Overview
              </label>
              <textarea
                rows={3}
                placeholder="Describe architectural features, title deeds (C of O, Governor's Consent), finishes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
              />
            </div>

            {/* Category & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Property Category *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['House', 'Apartment', 'Plot'] as PropertyCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        category === cat
                          ? 'bg-brand-brown text-white border-brand-brown shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Listing Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Sell', 'Rent', 'Lease'] as ListingType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        type === t
                          ? 'bg-brand-brown text-white border-brand-brown shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {t === 'Sell' ? 'For Sale' : t === 'Rent' ? 'For Rent' : 'For Lease'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Price (₦ NGN) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="e.g. 380000000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Neighborhood / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lekki Phase 1, Ikoyi, Banana Island"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                />
              </div>
            </div>

            {/* Specifications: Beds, Baths, Area */}
            {category !== 'Plot' ? (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-brown focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-brown focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Built Area
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 650 sqm"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-brown focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Plot Dimensions / Land Area
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. 1,200 sqm or 2 Plots"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-brown focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Section 2: Architectural Imagery (URL Input + File Upload + Live Preview) */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-brand-brown">
                2. Property Photos & Imagery
              </h3>
              <span className="text-xs text-stone-500 font-medium">
                URL link, local upload, or curated preset
              </span>
            </div>

            {/* Custom URL Input & Direct File Upload */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <label className="block text-xs font-bold text-stone-800">
                Main Facade Photo (Paste any Image URL or Upload from Device) *
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Link className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com/property.jpg"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:ring-2 focus:ring-brand-brown focus:outline-none"
                  />
                </div>

                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span>Upload from Device</span>
                </button>
              </div>

              {/* Live Image Preview Card */}
              {imageUrl.trim() && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative">
                    <img
                      src={imageUrl}
                      alt="Property Preview"
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        setImageLoadError(false);
                        setImageLoadSuccess(true);
                      }}
                      onError={() => {
                        setImageLoadError(true);
                        setImageLoadSuccess(false);
                      }}
                    />
                  </div>

                  <div className="flex-1 text-xs">
                    {imageLoadSuccess && !imageLoadError ? (
                      <div className="flex items-center gap-1.5 text-green-700 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Image loaded & ready to publish</span>
                      </div>
                    ) : imageLoadError ? (
                      <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Could not preview this URL (check URL or choose from presets below)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Loading image preview...</span>
                      </div>
                    )}
                    <p className="text-[11px] text-stone-400 truncate max-w-md mt-0.5">
                      {imageUrl.startsWith('data:image') ? 'Uploaded Local Image File' : imageUrl}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick One-Click Presets */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Or pick from Curated Luxury Architectural Presets:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setImageLoadError(false);
                      setImageLoadSuccess(true);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-[16/10] group text-left cursor-pointer transition-all ${
                      imageUrl === preset.url ? 'border-brand-brown ring-2 ring-brand-brown' : 'border-stone-200'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <span className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-white truncate drop-shadow">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional 3 Inset Room URLs (Reference Layout matching Kitchen, Living, Bedroom) */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-stone-700">
                Optional Interior Room Inset Photos:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Kitchen Photo URL
                  </label>
                  <input
                    type="text"
                    value={kitchenUrl}
                    onChange={(e) => setKitchenUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-brand-brown focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Living Room Photo URL
                  </label>
                  <input
                    type="text"
                    value={livingUrl}
                    onChange={(e) => setLivingUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-brand-brown focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Master Bedroom Photo URL
                  </label>
                  <input
                    type="text"
                    value={bedroomUrl}
                    onChange={(e) => setBedroomUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-brand-brown focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Key Features & Amenities */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-brand-brown">
              3. Amenities & Features
            </h3>
            <p className="text-xs text-stone-500">
              Select all available specifications for this property flyer:
            </p>

            <div className="flex flex-wrap gap-2">
              {DEFAULT_FEATURES.map((feat) => {
                const isSelected = selectedFeatures.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-amber-300" />}
                    <span>{feat}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Feature Adder */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                placeholder="Add custom feature (e.g. Helipad, Wine Cellar, Cinema Room)"
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-brand-brown focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomFeature}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-brown hover:bg-brand-brown-dark text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Publishing to Lagos Prime...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Publish Property Listing'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};