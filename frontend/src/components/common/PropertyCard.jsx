import React from 'react';
import { Link } from 'react-router-dom';

const formatPrice = (price, type) => {
  const n = parseFloat(price);
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000)    return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString('en-US')}`;
};

export default function PropertyCard({ property, type }) {
  // Safe image array handling
  let images = [];
  try {
    images = typeof property.images === 'string' ? JSON.parse(property.images) : (property.images || []);
  } catch (e) {
    images = [];
  }

  const img = images?.[0]
    ? (images[0].startsWith('http') 
        ? images[0] 
        : `/uploads/images/${images[0].split(/[/\\]/).pop()}`)
    : null;
  const placeholder = `https://placehold.co/600x400/111111/F2B12D?text=${encodeURIComponent(property.title?.substring(0, 20) || 'Property')}`;

  return (
    <div className="card-hover group bg-white border border-gray-100 overflow-hidden shadow-sm">
      <div className="relative overflow-hidden h-56">
        <img src={img || placeholder} alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = placeholder; }} />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-gold-500 text-dark-800 text-xs font-bold uppercase tracking-widest px-3 py-1">
            {type === 'buy' ? 'For Sale' : 'For Rent'}
          </span>
          {property.featured && (
            <span className="bg-dark-800 text-gold-500 text-xs font-bold uppercase tracking-widest px-3 py-1">Featured</span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-bold uppercase px-2 py-1 ${
            property.status === 'available' ? 'bg-green-500 text-white' :
            property.status === 'sold' || property.status === 'rented' ? 'bg-red-500 text-white' :
            'bg-yellow-500 text-dark-800'
          }`}>{property.status}</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs text-gold-600 uppercase tracking-widest font-bold mb-1">{property.propertyType}</p>
        <h3 className="font-display text-lg font-semibold text-dark-800 mb-2 line-clamp-1 group-hover:text-gold-600 transition-colors">{property.title}</h3>
        <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
          <span>📍</span> {property.location}
        </p>
        <div className="flex gap-4 py-3 border-t border-b border-gray-100 mb-4 text-sm text-gray-600">
          {property.bedrooms > 0 && <span className="flex items-center gap-1">🛏 <strong className="text-dark-700">{property.bedrooms}</strong></span>}
          {property.bathrooms > 0 && <span className="flex items-center gap-1">🚿 <strong className="text-dark-700">{property.bathrooms}</strong></span>}
          {property.area && <span className="flex items-center gap-1">📐 <strong className="text-dark-700">{property.area}</strong> sq.ft</span>}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-display text-xl font-bold text-gold-600">
            {formatPrice(property.price)}
            {type === 'rent' && <span className="text-sm text-gray-500 font-normal">/mo</span>}
          </p>
          <Link to={`/${type}/${property.id}`}
            className="text-xs uppercase tracking-widest font-bold text-dark-800 border border-dark-800 px-4 py-2 hover:bg-dark-800 hover:text-gold-500 transition-all duration-200">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
