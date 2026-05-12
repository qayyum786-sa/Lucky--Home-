import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-dark-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <img src={logo} alt="Lucky's Home" className="h-14 w-auto object-contain mb-4" />
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              New York City's trusted real estate experts helping you find your perfect home across all five boroughs.
            </p>
            <div className="flex gap-4 mt-6">
              {['F', 'I', 'T', 'L'].map((s, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-dark-400 flex items-center justify-center text-gray-500 hover:border-gold-500 hover:text-gold-500 transition-colors duration-200 text-xs uppercase">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-white text-sm uppercase tracking-widest mb-5 gold-underline">Quick Links</h4>
            <ul className="space-y-3 mt-6">
              {[['/', 'Home'], ['/about', 'About Us'], ['/buy', 'Buy Property'], ['/rent', 'Rent Property'], ['/contact', 'Contact Us']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm hover:text-gold-500 transition-colors duration-200"><span className="text-gold-600 mr-2">›</span>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-white text-sm uppercase tracking-widest mb-5 gold-underline">Contact</h4>
            <ul className="space-y-4 mt-6 text-sm">
              <li className="flex gap-3"><span className="text-gold-500 mt-0.5">📍</span><span>350 Fifth Avenue, Suite 4200<br/>New York, NY 10118</span></li>
              <li className="flex gap-3"><span className="text-gold-500">📞</span><a href="tel:+12125550199" className="hover:text-gold-500 transition-colors">+1 (212) 555-0199</a></li>
              <li className="flex gap-3"><span className="text-gold-500">✉️</span><a href="mailto:info@luckys-home.com" className="hover:text-gold-500 transition-colors">info@luckys-home.com</a></li>
              <li className="flex gap-3"><span className="text-gold-500">🕐</span><span>Mon–Sat: 9:00 AM – 7:00 PM EST</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-dark-600">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} Lucky's Home Improvement Services LLC. All rights reserved. New York, NY.</p>
          <div className="flex gap-6 text-xs">
            {['Privacy Policy', 'Terms of Use', 'Fair Housing Notice'].map(t => (
              <a key={t} href="#" className="hover:text-gold-500 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
