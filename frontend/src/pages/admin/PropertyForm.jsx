import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { buyAPI, rentAPI, uploadAPI } from '../../services/api';

const BUY_TYPES  = ['apartment', 'condo', 'townhouse', 'co-op', 'penthouse', 'loft', 'commercial'];
const RENT_TYPES = ['apartment', 'condo', 'studio', 'loft', 'room', 'townhouse', 'commercial'];
const AMENITIES  = ['Parking', 'Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Lift', 'Garden', 'Club House', 'Children Play Area', 'CCTV', 'Wi-Fi', 'Air Conditioning'];

const EMPTY = {
  title: '', description: '', price: '', location: '', address: '',
  propertyType: 'apartment', bedrooms: '', bathrooms: '', area: '',
  featured: false, status: 'available', images: [], documents: [], amenities: [],
};

export default function PropertyForm({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Guarantee type is always valid
  const safeType  = type === 'rent' ? 'rent' : 'buy';
  const isEdit    = Boolean(id);
  const api       = safeType === 'buy' ? buyAPI : rentAPI;
  const label     = safeType === 'buy' ? 'Buy' : 'Rent';
  const propTypes = safeType === 'buy' ? BUY_TYPES : RENT_TYPES;

  const [form, setForm]                   = useState(EMPTY);
  const [fetchLoading, setFetchLoading]   = useState(isEdit);
  const [loading, setLoading]             = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const imgRef = useRef();
  const docRef = useRef();

  useEffect(() => {
    if (!isEdit) return;
    setFetchLoading(true);
    api.getOne(id)
      .then(res => {
        const p = res?.data?.data;
        if (!p) { navigate(`/admin/${safeType}-properties`); return; }
        setForm({
          title:        p.title        || '',
          description:  p.description  || '',
          price:        p.price        || '',
          location:     p.location     || '',
          address:      p.address      || '',
          propertyType: p.propertyType || 'apartment',
          bedrooms:     p.bedrooms     || '',
          bathrooms:    p.bathrooms    || '',
          area:         p.area         || '',
          featured:     Boolean(p.featured),
          status:       p.status       || 'available',
          images:       Array.isArray(p.images)    ? p.images    : [],
          documents:    Array.isArray(p.documents) ? p.documents : [],
          amenities:    Array.isArray(p.amenities) ? p.amenities : [],
        });
      })
      .catch(err => {
        console.error('PropertyForm fetch error:', err);
        navigate(`/admin/${safeType}-properties`);
      })
      .finally(() => setFetchLoading(false));
  }, [id, isEdit, safeType]);

  const handleChange = e => {
    const { name, value, type: t, checked } = e.target;
    setForm(f => ({ ...f, [name]: t === 'checkbox' ? checked : value }));
  };

  const toggleAmenity = amenity => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter(a => a !== amenity)
        : [...f.amenities, amenity],
    }));
  };

  const handleImageUpload = async e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingImages(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const { data } = await uploadAPI.images(fd);
      setForm(f => ({ ...f, images: [...f.images, ...(data.paths || [])] }));
    } catch (err) {
      setError('Image upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImages(false);
      if (imgRef.current) imgRef.current.value = '';
    }
  };

  const handleDocUpload = async e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingDocs(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('documents', f));
      const { data } = await uploadAPI.documents(fd);
      setForm(f => ({ ...f, documents: [...f.documents, ...(data.paths || [])] }));
    } catch (err) {
      setError('Document upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingDocs(false);
      if (docRef.current) docRef.current.value = '';
    }
  };

  const removeImage = idx => setForm(f => ({ ...f, images:    f.images.filter((_,i)    => i !== idx) }));
  const removeDoc   = idx => setForm(f => ({ ...f, documents: f.documents.filter((_,i) => i !== idx) }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.title || !form.description || !form.price || !form.location) {
      setError('Please fill in all required fields (Title, Description, Price, Location).');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        images:    JSON.stringify(form.images    || []),
        documents: JSON.stringify(form.documents || []),
        amenities: JSON.stringify(form.amenities || []),
      };
      if (isEdit) {
        await api.update(id, payload);
        setSuccess('Property updated successfully!');
      } else {
        await api.create(payload);
        setSuccess('Property created successfully!');
        setTimeout(() => navigate(`/admin/${safeType}-properties`), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading property data...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-800">
            {isEdit ? `Edit ${label} Property` : `Add ${label} Property`}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? 'Update the property details below.' : `Fill in the details to create a new ${safeType} listing.`}
          </p>
        </div>
        <Link to={`/admin/${safeType}-properties`}
          className="text-xs border border-gray-300 px-4 py-2 hover:border-gold-500 hover:text-gold-600 transition-colors uppercase tracking-widest">
          ← Back
        </Link>
      </div>

      {error   && <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm rounded">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 text-sm font-bold rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── BASIC INFO ── */}
        <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-display font-bold text-dark-800 border-b border-gray-100 pb-3">Basic Information</h2>

          <div>
            <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              placeholder={`e.g. Luxury 2BR Apartment in Upper East Side`} className="input-field" />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required
              rows={5} placeholder="Detailed description of the property..." className="input-field resize-none" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">
                Price ($) * {safeType === 'rent' && <span className="text-gray-400 normal-case font-normal">/month</span>}
              </label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required min="0"
                placeholder="0" className="input-field" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Property Type *</label>
              <select name="propertyType" value={form.propertyType} onChange={handleChange} className="input-field">
                {propTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="available">Available</option>
                <option value={safeType === 'buy' ? 'sold' : 'rented'}>{safeType === 'buy' ? 'Sold' : 'Rented'}</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Location / Area *</label>
              <input name="location" value={form.location} onChange={handleChange} required
                placeholder="e.g. Manhattan, Upper East Side" className="input-field" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Full Address</label>
              <input name="address" value={form.address} onChange={handleChange}
                placeholder="Full street address" className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Bedrooms</label>
              <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange}
                min="0" placeholder="0" className="input-field" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Bathrooms</label>
              <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange}
                min="0" placeholder="0" className="input-field" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Area (sq.ft)</label>
              <input name="area" type="number" value={form.area} onChange={handleChange}
                min="0" placeholder="0" className="input-field" />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
              className="w-4 h-4 accent-gold-500" />
            <span className="text-sm text-dark-800 font-medium">Mark as Featured Property</span>
            <span className="text-xs text-gray-500">(appears on homepage)</span>
          </label>
        </div>

        {/* ── AMENITIES ── */}
        <div className="bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="font-display font-bold text-dark-800 border-b border-gray-100 pb-3 mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map(a => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={`text-sm px-4 py-2 border transition-all duration-200 ${
                  form.amenities.includes(a)
                    ? 'bg-gold-500 border-gold-500 text-dark-800 font-bold'
                    : 'border-gray-200 text-gray-600 hover:border-gold-400'
                }`}>
                {form.amenities.includes(a) ? '✓ ' : '+ '}{a}
              </button>
            ))}
          </div>
        </div>

        {/* ── IMAGES ── */}
        <div className="bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="font-display font-bold text-dark-800 border-b border-gray-100 pb-3 mb-4">Property Images</h2>
          <div className="border-2 border-dashed border-gray-200 hover:border-gold-400 transition-colors p-6 text-center mb-4 cursor-pointer"
            onClick={() => imgRef.current?.click()}>
            <input ref={imgRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple
              onChange={handleImageUpload} className="hidden" />
            <div className="text-3xl mb-2">📷</div>
            <p className="text-sm text-gray-600 font-medium">Click to upload images</p>
            <p className="text-xs text-gray-400 mt-1">JPG, JPEG, PNG, WEBP — max 5MB each</p>
            {uploadingImages && <p className="text-gold-600 text-sm mt-2 animate-pulse font-bold">Uploading...</p>}
          </div>
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {form.images.map((img, i) => {
                const src = img.startsWith('http') ? img : `/uploads/images/${img.split(/[/\\]/).pop()}`;
                return (
                  <div key={i} className="relative group">
                    <img src={src} alt="" className="w-full h-20 object-cover"
                      onError={e => { e.target.src = 'https://placehold.co/80x80/eee/999?text=img'; }} />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    {i === 0 && <span className="absolute bottom-1 left-1 bg-gold-500 text-dark-800 text-xs px-1 font-bold">Main</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── DOCUMENTS ── */}
        <div className="bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="font-display font-bold text-dark-800 border-b border-gray-100 pb-3 mb-4">Documents / Brochures</h2>
          <div className="border-2 border-dashed border-gray-200 hover:border-gold-400 transition-colors p-6 text-center mb-4 cursor-pointer"
            onClick={() => docRef.current?.click()}>
            <input ref={docRef} type="file" accept=".pdf" multiple onChange={handleDocUpload} className="hidden" />
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm text-gray-600 font-medium">Upload PDF brochures</p>
            <p className="text-xs text-gray-400 mt-1">PDF only — max 10MB each</p>
            {uploadingDocs && <p className="text-gold-600 text-sm mt-2 animate-pulse">Uploading...</p>}
          </div>
          {form.documents.length > 0 && (
            <div className="space-y-2">
              {form.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100">
                  <span className="text-lg">📄</span>
                  <span className="text-sm text-gray-700 flex-1 truncate">{doc.split(/[/\\]/).pop()}</span>
                  <button type="button" onClick={() => removeDoc(i)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SUBMIT ── */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading || uploadingImages || uploadingDocs}
            className="btn-gold flex-1 py-4 text-sm disabled:opacity-60">
            {loading ? 'Saving...' : isEdit ? `Update ${label} Property` : `Create ${label} Property`}
          </button>
          <Link to={`/admin/${safeType}-properties`} className="btn-outline-gold py-4 px-8 text-sm text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
