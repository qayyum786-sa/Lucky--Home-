import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI, buyAPI, rentAPI, contactAPI } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalBuy: 0, totalRent: 0, totalEnquiries: 0, totalUsers: 0, newEnquiries: 0 });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersAPI.getStats(),
      contactAPI.getAll({ limit: 5, page: 1 }),
    ]).then(([statsRes, enquiriesRes]) => {
      setStats(statsRes.data.data);
      setRecentEnquiries(enquiriesRes.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Buy Properties', value: stats.totalBuy, icon: '🏡', link: '/admin/buy-properties', color: 'border-blue-400' },
    { label: 'Rent Properties', value: stats.totalRent, icon: '🔑', link: '/admin/rent-properties', color: 'border-purple-400' },
    { label: 'Total Enquiries', value: stats.totalEnquiries, icon: '📬', link: '/admin/enquiries', color: 'border-gold-500' },
    { label: 'Users', value: stats.totalUsers, icon: '👥', link: '/admin/users', color: 'border-green-400' },
  ];

  const quickActions = [
    { label: 'Add Buy Property', link: '/admin/buy-properties/new', icon: '➕' },
    { label: 'Add Rent Property', link: '/admin/rent-properties/new', icon: '➕' },
    { label: 'View Enquiries', link: '/admin/enquiries', icon: '📬' },
    { label: 'Manage Users', link: '/admin/users', icon: '👥' },
  ];

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-dark-800">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Overview of Lucky's Home Improvement Services</p>
      </div>

      {/* New enquiries banner */}
      {stats.newEnquiries > 0 && (
        <div className="bg-gold-500/10 border border-gold-500/50 p-4 flex items-center justify-between">
          <p className="text-gold-700 font-bold text-sm">
            🔔 You have <strong>{stats.newEnquiries}</strong> new unread enquir{stats.newEnquiries === 1 ? 'y' : 'ies'}
          </p>
          <Link to="/admin/enquiries" className="text-xs text-gold-700 border border-gold-600 px-3 py-1.5 hover:bg-gold-500 hover:text-dark-800 transition-colors uppercase tracking-widest font-bold">
            View Now →
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon, link, color }) => (
          <Link key={label} to={link} className={`bg-white border-t-4 ${color} p-6 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{icon}</span>
              <span className="text-3xl font-display font-bold text-dark-800">{loading ? '—' : value}</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display font-bold text-dark-800">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-xs text-gold-600 hover:text-gold-700 uppercase tracking-widest font-bold">View All →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
            ) : recentEnquiries.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No enquiries yet.</div>
            ) : recentEnquiries.map((enq) => (
              <div key={enq.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-dark-800 text-sm">{enq.name}</p>
                      {enq.status === 'new' && <span className="bg-gold-500 text-dark-800 text-xs px-2 py-0.5 font-bold">NEW</span>}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{enq.email} · {enq.phone}</p>
                    <p className="text-gray-600 text-sm mt-1 truncate">{enq.message}</p>
                  </div>
                  <p className="text-gray-400 text-xs flex-shrink-0">
                    {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-display font-bold text-dark-800">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            {quickActions.map(({ label, link, icon }) => (
              <Link key={label} to={link} className="flex items-center gap-3 p-3 border border-gray-100 hover:border-gold-400 hover:bg-gold-500/5 transition-all group">
                <span className="text-xl">{icon}</span>
                <span className="text-sm text-dark-800 group-hover:text-gold-700 font-medium transition-colors">{label}</span>
                <span className="ml-auto text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            ))}
          </div>

          {/* Visit site */}
          <div className="px-4 pb-4">
            <a href="/" target="_blank" rel="noreferrer" className="block w-full text-center bg-dark-800 text-gold-500 hover:bg-dark-700 py-3 text-xs uppercase tracking-widest font-bold transition-colors mt-2">
              🌐 View Live Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
