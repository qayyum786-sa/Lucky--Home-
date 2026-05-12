import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PropertyCard from '../components/common/PropertyCard';
import { PageHeader, Pagination, EmptyState, SkeletonCard } from '../components/common/UI';
import { buyAPI } from '../services/api';

export default function BuyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', location: '', propertyType: '', minPrice: '', maxPrice: '' });
  const [view, setView] = useState('grid');

  const fetchProperties = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const { data } = await buyAPI.getAll(params);
      setProperties(data.data || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProperties(1); }, [fetchProperties]);

  const handleFilterChange = (e) => setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  const clearFilters = () => setFilters({ search: '', location: '', propertyType: '', minPrice: '', maxPrice: '' });

  const propertyTypes = ['apartment', 'condo', 'townhouse', 'co-op', 'penthouse', 'loft', 'commercial'];

  return (
    <div>
      <Navbar />
      <PageHeader title="Properties For Sale" subtitle={`${pagination.total} NYC Properties Available`} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white border border-gray-100 shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search NYC properties..." className="input-field text-sm col-span-2" />
            <input name="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g. Manhattan, Brooklyn..." className="input-field text-sm" />
            <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="input-field text-sm">
              <option value="">All Types</option>
              {propertyTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <button onClick={clearFilters} className="text-xs border border-gray-300 px-3 py-2 hover:border-gold-500 hover:text-gold-600 transition-colors uppercase tracking-widest">Clear</button>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2 flex-1">
              <input name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min Price ($)" className="input-field text-sm w-40" />
              <input name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price ($)" className="input-field text-sm w-40" />
            </div>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setView('grid')} className={`p-2 border transition-colors ${view === 'grid' ? 'border-gold-500 bg-gold-500 text-dark-800' : 'border-gray-300 hover:border-gold-500'}`}>⊞</button>
              <button onClick={() => setView('list')} className={`p-2 border transition-colors ${view === 'list' ? 'border-gold-500 bg-gold-500 text-dark-800' : 'border-gray-300 hover:border-gold-500'}`}>☰</button>
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-6">Showing <strong className="text-dark-800">{properties.length}</strong> of <strong className="text-dark-800">{pagination.total}</strong> properties</p>
        {loading ? (
          <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>{[1,2,3,4,5,6].map(i=><SkeletonCard key={i}/>)}</div>
        ) : properties.length === 0 ? (
          <EmptyState message="No properties found matching your criteria" />
        ) : (
          <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {properties.map(p => <PropertyCard key={p.id} property={p} type="buy" />)}
          </div>
        )}
        <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => fetchProperties(p)} />
      </div>
      <Footer />
    </div>
  );
}
