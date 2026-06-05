import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, Mail, MapPin, Facebook, Youtube, 
  ChevronRight, Cpu, Clock, BellRing, HeartHandshake
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  const handleCategoryNav = (catId: string) => {
    navigateTo('shop', { category: catId });
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-300 font-sans border-t border-slate-900 pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        
        {/* Column 1: Company Meta & Branding */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigateTo('home')}>
            <div className="bg-gradient-to-tr from-blue-600 to-orange-500 p-2 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Oliur Tech
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            "Building the Dream of Technology" - Dhaka's premier modern technology retailer, security camera experts and professional hardware repair shop.
          </p>
          <div className="flex flex-col gap-2.5 text-xs text-slate-400 mt-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>Amin Complex, Zinjira, Keraniganj, Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>01827104825, 01945566033</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <a href="mailto:oliurtech@gmail.com" className="hover:text-blue-400">oliurtech@gmail.com</a>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4 border-l-2 border-orange-500 pl-2">
            Quick Navigation
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span>Home Dashboard</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('shop')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span>Product Catalog</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('computer-servicing')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 text-blue-400 font-semibold cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                <span>Computer Servicing Dept</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('cctv-installation')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 text-orange-400 font-semibold cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-orange-500" />
                <span>CCTV Installation Dept</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('about-us')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span>About Oliur Tech</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('contact-us')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span>Support & Contact</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Main Categories */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4 border-l-2 border-blue-500 pl-2">
            Main Categories
          </h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li>
              <button onClick={() => handleCategoryNav('desktop')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span>Alpha Desktop & PCs</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('laptop')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span>Professional Laptops</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('monitor')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span>FHD Work Monitors</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('cctv')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span>CCTV Camera & Security Kits</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('smartphone')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span>Smartphones</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryNav('accessories')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span>Computer Accessories</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Trust Center & Policies */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4 border-l-2 border-indigo-500 pl-2">
            Corporate Trust
          </h4>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            We provide official warranties and high-grade diagnostics for desktops, security monitoring installations, and laptops.
          </p>
          <div className="flex flex-col gap-2 text-xs">
            <button 
              onClick={() => navigateTo('privacy-policy')}
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy & Safety
            </button>
            <button 
              onClick={() => navigateTo('terms-conditions')}
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Terms & Service Conditions
            </button>
            <button 
              onClick={() => navigateTo('admin-login')} 
              className="text-left text-slate-500 hover:text-orange-400 transition-colors cursor-pointer font-mono text-[11px] mt-2 flex items-center gap-1"
            >
              <span>⚙️ Admin Terminal Gate</span>
            </button>
          </div>
        </div>

      </div>

      {/* Social, Copyright and Payment Logos */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <div>
          <span>© 2026 <strong>Oliur Tech</strong>. All rights reserved.</span>
          <p className="text-[10px] mt-1 text-slate-600">Created with professional care for clients in Keraniganj & across Bangladesh.</p>
        </div>

        {/* Payment Gate Symbol Support */}
        <div className="flex flex-col items-center md:items-end gap-1.5 font-sans">
          <span className="text-[10px] uppercase font-bold text-slate-500">Secure Payments accepted:</span>
          <div className="flex flex-wrap gap-2 text-center select-none text-[9px] font-semibold text-slate-300">
            <span className="bg-pink-600 text-white px-2 py-0.5 rounded shadow">bKash</span>
            <span className="bg-orange-600 text-white px-2 py-0.5 rounded shadow">Nagad</span>
            <span className="bg-purple-700 text-white px-2 py-0.5 rounded shadow">Rocket</span>
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded shadow">SSLCommerz</span>
            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700/50">Cash On Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
