import React, { useState, useEffect } from 'react';
import { contactAPI } from '../../services/api';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter) params.status = filter;
      const { data } = await contactAPI.getAll(params);
      setEnquiries(data.data || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(1); }, [filter]);

  const handleView = async (enq) => {
    setSelected(enq);
    if (enq.status === 'new') {
      try {
        await contactAPI.updateStatus(enq.id, 'read');
        setEnquiries(prev => prev.map(e => e.id === enq.id ? { ...e, status: 'read' } : e));
      } catch {}
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status);
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      if (selected?.id === id) setSelected(s => ({ ...s, status }));
    } catch (err) {
      alert('Update failed');
    }
  };

  const statusBadge = {
    new: 'bg-gold-500 text-dark-800',
    read: 'bg-blue-100 text-blue-700',
    responded: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-800">Enquiries</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total enquiries</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[['', 'All'], ['new', 'New'], ['read', 'Read'], ['responded', 'Responded']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-bold border transition-colors ${
              filter === val ? 'bg-gold-500 border-gold-500 text-dark-800' : 'border-gray-200 text-gray-600 hover:border-gold-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : enquiries.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-4xl mb-3">📬</p>
              <p className="text-gray-500">No enquiries found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {enquiries.map(enq => (
                <div
                  key={enq.id}
                  onClick={() => handleView(enq)}
                  className={`px-5 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${selected?.id === enq.id ? 'bg-gold-500/5 border-l-2 border-gold-500' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-dark-800 text-sm">{enq.name}</p>
                        <span className={`text-xs px-2 py-0.5 font-bold ${statusBadge[enq.status] || 'bg-gray-100 text-gray-600'}`}>
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">{enq.email} {enq.phone && `· ${enq.phone}`}</p>
                      <p className="text-gray-600 text-sm mt-1 truncate">{enq.message}</p>
                    </div>
                    <p className="text-gray-400 text-xs flex-shrink-0">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
              <span>Page {pagination.page} of {pagination.totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => fetchData(pagination.page - 1)} disabled={pagination.page === 1} className="border px-3 py-1 disabled:opacity-40 hover:border-gold-400">← Prev</button>
                <button onClick={() => fetchData(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="border px-3 py-1 disabled:opacity-40 hover:border-gold-400">Next →</button>
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="bg-white border border-gray-100 shadow-sm p-6">
          {!selected ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">👆</p>
              <p className="text-sm">Select an enquiry to view details</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-5">
                <h3 className="font-display font-bold text-dark-800 text-lg">{selected.name}</h3>
                <span className={`text-xs px-2 py-1 font-bold ${statusBadge[selected.status]}`}>{selected.status}</span>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex gap-2">
                  <span className="text-gray-500 w-20 flex-shrink-0">Email</span>
                  <a href={`mailto:${selected.email}`} className="text-gold-600 hover:text-gold-700 break-all">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-20 flex-shrink-0">Phone</span>
                    <a href={`tel:${selected.phone}`} className="text-gold-600 hover:text-gold-700">{selected.phone}</a>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-gray-500 w-20 flex-shrink-0">Date</span>
                  <span className="text-dark-700">{new Date(selected.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-20 flex-shrink-0">Email Sent</span>
                  <span>{selected.emailSent ? '✅ Yes' : '❌ No'}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 mb-5 border border-gray-100">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Message</p>
                <p className="text-dark-700 text-sm leading-relaxed whitespace-pre-line">{selected.message}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Update Status</p>
                {['new', 'read', 'responded'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleUpdateStatus(selected.id, s)}
                    disabled={selected.status === s}
                    className={`w-full text-left px-3 py-2 text-sm border transition-colors capitalize ${
                      selected.status === s
                        ? 'bg-gold-500 border-gold-500 text-dark-800 font-bold cursor-default'
                        : 'border-gray-200 hover:border-gold-400 text-gray-600'
                    }`}
                  >
                    {selected.status === s ? '✓ ' : ''}{s}
                  </button>
                ))}
                <a
                  href={`mailto:${selected.email}?subject=Re: Your Enquiry at Lucky's Home&body=Dear ${selected.name},%0A%0AThank you for your enquiry.`}
                  className="block w-full text-center bg-dark-800 text-gold-500 hover:bg-dark-700 py-2.5 text-xs uppercase tracking-widest font-bold transition-colors mt-3"
                >
                  📧 Reply via Email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
