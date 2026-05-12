import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const darkHeroPages = ['/'];
  const hasDarkHero = darkHeroPages.includes(location.pathname);

  const navBg = hasDarkHero
    ? (scrolled ? 'bg-dark-800 shadow-2xl' : 'bg-transparent')
    : 'bg-dark-800 shadow-lg';

  const navLinks = [
    { to: '/',        label: 'Home'    },
    { to: '/about',   label: 'About'   },
    { to: '/buy',     label: 'Buy'     },
    { to: '/rent',    label: 'Rent'    },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}
      style={{ borderBottom: '1px solid rgba(242,177,45,0.18)', height: 140 }}
    >
      <div
        className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between"
        style={{ height: '100%' }}
      >
        {/* Logo — 124px tall, full width preserved */}
        <Link to="/" className="flex-shrink-0 flex items-center">
          <img
            src={logo}
            alt="Lucky's Home Improvement Services"
            style={{
              height: 124,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `font-body text-sm uppercase tracking-widest transition-colors duration-200 pb-1 border-b-2 ${
                  isActive
                    ? 'text-gold-500 border-gold-500'
                    : 'text-white border-transparent hover:text-gold-400 hover:border-gold-400'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-gold text-xs px-6 py-3 ml-4">
            Get in Touch
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <div className="w-7 space-y-2">
            <span className={`block h-0.5 bg-gold-500 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
            <span className={`block h-0.5 bg-gold-500 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-gold-500 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div
          className="bg-dark-800 px-6 py-4 space-y-1"
          style={{ borderTop: '1px solid rgba(242,177,45,0.2)' }}
        >
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block font-body text-sm uppercase tracking-widest py-3 border-b ${
                  isActive ? 'text-gold-500' : 'text-white hover:text-gold-400'
                }`
              }
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              {label}
            </NavLink>
          ))}
          <Link to="/contact" className="block mt-4 btn-gold text-center text-xs py-3">
            Get in Touch
          </Link>
        </div>
      </div>
    </nav>
  );
}
