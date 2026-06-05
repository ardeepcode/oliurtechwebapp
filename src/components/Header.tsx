import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, Mail, MapPin, Facebook, Youtube, Search, 
  User as UserIcon, Heart, ShoppingCart, Menu, X, 
  Cpu, Shield, ShieldCheck, Laptop, Monitor, Camera, 
  Smartphone, HardDrive, Settings, LogOut, ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    cart, 
    wishlist, 
    currentUser, 
    logoutUser, 
    navigateTo, 
    currentPath 
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop', { search: searchQuery });
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (cat: string) => {
    navigateTo('shop', { category: cat });
    setShowCategoriesDropdown(false);
  };

  const categories = [
    { id: 'desktop', name: 'Desktop', icon: Cpu },
    { id: 'laptop', name: 'Laptop', icon: Laptop },
    { id: 'monitor', name: 'Monitor', icon: Monitor },
    { id: 'cctv', name: 'CCTV Camera', icon: Camera },
    { id: 'smartphone', name: 'Smartphone', icon: Smartphone },
    { id: 'accessories', name: 'Accessories', icon: HardDrive },
  ];

  return (
    <header className="w-full font-sans relative z-50">
      {/* 1. Top Header */}
      <div className="w-full bg-slate-950 border-b border-slate-800 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Contacts & Address */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-brand-secondary" />
              <span>01827104825, 01945566033</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-brand-secondary" />
              <a href="mailto:oliurtech@gmail.com" className="hover:text-blue-400 decoration-none">oliurtech@gmail.com</a>
            </span>
            <span className="hidden lg:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-accent-500 text-brand-accent" />
              <span>Amin Complex, Zinjira, Keraniganj, Dhaka</span>
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <a 
                href="https://www.facebook.com/share/1CcUyB6vCf/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-slate-400 hover:text-blue-500 transition-colors"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com/@oliurtechnology?si=P2uw6-KFXZ5yOdIg" 
                target="_blank" 
                rel="noreferrer" 
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/8801827104825" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded hover:bg-emerald-500 font-medium transition-all"
              >
                WhatsApp Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="w-full bg-white text-slate-900 border-b border-slate-100 py-4 px-4 card-shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => navigateTo('home')} 
            className="flex flex-col cursor-pointer select-none"
          >
            <h1 className="text-2xl font-black text-brand-primary tracking-tight leading-none">
              OLIUR <span className="text-brand-secondary">TECH</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-400 mt-1 leading-none">
              Building the Dream of Technology
            </p>
          </div>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg relative"
          >
            <input
              type="text"
              placeholder="Search components, laptops, smart accessories, CCTV camera packs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 text-sm pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-sans"
            />
            <button 
              type="submit" 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-secondary cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Cart & Actions */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <button 
              onClick={() => navigateTo('account', { tab: 'wishlist' })}
              className="relative p-2 text-slate-600 hover:text-brand-accent transition-colors cursor-pointer"
              title="My Wishlist"
            >
              <Heart className="w-5.5 h-5.5 animate-in fade-in" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white font-sans text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button 
              onClick={() => navigateTo('cart')}
              className="relative p-2 text-slate-600 hover:text-brand-secondary transition-colors cursor-pointer"
              id="header_cart_button"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white font-sans text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* User Account / Profile / Admin */}
            {currentUser ? (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <button
                  onClick={() => navigateTo(currentUser.role === 'admin' ? 'admin' : 'account')}
                  className="flex items-center gap-1.5 hover:text-brand-secondary transition-colors cursor-pointer text-sm font-medium text-slate-800"
                >
                  <UserIcon className="w-4.5 h-4.5 text-brand-secondary" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                </button>
                {currentUser.role === 'admin' && (
                  <span className="bg-brand-accent/20 text-brand-accent text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                    Admin
                  </span>
                )}
                <button 
                  onClick={logoutUser}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigateTo('login')}
                className="flex items-center gap-1.5 bg-brand-secondary hover:bg-brand-secondary/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Log In</span>
              </button>
            )}

            {/* Mobile Drawer Trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-2 md:hidden text-slate-600 hover:text-brand-primary cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Navigation Menu */}
      <nav className="hidden md:block w-full bg-white px-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Main Links */}
          <div className="flex items-center gap-1 text-sm font-semibold">
            <button 
              onClick={() => navigateTo('home')} 
              className={`px-4 py-3.5 transition-colors cursor-pointer border-b-2 hover:border-brand-secondary hover:text-brand-secondary ${
                currentPath === 'home' ? 'border-brand-secondary text-brand-secondary' : 'border-transparent text-slate-600'
              }`}
            >
              Home
            </button>

            {/* Category Dropdown */}
            <div className="relative">
              <button 
                onMouseEnter={() => setShowCategoriesDropdown(true)}
                onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                className="px-4 py-3.5 flex items-center gap-1 text-slate-600 hover:text-brand-secondary cursor-pointer"
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              {showCategoriesDropdown && (
                <div 
                  onMouseLeave={() => setShowCategoriesDropdown(false)}
                  className="absolute top-full left-0 bg-white w-56 rounded-b-lg border border-slate-100 shadow-xl overflow-hidden z-50 animate-in fade-in duration-100"
                >
                  {categories.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-secondary flex items-center gap-2.5 transition-colors font-sans cursor-pointer"
                      >
                        <CatIcon className="w-4 h-4 text-brand-accent-500 text-brand-accent" />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button 
              onClick={() => navigateTo('shop')} 
              className={`px-4 py-3.5 transition-colors cursor-pointer border-b-2 hover:border-brand-secondary hover:text-brand-secondary ${
                currentPath === 'shop' ? 'border-brand-secondary text-brand-secondary' : 'border-transparent text-slate-600'
              }`}
            >
              Shop
            </button>

            <button 
              onClick={() => navigateTo('computer-servicing')} 
              className={`px-4 py-3.5 transition-colors cursor-pointer border-b-2 hover:border-brand-secondary hover:text-brand-secondary flex items-center gap-1.5 ${
                currentPath === 'computer-servicing' ? 'border-brand-secondary text-brand-secondary' : 'border-transparent text-slate-600'
              }`}
            >
              <Laptop className="w-4 h-4 text-brand-secondary" />
              <span>Computer Servicing</span>
            </button>

            <button 
              onClick={() => navigateTo('cctv-installation')} 
              className={`px-4 py-3.5 transition-colors cursor-pointer border-b-2 hover:border-brand-secondary hover:text-brand-secondary flex items-center gap-1.5 ${
                currentPath === 'cctv-installation' ? 'border-brand-secondary text-brand-secondary' : 'border-transparent text-slate-600'
              }`}
            >
              <Camera className="w-4 h-4 text-brand-accent" />
              <span>CCTV Installation</span>
            </button>

            <button 
              onClick={() => navigateTo('about')} 
              className={`px-4 py-3.5 transition-colors cursor-pointer border-b-2 hover:border-brand-secondary hover:text-brand-secondary ${
                currentPath === 'about' ? 'border-brand-secondary text-brand-secondary' : 'border-transparent text-slate-600'
              }`}
            >
              About Us
            </button>

            <button 
              onClick={() => navigateTo('contact')} 
              className={`px-4 py-3.5 transition-colors cursor-pointer border-b-2 hover:border-brand-secondary hover:text-brand-secondary ${
                currentPath === 'contact' ? 'border-brand-secondary text-brand-secondary' : 'border-transparent text-slate-600'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Special Booking Badge CTA */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('account', { tab: 'tracking' })}
              className="text-xs text-brand-accent hover:text-brand-accent hover:underline cursor-pointer font-sans font-semibold"
            >
              Track Your Order
            </button>
            <button 
              onClick={() => navigateTo('computer-servicing', { scrollToForm: 'true' })}
              className="bg-brand-secondary text-white text-xs px-3.5 py-1.5 rounded-lg hover:bg-brand-secondary/95 cursor-pointer transition-all font-semibold"
            >
              Book Service Now
            </button>
          </div>

        </div>
      </nav>

      {/* 4. Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-slate-900 border-t border-slate-800 p-4 shrink-0 transition-all font-sans font-medium text-sm flex flex-col gap-3">
          {/* Search bar mobile */}
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs pl-3 pr-8 py-2 rounded-lg border border-slate-800 focus:outline-none"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          <button 
            onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 border-b border-slate-800/50 hover:text-blue-400 ${currentPath==='home'?'text-blue-400':''}`}
          >
            Home
          </button>

          {/* Mobile Categories Accordion Toggle */}
          <div className="w-full">
            <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase mb-1">Categories</p>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { handleCategoryClick(cat.id); setMobileMenuOpen(false); }}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs p-2 rounded flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-orange-500">■</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => { navigateTo('shop'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 border-b border-slate-800/50 hover:text-blue-400 ${currentPath==='shop'?'text-blue-400':''}`}
          >
            Shop
          </button>

          <button 
            onClick={() => { navigateTo('computer-servicing'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 border-b border-slate-800/50 hover:text-blue-400 text-blue-400 font-semibold flex items-center gap-1.5`}
          >
            <Laptop className="w-4 h-4 text-blue-400" />
            <span>Computer Servicing</span>
          </button>

          <button 
            onClick={() => { navigateTo('cctv-installation'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 border-b border-slate-800/50 hover:text-blue-400 text-orange-400 font-semibold flex items-center gap-1.5`}
          >
            <Camera className="w-4 h-4 text-orange-400" />
            <span>CCTV Installation</span>
          </button>

          <button 
            onClick={() => { navigateTo('about-us'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 border-b border-slate-800/50 hover:text-blue-400 ${currentPath==='about-us'?'text-blue-400':''}`}
          >
            About Us
          </button>

          <button 
            onClick={() => { navigateTo('contact-us'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2 border-b border-slate-800/50 hover:text-blue-400 ${currentPath==='contact-us'?'text-blue-400':''}`}
          >
            Contact
          </button>

          <button 
            onClick={() => { navigateTo('account', { tab: 'tracking' }); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 border-b border-slate-800/50 text-orange-400 hover:underline"
          >
            Track Order
          </button>

          {/* Social Icons mobile */}
          <div className="flex gap-4 mt-1 border-t border-slate-800 pt-3 justify-center">
            <a href="https://www.facebook.com/share/1CcUyB6vCf/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://youtube.com/@oliurtechnology?si=P2uw6-KFXZ5yOdIg" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-500">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
