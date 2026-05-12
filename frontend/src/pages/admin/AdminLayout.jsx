import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/buy-properties', label: 'Buy Properties', icon: '🏡' },
  { to: '/admin/rent-properties', label: 'Rent Properties', icon: '🔑' },
  { to: '/admin/enquiries', label: 'Enquiries', icon: '📬' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const Sidebar = () => (
    <div className="h-full bg-dark-800 border-r border-dark-600 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-dark-600 flex items-center gap-3">
        <img src={logo} alt="Lucky's" style={{ height: 52, width: "auto", objectFit: "contain" }} />
        <div>
          <p className="text-white text-xs font-bold uppercase tracking-widest">Lucky's</p>
          <p className="text-gray-500 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gold-500 text-dark-800 font-bold'
                  : 'text-gray-400 hover:bg-dark-700 hover:text-gold-400'
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-dark-600">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-500 text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-bold">{user?.name}</p>
            <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 text-xs text-gray-500 hover:text-red-400 hover:bg-dark-700 transition-colors uppercase tracking-widest"
        >
          🚪 Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="w-full">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-dark-800">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600 p-1">
            ☰
          </button>
          <div className="hidden md:block">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Lucky's Home Improvement Services</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Welcome, <strong className="text-gold-600">{user?.name}</strong></span>
            <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-red-500 transition-colors border border-gray-200 px-3 py-1.5 hover:border-red-300">
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
