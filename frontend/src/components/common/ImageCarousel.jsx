import React, { useState } from 'react';

export default function ImageCarousel({ images = [], title = '' }) {
  const [current, setCurrent] = useState(0);

  const placeholder = `https://placehold.co/800x500/111111/F2B12D?text=${encodeURIComponent(title.substring(0, 20) || 'No Image')}`;

  const srcs = images.length > 0
    ? images.map((img) => {
        if (img.startsWith('http')) return img;
        const filename = img.split(/[/\\]/).pop();
        return `/uploads/images/${filename}`;
      })
    : [placeholder];

  const prev = () => setCurrent((c) => (c - 1 + srcs.length) % srcs.length);
  const next = () => setCurrent((c) => (c + 1) % srcs.length);

  return (
    <div className="relative group">
      <div className="overflow-hidden h-80 md:h-[480px] bg-dark-700">
        <img
          src={srcs[current]}
          alt={`${title} - Image ${current + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => { e.target.src = placeholder; }}
        />
      </div>

      {srcs.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-dark-800/80 hover:bg-gold-500 text-white hover:text-dark-800 w-10 h-10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
            ‹
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-dark-800/80 hover:bg-gold-500 text-white hover:text-dark-800 w-10 h-10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {srcs.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 transition-all duration-200 ${i === current ? 'bg-gold-500 w-6' : 'bg-white/60'}`} />
            ))}
          </div>
          <div className="absolute top-4 right-4 bg-dark-800/70 text-white text-xs px-3 py-1">
            {current + 1} / {srcs.length}
          </div>
        </>
      )}

      {/* Thumbnails */}
      {srcs.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {srcs.map((src, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`flex-shrink-0 w-20 h-16 overflow-hidden border-2 transition-all duration-200 ${i === current ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = placeholder; }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
