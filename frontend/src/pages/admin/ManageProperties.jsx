import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { buyAPI, rentAPI } from '../../services/api';

const fmt = (price) => {
  const n = parseFloat(price);
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString('en-US')}`;
};

export default function ManageProperties({ type }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Custom confirm dialog state (replaces window.confirm)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);

  const api = type === 'buy' ? buyAPI : rentAPI;
  const label = type === 'buy' ? 'Buy' : 'Rent';

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.getAll({ page, limit: 15, search: search || undefined });
      setProperties(data.data || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, type]);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(1), 400);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const askDelete = (id, title) => {
    setConfirmDialog({ open: true, id, title });
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.remove(confirmDialog.id);
      setProperties(p => p.filter(x => x.id !== confirmDialog.id));
      setConfirmDialog({ open: false, id: null, title: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const statusColor = {
    available: 'bg-green-100 text-green-700',
    sold:      'bg-red-100 text-red-700',
    rented:    'bg-red-100 text-red-700',
    pending:   'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="space-y-6 page-enter">

      {/* ── Custom Delete Confirm Dialog ─────────────────────────── */}
      {confirmDialog.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-red-100 flex items-center justify-center flex-shrink-0 text-xl">🗑️</div>
              <div>
                <h3 className="font-display font-bold text-dark-800 text-lg">Delete Property?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Are you sure you want to delete <strong>"{confirmDialog.title}"</strong>? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 text-sm uppercase tracking-widest transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setConfirmDialog({ open: false, id: null, title: '' })}
                disabled={deleting}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2.5 text-sm uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-800">{label} Properties</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total properties</p>
        </div>
        <Link to={`/admin/${type}-properties/new`} className="btn-gold text-xs py-2.5 px-5">
          ＋ Add Property
        </Link>
      </div>

      {/* ── Search ───────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 shadow-sm p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, location..."
          className="input-field text-sm max-w-md"
        />
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold w-10">#</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Property</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Location</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Type</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Price</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Status</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Featured</th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(8).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-14 text-gray-400">
                    <p className="text-4xl mb-2">🏠</p>
                    <p className="text-sm">No properties found.</p>
                    <Link to={`/admin/${type}-properties/new`} className="text-gold-600 hover:text-gold-700 text-sm mt-2 inline-block font-bold">
                      Add one →
                    </Link>
                  </td>
                </tr>
              ) : properties.map((p, idx) => {
                let images = [];
                try {
                  images = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
                } catch (e) {
                  images = [];
                }
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {images?.[0] ? (
                          <img
                            src={images[0].startsWith('http') ? images[0] : `/uploads/images/${images[0].split(/[/\\]/).pop()}`}
                            alt={p.title}
                            className="w-12 h-10 object-cover flex-shrink-0 bg-gray-100"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                        <div className="w-12 h-10 bg-gray-100 flex items-center justify-center text-gray-400 text-lg flex-shrink-0">
                          🏠
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-dark-800 text-sm truncate max-w-[200px]">{p.title}</p>
                        <p className="text-gray-400 text-xs">
                          {p.bedrooms > 0 ? `${p.bedrooms}BR` : ''}
                          {p.area ? ` · ${p.area} sqft` : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-[140px] truncate">{p.location}</td>
                  <td className="px-4 py-3 text-xs capitalize text-gray-600">{p.propertyType}</td>
                  <td className="px-4 py-3 font-bold text-gold-600 text-sm whitespace-nowrap">
                    {fmt(p.price)}{type === 'rent' ? '/mo' : ''}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 capitalize ${statusColor[p.status] || 'bg-gray-100 text-gray-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.featured && <span className="text-gold-500 text-xs font-bold">★ Yes</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/${type}-properties/edit/${p.id}`}
                        className="text-xs border border-blue-200 text-blue-600 px-3 py-1.5 hover:bg-blue-50 transition-colors font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => askDelete(p.id, p.title)}
                        className="text-xs border border-red-200 text-red-600 px-3 py-1.5 hover:bg-red-50 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <p className="text-gray-500 text-xs">Page {pagination.page} of {pagination.totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchData(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-200 text-xs hover:border-gold-400 disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() => fetchData(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-200 text-xs hover:border-gold-400 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
