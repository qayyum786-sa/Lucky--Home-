import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { PageHeader } from '../components/common/UI';
import { contactAPI } from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' })); };

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!validate()) return; setLoading(true);
    try { await contactAPI.submit(form); setStatus('success'); setForm({ name: '', email: '', phone: '', message: '' }); }
    catch { setStatus('error'); } finally { setLoading(false); }
  };

  const contactInfo = [
    { icon: '📍', label: 'Address',      value: '350 Fifth Avenue, Suite 4200\nNew York, NY 10118' },
    { icon: '📞', label: 'Phone',        value: '+1 (212) 555-0199', href: 'tel:+12125550199' },
    { icon: '✉️', label: 'Email',        value: 'info@luckys-home.com', href: 'mailto:info@luckys-home.com' },
    { icon: '🕐', label: 'Office Hours', value: 'Mon–Sat: 9:00 AM – 7:00 PM EST' },
  ];

  return (
    <div>
      <Navbar />
      <PageHeader title="Contact Us" subtitle="New York's Real Estate Specialists" />
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-gold-600 text-xs uppercase tracking-[4px] font-bold mb-3">Get in Touch</p>
            <h2 className="section-title mb-6 gold-underline">Talk to Our NYC Team</h2>
            <p className="text-gray-600 leading-relaxed mt-6 mb-10">Have a question about a property? Looking to list your NYC home? Our specialists are available Monday through Saturday, and we respond to every enquiry within 24 hours.</p>
            <div className="space-y-5">
              {contactInfo.map(({ icon, label, value, href }) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">{label}</p>
                    {href ? <a href={href} className="text-dark-800 hover:text-gold-600 transition-colors whitespace-pre-line">{value}</a>
                           : <p className="text-dark-800 whitespace-pre-line">{value}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 bg-gray-50 border border-gray-200 p-6">
              <p className="font-display font-bold text-dark-800 mb-2">NYC Neighborhoods We Cover</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island', 'Harlem', 'Tribeca', 'SoHo', 'Upper East Side', 'Park Slope'].map(n => (
                  <span key={n} className="text-xs bg-dark-800 text-gold-500 px-3 py-1 uppercase tracking-widest">{n}</span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="border border-gray-100 shadow-sm p-8">
              <h3 className="font-display text-2xl font-bold text-dark-800 mb-6">Send Us a Message</h3>
              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 p-5 mb-6 text-center">
                  <p className="text-3xl mb-2">✅</p>
                  <p className="font-bold text-green-800 font-display text-lg">Message Sent!</p>
                  <p className="text-green-600 text-sm mt-1">Our NYC team will respond within 24 hours.</p>
                </div>
              )}
              {status === 'error' && <div className="bg-red-50 border border-red-200 p-4 mb-6"><p className="text-red-700 text-sm">Something went wrong. Please try again or call +1 (212) 555-0199.</p></div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (212) 000-0000" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us what you're looking for in New York..." className={`input-field resize-none ${errors.message ? 'border-red-400' : ''}`} />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full py-4 disabled:opacity-60">{loading ? 'Sending...' : 'Send Message'}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
