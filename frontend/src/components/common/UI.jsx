import React from 'react';

export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return <div className={`${sizes[size]} border-2 border-gray-200 border-t-gold-500 rounded-full animate-spin`} />;
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500 text-sm uppercase tracking-widest">Loading...</p>
      </div>
    </div>
  );
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="px-3 py-2 text-sm border border-gray-300 hover:border-gold-500 hover:text-gold-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">‹ Prev</button>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 text-sm font-bold transition-all ${p === currentPage ? 'bg-gold-500 text-dark-800 border border-gold-500' : 'border border-gray-300 hover:border-gold-500 hover:text-gold-600'}`}>{p}</button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm border border-gray-300 hover:border-gold-500 hover:text-gold-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next ›</button>
    </div>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="relative h-56 md:h-72 bg-dark-800 flex items-center justify-center overflow-hidden mt-[140px]">
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-800/90 to-dark-900" />
      <div className="relative z-10 text-center px-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-gold-400 text-sm uppercase tracking-widest">{subtitle}</p>}
        <div className="flex items-center justify-center gap-3 mt-4 text-sm text-gray-400">
          <span className="w-8 h-px bg-gold-500" />
          <span className="text-gold-500 text-xs uppercase tracking-widest">Lucky's Home · New York</span>
          <span className="w-8 h-px bg-gold-500" />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ message = 'No properties found', icon = '🏠' }) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-gray-500 font-display text-xl">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 overflow-hidden">
      <div className="skeleton h-56 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-4 w-full rounded" />
      </div>
    </div>
  );
}
