import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { 
  Laptop, Cpu, Camera, Settings, Phone, Calendar, 
  MessageSquare, HelpCircle, ChevronLeft, ChevronRight,
  Shield, PenTool, CheckCircle, Smartphone, Star, 
  Tv, Eye, Play, ArrowRight, BookOpen, Layers
} from 'lucide-react';

export const Home: React.FC = () => {
  const { products, navigateTo } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  // Filter products by states
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = products.filter(p => p.newArrival).slice(0, 4);
  const bestSellers = products.filter(p => p.bestSelling).slice(0, 4);

  // Slides configuration
  const slides = [
    {
      title: "Professional CCTV & Security Services",
      subtitle: "Secure what matters most. Home & business cameras with real-time remote mobile surveillance setup.",
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200",
      cta: "Explore Security Solutions",
      color: "from-orange-600/95 to-slate-900/40",
      path: "cctv-installation"
    },
    {
      title: "High Performance Gaming & Workstation PCs",
      subtitle: "Custom built with precision. Ryzen & Core processors matched with high-tier graphics at Bangladesh's unbeatable prices.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
      cta: "Build Your Dream Desktop",
      color: "from-blue-700/95 to-slate-900/40",
      path: "shop",
      params: { category: "desktop" }
    },
    {
      title: "Genuine Laptops & Accessories",
      subtitle: "Experience outstanding productivity. Lenovo Slim, Asus Vivobook, corporate packages with native warranties.",
      image: "https://images.unsplash.com/photo-1496181130204-755241544e35?w=1200",
      cta: "Browse Active Deals",
      color: "from-slate-900/95 to-indigo-900/40",
      path: "shop",
      params: { category: "laptop" }
    }
  ];

  // Auto scroll slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(p => (p + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full bg-slate-50 font-sans pb-16">
      
      {/* 1. Hero Slider Banner Section */}
      <section className="relative w-full h-[320px] md:h-[480px] bg-slate-950 overflow-hidden select-none">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} flex items-center p-6 md:p-16`}>
              <div className="max-w-2xl text-white">
                <span className="inline-block bg-orange-500 text-white text-[10px] sm:text-xs uppercase font-extrabold px-3 py-1 rounded-full mb-3.5 tracking-wider">
                  Featured Offer
                </span>
                <h1 className="text-xl md:text-4.5xl font-extrabold tracking-tight leading-tight mb-3">
                  {slide.title}
                </h1>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed mb-6">
                  {slide.subtitle}
                </p>
                <button
                  onClick={() => navigateTo(slide.path, slide.params)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Manual Slides Dot navigation controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                idx === activeSlide ? 'bg-orange-500 border-orange-500 scale-125' : 'bg-slate-400/50 border-transparent hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col gap-12">
        
        {/* 2. Featured Categories Row */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-slate-900 font-extrabold text-xl tracking-tight leading-none">
                Browse Categories
              </h2>
              <p className="text-slate-400 text-xs mt-1">Select from our range of tech catalog items</p>
            </div>
            <button 
              onClick={() => navigateTo('shop')}
              className="text-xs text-blue-600 hover:text-blue-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View All Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <CategoryCard categoryId="desktop" name="Desktops & PCs" />
            <CategoryCard categoryId="laptop" name="Laptops & Notebooks" />
            <CategoryCard categoryId="monitor" name="Monitors & Screens" />
            <CategoryCard categoryId="cctv" name="CCTV Surveillance" />
            <CategoryCard categoryId="smartphone" name="Smartphones" />
            <CategoryCard categoryId="accessories" name="Tech Accessories" />
          </div>
        </section>

        {/* 3. SPECIAL HIGHLIGHT SECTION (Professional IT Services, CCTV and Computer Repair) */}
        <section className="bg-brand-primary rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute right-0 top-0 translate-x-16 -translate-y-16 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 -translate-x-16 translate-y-16 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

          {/* Core Service Title */}
          <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
            <span className="text-brand-accent font-extrabold text-xs uppercase tracking-widest pl-1.5 border-l-2 border-brand-accent">
              Expert Solutions
            </span>
            <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-white mt-2">
              Professional IT Services Dept
            </h2>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed">
              Oliur Tech offers on-site and shop diagnostics in Dhaka. From system repairs to premium architectural IP camera grids, we build dreams of technology safely.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            
            {/* Service A: Computer Repair Card */}
            <div className="bg-slate-950/60 backdrop-blur rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-brand-secondary/20 p-2.5 rounded-xl border border-brand-secondary/15">
                    <Laptop className="w-6 h-6 text-brand-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">Computer & Laptop Servicing</h3>
                    <p className="text-[11px] text-brand-secondary font-medium">Expert Diagnosis & Hardware Repair</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5 leading-normal">
                  Experiencing system sluggishness, thermal throttling, or hardware breakdowns? Our technicians execute deep component analysis, upgrades, and genuine OS delivery.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-slate-300 font-sans mb-6">
                  <span className="bg-slate-900/80 border border-slate-800/60 px-2.5 py-1.5 rounded flex items-center gap-1">✔ Desktop Repair</span>
                  <span className="bg-slate-900/80 border border-slate-800/60 px-2.5 py-1.5 rounded flex items-center gap-1">✔ Laptop Diagnostics</span>
                  <span className="bg-slate-900/80 border border-slate-800/60 px-2.5 py-1.5 rounded flex items-center gap-1">✔ Windows OS Setup</span>
                  <span className="bg-slate-900/80 border border-slate-800/60 px-2.5 py-1.5 rounded flex items-center gap-1">✔ RAM & SSD Upgrade</span>
                  <span className="bg-slate-900/80 border border-slate-800/60 px-2.5 py-1.5 rounded flex items-center gap-1">✔ Virus & Malware Cleanup</span>
                  <span className="bg-slate-900/80 border border-slate-800/60 px-2.5 py-1.5 rounded flex items-center gap-1">✔ Network Setup</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
                <button 
                  onClick={() => navigateTo('computer-servicing')}
                  className="bg-brand-secondary hover:bg-brand-secondary/95 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all"
                >
                  Book Repair Service
                </button>
                <a 
                  href="tel:01827104825" 
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-300 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg text-center flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Call 01827104825</span>
                </a>
              </div>
            </div>

            {/* Service B: CCTV Setup Card */}
            <div className="bg-slate-950/60 backdrop-blur rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-brand-accent/20 p-2.5 rounded-xl border border-brand-accent/15">
                    <Camera className="w-6 h-6 text-brand-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">CCTV Camera Installation</h3>
                    <p className="text-[11px] text-brand-accent font-medium">Remote Secure Mobile Tracking</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-5 leading-normal">
                  Protect your home, retail warehouse, counter, or office environment. Premium indoor/outdoor CCTV kits, modern DVR configurations, and remote internet mobile monitor syncing.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-slate-300 font-sans mb-6">
                  <span className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded flex items-center gap-1">✔ Home Villa Security</span>
                  <span className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded flex items-center gap-1">✔ Office IP Configurations</span>
                  <span className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded flex items-center gap-1">✔ NVR/DVR Setup</span>
                  <span className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded flex items-center gap-1">✔ Remote Phone Viewer</span>
                  <span className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded flex items-center gap-1">✔ Premium Bullet Cams</span>
                  <span className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded flex items-center gap-1">✔ Consultation & Maintenance</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
                <button 
                  onClick={() => navigateTo('cctv-installation')}
                  className="bg-brand-accent hover:bg-brand-accent/90 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all"
                >
                  Configure CCTV Camera
                </button>
                <a 
                  href="https://wa.me/8801827104825"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg text-center flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>
            </div>

          </div>

          {/* Dynamic Free Consultation CTA Button below */}
          <div className="mt-8 border-t border-slate-800/80 pt-6 text-center">
            <p className="text-xs text-slate-400 mb-3">Unsure what configuration matches your environment?</p>
            <button
              onClick={() => navigateTo('computer-servicing', { scrollToForm: 'true' })}
              className="bg-gradient-to-r from-brand-secondary via-indigo-650 via-indigo-600 to-brand-accent text-white text-xs font-bold px-6 py-3 rounded-full hover:shadow-lg hover:brightness-110 active:scale-95 transition-all text-center cursor-pointer"
            >
              Get Free IT Consultation Session
            </button>
          </div>
        </section>

        {/* 4. Featured Products Block */}
        <section>
          <div className="border-b border-slate-200 pb-3 mb-6">
            <h2 className="text-slate-950 font-extrabold text-xl tracking-tight leading-none">
              Featured Components & Packs
            </h2>
            <p className="text-slate-400 text-xs mt-1">Sought-after items highly requested by customers</p>
          </div>

          {featuredProducts.length === 0 ? (
            <p className="text-xs text-slate-400 p-8 text-center bg-white rounded-xl border border-slate-100">No products loaded yet. Reload backend server.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* 5. Double grid for New Arrivals & Best Sellers */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* New Arrivals Left */}
          <div>
            <div className="border-b border-slate-200 pb-3 mb-5">
              <h2 className="text-slate-950 font-bold text-lg tracking-tight">New Arrivals</h2>
              <p className="text-slate-400 text-xs">Fresh inventory just unboxed this week</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {newArrivingElements(newArrivals)}
            </div>
          </div>

          {/* Best Sellers Right */}
          <div>
            <div className="border-b border-slate-200 pb-3 mb-5">
              <h2 className="text-slate-950 font-bold text-lg tracking-tight">Best Selling</h2>
              <p className="text-slate-400 text-xs">Top trends in Keraniganj & wider Dhaka stores</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {newArrivingElements(bestSellers)}
            </div>
          </div>

        </section>

        {/* 6. Brand Showcase Carousel */}
        <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
          <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest mb-6">Partner Brands We Deal With</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="font-bold text-sm tracking-widest text-slate-600 hover:text-blue-500">ASUS</span>
            <span className="font-bold text-sm tracking-widest text-slate-600 hover:text-red-500">LENOVO</span>
            <span className="font-bold text-sm tracking-widest text-slate-600 hover:text-blue-600">GIGABYTE</span>
            <span className="font-bold text-sm tracking-widest text-slate-600 hover:text-red-600">MSI</span>
            <span className="font-bold text-sm tracking-widest text-slate-600 hover:text-red-400">HIKVISION</span>
            <span className="font-bold text-sm tracking-widest text-slate-600 hover:text-orange-500">DAHUA</span>
            <span className="font-bold text-sm tracking-widest text-slate-600 hover:text-orange-400">XIAOMI</span>
          </div>
        </section>

        {/* 7. Testimonial Reviews Section */}
        <section className="bg-slate-100 rounded-3xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h3 className="text-slate-900 font-extrabold text-xl tracking-tight leading-none">Customer Feedbacks</h3>
            <p className="text-slate-500 text-xs mt-1">Rated 4.8/5.0 stars with 1,200+ clients across Keraniganj</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-xl p-5 border border-slate-200/55 flex flex-col justify-between">
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "We set up a 8-Camera IP CCTV network at our textile warehouse inside Amin Complex. Oliur Tech completed the installation within 2 days. The mobile viewing configuration works flawlessly!"
              </p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">AJ</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-none">Al-Haj Jahangir</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Warehouse Owner, Keraniganj</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/55 flex flex-col justify-between">
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "Brought an Asus Vivobook Core i5 and customized some accessories. Their staff behavior was incredibly professional. Pricing was even lower compared to IDB Bhaban in Dhaka!"
              </p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <div className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">SM</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-none">Sajid Mahmud</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Student, Dhaka University</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/55 flex flex-col justify-between">
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "Oliur Tech's servicing department upgraded my core-i3 sluggish desktop. They removed malware, added a high-speed SSD, and reinstalled genuine Windows. The PC feels like brand new!"
              </p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <div className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">RN</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-none">Rowshan Ara Begum</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Online Boutique Manager</p>
                </div>
              </div>
            </div>

          </div>
        </section>


      </div>
    </div>
  );

  // Helper template for cards list
  function newArrivingElements(itemsList: typeof products) {
    if (itemsList.length === 0) {
      return <p className="text-xs text-slate-400 p-4">Products index is syncing.</p>;
    }
    return itemsList.map(p => (
      <ProductCard key={p.id} product={p} />
    ));
  }
};

