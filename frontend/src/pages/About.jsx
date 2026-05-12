import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { PageHeader } from '../components/common/UI';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function About() {
  const values = [
    { icon: '🎯', title: 'Our Mission', desc: 'To simplify the NYC real estate journey for every client — buying, selling, or renting — through expert guidance, honest advice, and a seamless experience from start to finish.' },
    { icon: '🌟', title: 'Our Vision', desc: 'To be the most trusted real estate brand in New York City, known for integrity, innovation, and genuine commitment to helping families find their perfect homes in the greatest city on earth.' },
    { icon: '💎', title: 'Our Values', desc: 'Transparency in every transaction. Respect for every client. Excellence in every service. We hold ourselves to the highest ethical standards demanded by the New York market.' },
  ];

  const team = [
    { name: 'James Carter',   role: 'Founder & CEO',     exp: '15+ Years' },
    { name: 'Sarah Mitchell', role: 'Head of Sales',      exp: '10+ Years' },
    { name: 'David Brien',    role: 'Property Advisor',   exp: '8+ Years'  },
    { name: 'Rachel Kim',     role: 'Client Relations',   exp: '6+ Years'  },
  ];

  return (
    <div>
      <Navbar />
      <PageHeader title="About Us" subtitle="New York's Trusted Real Estate Partner Since 2010" />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gold-600 text-xs uppercase tracking-[4px] font-bold mb-3">Who We Are</p>
            <h2 className="section-title mb-6 gold-underline">Lucky's Home Improvement Services</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed mt-8">
              <p>Founded in 2010, Lucky's Home Improvement Services has grown from a boutique Manhattan agency into one of New York City's most respected real estate brands. Our journey has been defined by a simple promise: to put our clients first, always.</p>
              <p>We specialize in premium residential and commercial properties across all five boroughs. Our team of seasoned NYC professionals brings deep local knowledge, transparent processes, and a personal touch that sets us apart in the world's most competitive real estate market.</p>
              <p>Whether you're a first-time buyer navigating a co-op board, a seasoned investor expanding your portfolio, or relocating to the city, we have the expertise to make it happen.</p>
            </div>
            <Link to="/contact" className="btn-gold mt-8 inline-block">Get in Touch</Link>
          </div>
          <div className="relative">
            <div className="border border-gold-500/30 bg-dark-800 p-8 flex items-center justify-center">
              <img src={logo} alt="Lucky's Home" className="w-full max-w-xs object-contain" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold-500/10 -z-10" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold-600 text-xs uppercase tracking-[4px] font-bold mb-3">What Drives Us</p>
            <h2 className="section-title">Mission, Vision & Values</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-8 border border-gray-100 hover:border-gold-400 hover:shadow-lg transition-all duration-300 group">
                <div className="text-4xl mb-5">{icon}</div>
                <h3 className="font-display text-xl font-bold text-dark-800 mb-4 group-hover:text-gold-600 transition-colors">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-800 py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['500+','NYC Properties Sold'], ['$2.1B','In Transactions'], ['15+','Years in New York'], ['98%','Client Satisfaction']].map(([n, l]) => (
            <div key={l} className="border border-dark-500 p-8">
              <p className="font-display text-4xl font-bold text-gold-500 mb-2">{n}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold-600 text-xs uppercase tracking-[4px] font-bold mb-3">The NYC Team</p>
            <h2 className="section-title">Meet Our Specialists</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ name, role, exp }) => (
              <div key={name} className="text-center group">
                <div className="w-24 h-24 mx-auto bg-gold-500/10 border-2 border-gold-500/30 group-hover:border-gold-500 flex items-center justify-center text-3xl mb-4 transition-all duration-300">👤</div>
                <h4 className="font-display font-bold text-dark-800">{name}</h4>
                <p className="text-gold-600 text-xs uppercase tracking-widest mt-1">{role}</p>
                <p className="text-gray-500 text-xs mt-1">{exp} NYC Experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold-500 py-16 text-center">
        <h2 className="font-display text-3xl font-bold text-dark-800 mb-4">Ready to Find Your New York Property?</h2>
        <p className="text-dark-700 mb-8 max-w-xl mx-auto">Let our NYC team of experts guide you through the process. We're just a call away.</p>
        <Link to="/contact" className="bg-dark-800 text-gold-500 hover:bg-dark-700 font-bold px-8 py-3 uppercase tracking-widest text-sm transition-all duration-300 inline-block">Contact Us Today</Link>
      </section>

      <Footer />
    </div>
  );
}
