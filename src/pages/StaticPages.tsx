import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Facebook, Youtube, ShieldAlert, Cpu, CheckCircle, Info, Landmark } from 'lucide-react';

// Unified Static Pages exporter
// Includes: AboutUs, ContactUs, PrivacyPolicy, TermsConditions, AdminLogin

export const AboutUs: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <div className="w-full bg-slate-50 font-sans py-8">
      <div className="max-w-4xl mx-auto px-4 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm leading-relaxed text-xs text-slate-600">
        <h1 className="text-slate-900 font-black text-xl md:text-2xl mb-2 uppercase tracking-tight">Oliur Tech Stories</h1>
        <span className="text-orange-500 font-bold uppercase tracking-wider text-[10px] block mb-6">"Building the Dream of Technology"</span>

        <p className="mb-4">
          Established in Dhaka, Bangladesh, <strong>Oliur Tech</strong> operates as a leading corporate IT solutions provider, security surveillance integrator, and premium technology retail brand.
        </p>

        <p className="mb-4 font-sans">
          Our core store location is situated at **Amin Complex, Zinjira, Keraniganj, Dhaka**. From day one, active owner and technicians have pursued the dream of technology of our national startups, freelancing developers, gamers, and household families.
        </p>

        <h3 className="text-slate-950 font-bold text-sm uppercase mt-6 mb-3">Our Dedicated Specialty Divisions:</h3>
        <ul className="flex flex-col gap-2.5 font-sans mb-6">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Alpha Desktop Division:</strong> We construct specialized workspaces for gaming, rendering, video editing, and office environments, matched with reliable components.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>CCTV Surveillance Integration:</strong> Advanced property security. Expert wiring, NVR configurations and matching mobile stream sync for retail and warehouse boundaries.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Highgrade Servicing Lab:</strong> Micro-soldering motherboard chips, re-flashing BIOS, thermal paste application, keyboard swaps for problematic desktops and laptops.</span>
          </li>
        </ul>

        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0" />
          <span>We are official deal partners with ASUS, Lenovo, Gigabyte, MSI, Hikvision, Dahua, and Xiaomi in Bangladesh.</span>
        </div>
      </div>
    </div>
  );
};

export const ContactUs: React.FC = () => {
  const { navigateTo } = useApp();
  const [formDone, setFormDone] = useState(false);

  return (
    <div className="w-full bg-slate-50 font-sans py-8">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contacts details column */}
        <div className="lg:col-span-1 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 flex flex-col justify-between gap-6 h-fit text-xs text-slate-350">
          <div>
            <h2 className="text-white font-extrabold text-lg mb-1 uppercase">Oliur Tech Store</h2>
            <p className="text-orange-500 font-bold tracking-wider text-[10px] uppercase mb-6 leading-none">Amin Complex Showroom</p>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-orange-500 shrink-0 mt-0.5" />
                <span>Amin Complex, Zinjira, Keraniganj, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                <span>01827104825, 01945566033</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                <span>oliurtech@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-normal text-[10px] text-slate-400">
            <strong>⏰ Working Hours:</strong><br />
            Saturday - Thursday: 10:00 AM - 08:30 PM (Zinjira Office)<br />
            Friday: On-Site CCTV Emergencies Support Only
          </div>
        </div>

        {/* Form area column */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          {formDone ? (
            <div className="text-center py-8">
              <div className="bg-emerald-100 text-emerald-650 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-slate-900 font-bold text-sm mb-2">Message Dispatched successfully!</p>
              <p className="text-slate-400 text-xs mb-6 font-sans">Our customer support manager has logged your feedback. We will contact you at your email or mobile.</p>
              <button onClick={() => setFormDone(false)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 px-4 rounded-lg text-xs cursor-pointer">
                Write Another Message
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-slate-950 font-bold text-base mb-1 uppercase tracking-tight">Drop Us Feedback</h2>
              <p className="text-slate-400 text-xs mb-6">Request component price quotes or franchise partnership enquiries.</p>

              <form onSubmit={(e) => { e.preventDefault(); setFormDone(true); }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Your Full Name:</label>
                  <input type="text" required placeholder="e.g. Rowshan Ara" className="w-full bg-slate-50 border p-2 text-xs rounded-lg focus:outline-none focus:bg-white" />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Mobile Connection:</label>
                  <input type="tel" required placeholder="e.g. 01827xxxx" className="w-full bg-slate-50 border p-2 text-xs rounded-lg focus:outline-none focus:bg-white" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-slate-500 font-semibold mb-1">Enquiry Email address:</label>
                  <input type="email" placeholder="e.g. user@gmail.com" className="w-full bg-slate-50 border p-2 text-xs rounded-lg focus:outline-none focus:bg-white" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-slate-500 font-semibold mb-1">Describe details:</label>
                  <textarea rows={4} required placeholder="We require 4 discrete custom workstation desktops BDT quotes..." className="w-full bg-slate-50 border p-2.5 text-xs rounded-lg focus:outline-none focus:bg-white font-sans" />
                </div>
                <div className="col-span-1 sm:col-span-2 pt-2">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer">
                    Dispatch Message Ticket
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 font-sans py-8">
      <div className="max-w-4xl mx-auto px-4 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm leading-relaxed text-xs text-slate-600">
        <h1 className="text-slate-900 font-black text-xl uppercase mb-6 border-b border-slate-100 pb-3">Oliur Tech Privacy & Data Safety</h1>
        
        <p className="mb-4">
          At **Oliur Tech** (accessible via our official website), user safety is of extreme priority. This document outlines information collected, recorded, and handled safely.
        </p>

        <h3 className="text-slate-905 font-bold text-xs uppercase block mt-6 mb-2">1. Information We Register:</h3>
        <p className="mb-4 text-slate-500">
          We register customer full names, active contact numbers, delivery addresses, and transactional information purely to verify hardware component delivery in Bangladesh. No personal database details are shared with external agencies.
        </p>

        <h3 className="text-slate-905 font-bold text-xs uppercase block mt-6 mb-2 font-sans">2. bKash / Nagad / Rocket Payments:</h3>
        <p className="mb-4 text-slate-500">
          All financial wallet checkout interfaces run under standard SSLCommerz configurations. Your secure transaction PINs, credentials or OTP codes are processed on direct bank gates – they are never tracked or saved in our server files.
        </p>

        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg flex items-center gap-2 text-[10px] mt-6">
          <Info className="w-4 h-4 shrink-0" />
          <span>If you have questions regarding warranty terms, please drop an email to support or visit Keraniganj complex.</span>
        </div>
      </div>
    </div>
  );
};

export const TermsConditions: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 font-sans py-8">
      <div className="max-w-4xl mx-auto px-4 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm leading-relaxed text-xs text-slate-600 font-sans">
        <h1 className="text-slate-900 font-black text-xl uppercase mb-6 border-b border-slate-100 pb-3">Terms & Service Guidelines</h1>
        
        <p className="mb-4">
          By browsing or register on our showroom web portal, you agree to comply with standard Bangladeshi retail laws and e-commerce rules.
        </p>

        <h3 className="text-slate-905 font-bold text-xs uppercase mb-1">A. Brand Component Warranty:</h3>
        <p className="mb-4 text-slate-500">
          Warranties for Asus, Lenovo, MSI, Gigabyte, Hikvision and Dahua components correspond strictly to manufacturer's terms. Physical damage, lightning/power surging, burn signs, or unauthorised casing seals breaks instantly nullify all warranty clauses.
        </p>

        <h3 className="text-slate-905 font-bold text-xs uppercase mb-1 font-sans">B. Servicing Diagnostics:</h3>
        <p className="mb-4 text-slate-500">
          Computer repairs may require hardware disassembly. Oliur Tech takes zero liability for loss of personal files during OS installs; we strictly suggest buyers execute full personal back-ups before booking technician appointments.
        </p>

        <p className="mb-4 font-sans text-slate-400">
          Final prices in BDT correspond to Dhaka market rates. Rates might fluctuate due to global chip shortages.
        </p>
      </div>
    </div>
  );
};

export const AdminLogin: React.FC = () => {
  const { loginUser, navigateTo, currentUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorBox, setErrorBox] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBox('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        if (data.user.role === 'admin') {
          loginUser(data.user, data.token);
          navigateTo('admin');
        } else {
          setErrorBox('Access Denied. Strictly restricted to Oliur Tech Administrators.');
        }
      } else {
        setErrorBox(data.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setLoading(false);
      setErrorBox('Backend connection failure.');
    }
  };

  return (
    <div className="w-full bg-slate-950 font-sans py-16 px-4 min-h-screen flex items-center justify-center text-white">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 p-2.5 rounded-xl border border-slate-800 shadow">
          <Cpu className="w-6 h-6 text-white" />
        </div>

        <div className="text-center mt-4 mb-6">
          <span className="text-orange-500 font-extrabold text-[10px] uppercase tracking-wider block">Staff Terminal Authorization Gates</span>
          <h2 className="text-lg font-bold text-white mt-1">Admin Dashboard Login</h2>
        </div>

        {errorBox && (
          <div className="bg-rose-500/10 text-rose-450 border border-rose-500/25 rounded-lg p-3 text-xs font-semibold mb-4 text-center">
            {errorBox}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="flex flex-col gap-4 text-xs font-sans">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Admin Email ID:</label>
            <input
              type="email"
              required
              className="w-full bg-slate-950 border border-slate-850 p-2 text-slate-100 rounded-lg focus:outline-none"
              placeholder="admin@oliurtech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Security Code / PIN:</label>
            <input
              type="password"
              required
              className="w-full bg-slate-950 border border-slate-850 p-2 text-slate-100 rounded-lg focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg cursor-pointer transition-colors text-xs"
          >
            {loading ? 'Decrypting Security Session...' : 'Gain System Access'}
          </button>
        </form>

        <div className="bg-slate-950 p-3 rounded-lg mt-5 border border-slate-850/50 text-[10px] leading-relaxed text-slate-500 font-sans">
          💡 <strong>Seeded Admin Credentials:</strong><br />
          Email: <strong>admin@oliurtech.com</strong> / Pass: <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
};
