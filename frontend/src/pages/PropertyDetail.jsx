import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { buyAPI, rentAPI, contactAPI } from '../services/api';

// Safe price formatter
function fmt(price) {
  try {
    const n = parseFloat(price);
    if (!isFinite(n)) return 'Price on request';
    if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
    if (n >= 1000)    return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toLocaleString('en-US')}`;
  } catch { return 'Price on request'; }
}

// Safe image source
function imgSrc(path, title) {
  try {
    if (!path) return `https://placehold.co/800x500/111111/F2B12D?text=${encodeURIComponent((title || 'Property').substring(0, 20))}`;
    // Support absolute URLs and handle Windows/Linux slashes
    if (path.startsWith('http')) return path;
    const filename = path.split(/[/\\]/).pop();
    return `/uploads/images/${filename}`;
  } catch {
    return `https://placehold.co/800x500/111111/F2B12D?text=Property`;
  }
}

// Simple inline carousel — no external dependency
function Carousel({ images, title }) {
  const [current, setCurrent] = useState(0);
  const safeImages = Array.isArray(images) && images.length > 0 ? images : [];
  const placeholder = `https://placehold.co/800x500/111111/F2B12D?text=${encodeURIComponent((title || 'Property').substring(0, 20))}`;

  const srcs = safeImages.length > 0
    ? safeImages.map(img => imgSrc(img, title))
    : [placeholder];

  return (
    <div>
      <div className="relative overflow-hidden bg-dark-700" style={{ height: 420 }}>
        <img
          src={srcs[current]}
          alt={`${title || 'Property'} ${current + 1}`}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = placeholder; }}
        />
        {srcs.length > 1 && (
          <>
            <button onClick={() => setCurrent(c => (c - 1 + srcs.length) % srcs.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-dark-800/80 hover:bg-gold-500 text-white hover:text-dark-800 w-10 h-10 flex items-center justify-center transition-all text-xl">‹</button>
            <button onClick={() => setCurrent(c => (c + 1) % srcs.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-dark-800/80 hover:bg-gold-500 text-white hover:text-dark-800 w-10 h-10 flex items-center justify-center transition-all text-xl">›</button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {srcs.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-1.5 transition-all ${i === current ? 'w-6 bg-gold-500' : 'w-1.5 bg-white/60'}`} />
              ))}
            </div>
            <div className="absolute top-3 right-3 bg-dark-800/70 text-white text-xs px-2 py-1">{current + 1}/{srcs.length}</div>
          </>
        )}
      </div>
      {srcs.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {srcs.map((src, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-12 overflow-hidden border-2 transition-all ${i === current ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <img src={src} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = placeholder; }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Enquiry form
function EnquiryForm({ propertyTitle }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: `I'm interested in: ${propertyTitle || 'this property'}` });
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    try {
      await contactAPI.submit(form);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  if (status === 'success') return (
    <div className="bg-green-50 border border-green-200 p-5 text-center">
      <div className="text-3xl mb-2">✅</div>
      <p className="font-bold text-green-800">Enquiry Sent!</p>
      <p className="text-green-600 text-sm mt-1">We'll contact you within 24 hours.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your Name *"
        className="input-field text-sm" />
      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email Address *"
        className="input-field text-sm" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number"
        className="input-field text-sm" />
      <textarea name="message" value={form.message} onChange={handleChange} rows={3}
        className="input-field text-sm resize-none" />
      {status === 'error' && <p className="text-red-500 text-xs">Failed to send. Please try again.</p>}
      <button type="submit" disabled={sending}
        className="btn-gold w-full text-sm py-3 disabled:opacity-60">
        {sending ? 'Sending...' : 'Send Enquiry'}
      </button>
    </form>
  );
}

// Main component
export default function PropertyDetail({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'found' | 'error'

  const safeType = type === 'rent' ? 'rent' : 'buy';

  useEffect(() => {
    if (!id) { setStatus('error'); return; }
    const api = safeType === 'buy' ? buyAPI : rentAPI;
    setStatus('loading');
    api.getOne(id)
      .then(res => {
        const data = res?.data?.data;
        if (!data) { setStatus('error'); return; }
        setProperty(data);
        setStatus('found');
      })
      .catch(err => {
        console.error('PropertyDetail fetch error:', err);
        setStatus('error');
      });
  }, [id, safeType]);

  if (status === 'loading') return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-white pt-[156px]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm uppercase tracking-widest">Loading property...</p>
        </div>
      </div>
    </div>
  );

  if (status === 'error' || !property) return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-[156px]">
        <div className="text-6xl">🏠</div>
        <h2 className="font-display text-3xl font-bold text-dark-800">Property Not Found</h2>
        <p className="text-gray-500">This listing may have been removed or the link is incorrect.</p>
        <Link to={`/${safeType}`} className="btn-gold">← Back to Listings</Link>
      </div>
      <Footer />
    </div>
  );

  // Safe accessors helper
  const safeParse = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return typeof val === 'string' ? JSON.parse(val) : []; }
    catch (e) { return []; }
  };

  const images    = safeParse(property.images);
  const documents = safeParse(property.documents);
  const amenities = safeParse(property.amenities);
  const title     = property.title       || 'Untitled Property';
  const location  = property.address     || property.location || 'New York, NY';
  const status_   = property.status      || 'available';
  const propType  = property.propertyType || '';

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-[156px] pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gold-600 transition-colors">Home</Link>
          <span className="text-gold-500">›</span>
          <Link to={`/${safeType}`} className="hover:text-gold-600 transition-colors capitalize">{safeType}</Link>
          <span className="text-gold-500">›</span>
          <span className="text-dark-800 font-medium truncate max-w-xs">{title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT — main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image carousel */}
            <Carousel images={images} title={title} />

            {/* Details card */}
            <div className="bg-white border border-gray-100 shadow-sm p-6 md:p-8">

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-gold-500 text-dark-800 text-xs font-bold uppercase tracking-widest px-3 py-1">
                  {safeType === 'buy' ? 'For Sale' : 'For Rent'}
                </span>
                {propType && (
                  <span className="border border-gray-200 text-gray-500 text-xs uppercase tracking-widest px-2 py-1 capitalize">
                    {propType}
                  </span>
                )}
                <span className={`text-xs font-bold uppercase px-2 py-1 ${
                  status_ === 'available' ? 'bg-green-100 text-green-700' :
                  status_ === 'sold' || status_ === 'rented' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{status_}</span>
              </div>

              {/* Title + price */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-dark-800 mb-2">{title}</h1>
                  <p className="text-gray-500 text-sm flex items-center gap-1.5">
                    <span>📍</span>{location}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display text-3xl font-bold text-gold-600">
                    {fmt(property.price)}
                    {safeType === 'rent' && <span className="text-base text-gray-500 font-normal">/mo</span>}
                  </p>
                </div>
              </div>

              {/* Stats */}
              {(property.bedrooms > 0 || property.bathrooms > 0 || property.area) && (
                <div className="grid grid-cols-3 gap-4 bg-gray-50 border border-gray-100 p-5 my-6">
                  {property.bedrooms > 0 && (
                    <div className="text-center">
                      <div className="text-2xl mb-1">🛏</div>
                      <div className="font-bold text-dark-800 text-lg">{property.bedrooms}</div>
                      <div className="text-gray-500 text-xs uppercase tracking-widest">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="text-center">
                      <div className="text-2xl mb-1">🚿</div>
                      <div className="font-bold text-dark-800 text-lg">{property.bathrooms}</div>
                      <div className="text-gray-500 text-xs uppercase tracking-widest">Bathrooms</div>
                    </div>
                  )}
                  {property.area && (
                    <div className="text-center">
                      <div className="text-2xl mb-1">📐</div>
                      <div className="font-bold text-dark-800 text-lg">{property.area}</div>
                      <div className="text-gray-500 text-xs uppercase tracking-widest">Sq. Ft</div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-dark-800 mb-3 gold-underline">Description</h2>
                  <p className="text-gray-600 leading-relaxed mt-4 whitespace-pre-line text-sm">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-display text-xl font-bold text-dark-800 mb-3 gold-underline">Amenities</h2>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {amenities.map((a, i) => (
                      <span key={i} className="bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs px-3 py-1.5">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {documents.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-dark-800 mb-3 gold-underline">Documents</h2>
                  <div className="space-y-2 mt-4">
                    {documents.map((doc, i) => {
                      const name = (doc || '').split(/[/\\]/).pop() || `Document ${i + 1}`;
                      const href = doc.startsWith('http') ? doc : doc.startsWith('/') ? doc : `/uploads/docs/${doc.split(/[/\\]/).pop()}`;
                      return (
                        <a key={i} href={href} target="_blank" rel="noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 hover:border-gold-500 transition-colors group">
                          <span className="text-lg">📄</span>
                          <span className="text-sm text-gray-700 group-hover:text-gold-600 transition-colors flex-1">{name}</span>
                          <span className="text-xs text-gray-400 group-hover:text-gold-500">Download ↓</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — sidebar */}
          <div className="space-y-4">
            <div className="sticky top-24">
              {/* Enquiry form */}
              <div className="bg-white border border-gray-200 shadow-sm p-6 mb-4">
                <h3 className="font-display text-xl font-bold text-dark-800 mb-1">Interested?</h3>
                <p className="text-gray-500 text-xs mb-5 leading-relaxed">
                  Send us your details and a NYC specialist will respond within 24 hours.
                </p>
                <EnquiryForm propertyTitle={title} />
              </div>

              {/* Phone */}
              <div className="bg-dark-800 p-5 text-center mb-4">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Call Our NYC Office</p>
                <p className="font-display text-2xl font-bold text-gold-500">+1 (212) 555-0199</p>
                <p className="text-gray-500 text-xs mt-1">Mon–Sat · 9 AM – 7 PM EST</p>
              </div>

              {/* Back link */}
              <Link to={`/${safeType}`}
                className="block text-center border border-gray-300 py-3 text-sm text-gray-600 hover:border-gold-500 hover:text-gold-600 transition-colors uppercase tracking-widest">
                ← Back to {safeType === 'buy' ? 'Listings' : 'Rentals'}
              </Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
