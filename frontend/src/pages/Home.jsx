import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PropertyCard from '../components/common/PropertyCard';
import { SkeletonCard } from '../components/common/UI';
import { buyAPI, rentAPI } from '../services/api';
import logo from '../assets/logo.png';

export default function Home() {
  const [featuredBuy, setFeaturedBuy]   = useState([]);
  const [featuredRent, setFeaturedRent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'buy', location: '', propertyType: '' });

  useEffect(() => {
    Promise.all([
      buyAPI.getAll({ featured: true, limit: 3 }),
      rentAPI.getAll({ featured: true, limit: 3 }),
    ]).then(([b, r]) => {
      setFeaturedBuy(b.data.data || []);
      setFeaturedRent(r.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = [
    { number: '500+', label: 'NYC Properties' },
    { number: '$2.1B', label: 'In Transactions' },
    { number: '15+', label: 'Years in New York' },
    { number: '98%', label: 'Client Satisfaction' },
  ];

  const services = [
    { icon: '🏙️', title: 'Buy in NYC', desc: 'Find your dream Manhattan condo, Brooklyn brownstone, or Queens co-op from our curated NYC listings.', link: '/buy' },
    { icon: '🗝️', title: 'Rent in NYC', desc: 'Discover comfortable rentals across all five boroughs — from studios in SoHo to family homes in Park Slope.', link: '/rent' },
    { icon: '📋', title: 'Property Management', desc: 'Full-service management for NYC landlords and investors — tenant screening, maintenance, and more.', link: '/contact' },
    { icon: '💼', title: 'Investment Advisory', desc: 'Expert guidance on NYC real estate investment — market analysis, ROI projections, and deal sourcing.', link: '/contact' },
  ];

  const neighborhoods = [
    { name: 'Manhattan',     emoji: '🗽', listings: '240+', desc: 'The heart of NYC — luxury condos, co-ops & penthouses' },
    { name: 'Brooklyn',      emoji: '🌉', listings: '180+', desc: 'Brownstones, lofts & vibrant community living' },
    { name: 'Queens',        emoji: '✈️', listings: '95+',  desc: 'Diverse neighborhoods with great value & transit' },
    { name: 'The Bronx',     emoji: '⚾', listings: '45+',  desc: 'Up-and-coming areas with strong investment potential' },
    { name: 'Staten Island', emoji: '🌿', listings: '30+',  desc: 'Suburban feel with easy access to Manhattan' },
  ];

  const testimonials = [
    { name: 'Sarah & James Mitchell', role: 'Bought in Upper West Side', quote: "Lucky's team made our first NYC apartment purchase completely stress-free. They knew every co-op board requirement inside out.", avatar: 'SJ' },
    { name: 'David Chen', role: 'Renting in Tribeca', quote: "Found my dream loft in two weeks. The team's knowledge of Tribeca pricing is unmatched — I got a great deal in a tough market.", avatar: 'DC' },
    { name: 'Rachel Kim', role: 'Investor — 3 Brooklyn Properties', quote: "As a real estate investor, I need an agent who understands numbers. Lucky's advisory team has helped me acquire three profitable properties.", avatar: 'RK' },
  ];

  const propertyTypes = ['Apartment', 'Condo', 'Townhouse', 'Co-op', 'Penthouse', 'Loft'];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-dark-800 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(242,177,45,0.15),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(242,177,45,0.1),_transparent_60%)]" />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#F2B12D 1px, transparent 1px), linear-gradient(90deg, #F2B12D 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-[168px] pb-36 grid md:grid-cols-2 gap-12 items-center">
          <div className="page-enter">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-gold-500" />
              <span className="text-gold-500 text-xs uppercase tracking-[4px] font-bold">New York's Premier Real Estate</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Find Your<span className="block text-gold-500 italic">Perfect</span>Home
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
              From sun-drenched Manhattan penthouses to Brooklyn brownstones — discover New York's finest properties with Lucky's Home Improvement Services.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/buy" className="btn-gold">Browse Properties</Link>
              <Link to="/contact" className="btn-outline-gold">Talk to an Expert</Link>
            </div>

            {/* Trust badges - clear of search bar */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-dark-500 mt-8">
              <div className="flex items-center gap-2">
                <span className="text-gold-500 text-lg">⭐</span>
                <span className="text-gray-400 text-xs">5-Star Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold-500 text-lg">🏆</span>
                <span className="text-gray-400 text-xs">NYC's #1 Broker 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold-500 text-lg">🔒</span>
                <span className="text-gray-400 text-xs">Licensed & Bonded</span>
              </div>
            </div>
          </div>

          {/* Logo card with floating stat pills */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 border border-gold-500/30 flex items-center justify-center bg-dark-700/50 backdrop-blur-sm relative">
                <img src={logo} alt="Lucky's Home" className="w-full h-full object-contain p-8" />
                <div className="absolute -top-4 -right-4 w-80 h-80 border border-gold-500/10" />
              </div>
              {/* Floating badges */}
              <div className="absolute -left-10 top-12 bg-white shadow-xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">🗽</span>
                <div>
                  <p className="text-dark-800 font-bold text-sm">New York, USA</p>
                  <p className="text-gray-500 text-xs">All 5 Boroughs</p>
                </div>
              </div>
              <div className="absolute -right-10 top-12 bg-gold-500 shadow-xl px-4 py-3 z-10">
                <p className="text-dark-800 font-bold text-xl">500+</p>
                <p className="text-dark-700 text-xs uppercase tracking-widest">Active Listings</p>
              </div>
              <div className="absolute -bottom-4 left-8 bg-dark-800 border border-gold-500/30 px-4 py-2 z-10">
                <p className="text-gold-500 text-xs uppercase tracking-widest">Est. 2010</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar - flows below hero content, no overlap */}
        <div className="relative z-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white shadow-2xl grid md:grid-cols-4 gap-0">
              <div className="p-4 border-r border-gray-100">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold block mb-2">I'm Looking to</label>
                <div className="flex gap-2">
                  {['Buy', 'Rent'].map(t => (
                    <button key={t} onClick={() => setFilters(f => ({ ...f, type: t.toLowerCase() }))}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${filters.type === t.toLowerCase() ? 'bg-gold-500 text-dark-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 border-r border-gray-100">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold block mb-2">Location</label>
                <input value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                  placeholder="Manhattan, Brooklyn..." className="w-full text-sm text-dark-800 outline-none" />
              </div>
              <div className="p-4 border-r border-gray-100">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold block mb-2">Property Type</label>
                <select value={filters.propertyType} onChange={e => setFilters(f => ({ ...f, propertyType: e.target.value }))}
                  className="w-full text-sm text-dark-800 outline-none bg-transparent">
                  <option value="">All Types</option>
                  {propertyTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <Link to={`/${filters.type}${filters.location ? `?search=${filters.location}` : ''}`} className="btn-gold flex items-center justify-center text-center m-0">
                Search Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="bg-gold-500 py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ number, label }) => (
            <div key={label}>
              <p className="font-display text-4xl font-bold text-dark-800 mb-1">{number}</p>
              <p className="text-dark-700 text-sm uppercase tracking-widest font-bold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold-600 text-xs uppercase tracking-[4px] font-bold mb-3">What We Offer</p>
            <h2 className="section-title">Our NYC Services</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon, title, desc, link }) => (
              <Link key={title} to={link} className="group p-8 border border-gray-100 hover:border-gold-500 hover:shadow-xl transition-all duration-300 text-center">
                <div className="text-4xl mb-5">{icon}</div>
                <h3 className="font-display text-lg font-semibold text-dark-800 mb-3 group-hover:text-gold-600 transition-colors">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <div className="mt-5 text-gold-500 text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">Learn More →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED BUY ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-gold-600 text-xs uppercase tracking-[4px] font-bold mb-2">Premium Listings</p>
              <h2 className="section-title gold-underline">NYC Properties For Sale</h2>
            </div>
            <Link to="/buy" className="hidden md:block btn-outline-gold text-xs">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1,2,3].map(i=><SkeletonCard key={i}/>)}</div>
          ) : featuredBuy.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{featuredBuy.map(p=><PropertyCard key={p.id} property={p} type="buy"/>)}</div>
          ) : (
            <div className="text-center py-12 text-gray-400 font-display text-xl">No featured listings yet — add some from the admin panel.</div>
          )}
          <div className="text-center mt-10 md:hidden"><Link to="/buy" className="btn-outline-gold">View All Properties</Link></div>
        </div>
      </section>

      {/* ── NEIGHBORHOODS ── */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold-500 text-xs uppercase tracking-[4px] font-bold mb-3">Explore by Area</p>
            <h2 className="font-display text-4xl font-bold text-white">New York Neighborhoods</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {neighborhoods.map(({ name, emoji, listings, desc }) => (
              <Link key={name} to="/buy" className="group relative overflow-hidden border border-dark-500 hover:border-gold-500 transition-all duration-300 p-6 text-center hover:-translate-y-1">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-gold-500 transition-colors">{name}</h3>
                <p className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-2">{listings} listings</p>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-gold-500 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-dark-700 text-xs uppercase tracking-[4px] font-bold mb-4">Ready to Start?</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-dark-800 mb-6">
            Find Your New York Dream Property Today
          </h2>
          <p className="text-dark-700 text-lg mb-10">Our NYC specialists are ready to help you make the right move.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/buy" className="bg-dark-800 text-gold-500 hover:bg-dark-700 font-bold px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300 inline-block">Browse for Sale</Link>
            <Link to="/rent" className="border-2 border-dark-800 text-dark-800 hover:bg-dark-800 hover:text-gold-500 font-bold px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300 inline-block">Browse Rentals</Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED RENT ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-gold-600 text-xs uppercase tracking-[4px] font-bold mb-2">Available Now</p>
              <h2 className="section-title gold-underline">NYC Properties For Rent</h2>
            </div>
            <Link to="/rent" className="hidden md:block btn-outline-gold text-xs">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1,2,3].map(i=><SkeletonCard key={i}/>)}</div>
          ) : featuredRent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{featuredRent.map(p=><PropertyCard key={p.id} property={p} type="rent"/>)}</div>
          ) : (
            <div className="text-center py-12 text-gray-400 font-display text-xl">No featured rentals yet — add some from the admin panel.</div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold-600 text-xs uppercase tracking-[4px] font-bold mb-3">Client Stories</p>
            <h2 className="section-title">What New Yorkers Say</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ name, role, quote, avatar }) => (
              <div key={name} className="bg-white p-8 border border-gray-100 hover:border-gold-400 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-1 mb-5">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-gold-500 text-sm">★</span>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gold-500 flex items-center justify-center font-bold text-dark-800 text-sm flex-shrink-0">{avatar}</div>
                  <div>
                    <p className="font-display font-semibold text-dark-800 text-sm">{name}</p>
                    <p className="text-gold-600 text-xs uppercase tracking-widest">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gold-500 text-xs uppercase tracking-[4px] font-bold mb-3">Why Lucky's Home?</p>
            <h2 className="font-display text-4xl font-bold text-white mb-8">
              New York's Most Trusted Real Estate Partner
            </h2>
            <div className="space-y-6">
              {[
                ['🏆', 'Award-Winning NYC Expertise', "Recognized by the NYC Real Estate Board for excellence in residential brokerage every year since 2015."],
                ['🗽', 'Deep Local Knowledge', "Born and bred in New York — we know every block, every co-op board, and every hidden gem in all five boroughs."],
                ['🤝', 'White-Glove Service', "Dedicated agents who work exclusively for your best interests, from the first showing to closing day."],
                ['⚡', 'Fast & Transparent', "NYC moves fast. We move faster — with complete transparency at every step of the transaction."],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <h4 className="font-display text-white font-semibold mb-1">{title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gold-500/10 border border-gold-500/30 p-10">
            <h3 className="font-display text-2xl font-bold text-white mb-4">Free NYC Consultation</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Tell us what you're looking for and our New York specialists will reach out within 24 hours — no obligation, no pressure.
            </p>
            <div className="space-y-3 mb-8 text-sm text-gray-400">
              <div className="flex items-center gap-3"><span className="text-gold-500">📍</span><span>350 Fifth Avenue, Suite 4200, New York NY 10118</span></div>
              <div className="flex items-center gap-3"><span className="text-gold-500">📞</span><span>+1 (212) 555-0199</span></div>
              <div className="flex items-center gap-3"><span className="text-gold-500">🕐</span><span>Mon–Sat: 9 AM – 7 PM EST</span></div>
            </div>
            <Link to="/contact" className="btn-gold block text-center">Schedule a Consultation</Link>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold-600 text-xs uppercase tracking-[4px] font-bold mb-3">How It Works</p>
            <h2 className="section-title">Your NYC Property Journey</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gold-500/30" />
            {[
              { step: '01', icon: '🔍', title: 'Define Your Search', desc: 'Tell us your budget, preferred borough, and must-haves. We handle the rest.' },
              { step: '02', icon: '🏠', title: 'Private Viewings', desc: 'We arrange exclusive tours of hand-picked NYC properties that match your criteria.' },
              { step: '03', icon: '📝', title: 'Make an Offer', desc: 'Our experts negotiate on your behalf to secure the best possible price and terms.' },
              { step: '04', icon: '🎉', title: 'Close & Move In', desc: 'We guide you through every step of closing — from inspection to key handover.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="w-16 h-16 bg-dark-800 border-2 border-gold-500 flex items-center justify-center mx-auto mb-4 text-2xl">{icon}</div>
                <span className="text-gold-500 text-xs font-bold uppercase tracking-widest block mb-2">Step {step}</span>
                <h4 className="font-display text-lg font-semibold text-dark-800 mb-2">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NYC MARKET SNAPSHOT ── */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gold-500 text-xs uppercase tracking-[4px] font-bold mb-3">Market Intelligence</p>
            <h2 className="font-display text-3xl font-bold text-white">NYC Real Estate Snapshot</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg. Manhattan Sale', value: '$2.1M', change: '+4.2% YoY', up: true },
              { label: 'Avg. Brooklyn Rent', value: '$3,800/mo', change: '+2.8% YoY', up: true },
              { label: 'Days on Market', value: '28 days', change: '-6 days YoY', up: true },
              { label: 'Active Listings', value: '12,400+', change: 'Across all boroughs', up: null },
            ].map(({ label, value, change, up }) => (
              <div key={label} className="border border-dark-500 p-6 hover:border-gold-500 transition-colors duration-300">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">{label}</p>
                <p className="font-display text-2xl font-bold text-gold-500 mb-2">{value}</p>
                <p className={`text-xs font-bold ${up === true ? 'text-green-400' : up === false ? 'text-red-400' : 'text-gray-500'}`}>
                  {up === true ? '↑' : up === false ? '↓' : '●'} {change}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
