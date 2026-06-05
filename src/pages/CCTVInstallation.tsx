import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Camera, Eye, ShieldAlert, Cpu, CheckCircle, 
  PhoneCall, MessageSquare, Calendar, User, Phone, 
  Mail, MapPin, AppWindow, Wifi, Volume2, ShieldCheck
} from 'lucide-react';

export const CCTVInstallation: React.FC = () => {
  const { currentPath, queryParams, submitServiceRequest, navigateTo, currentUser } = useApp();

  // Booking states
  const [specificPackage, setSpecificPackage] = useState('Starter Home Security Kit (2 Cameras)');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [propertyBrief, setPropertyBrief] = useState('');

  const [bookingResult, setBookingResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorBox, setErrorBox] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email);
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Packages list
  const cctvPackages = [
    {
      title: "Starter Home Security Kit (2 Cameras)",
      tagline: "Ideal for Duplex Flats or Small Shops",
      price: "৳8,500 BDT",
      specs: [
        "2x Hikvision 2MP HD dome/bullet security cameras",
        "1x Hikvision 4-Channel audio-enabled DVR",
        "1x 500GB SATA specialized surveillance hard drive",
        "Full high-quality cabling, adapter units & box fittings",
        "Complete installation & configuration layout",
        "Live remote mobile streaming setup by expert setup"
      ],
      color: "border-slate-200 hover:border-slate-350"
    },
    {
      title: "Business Premium IP Kit (4 Cameras Setup)",
      tagline: "Crystal Dome High-Density IP Audio Surveillance",
      price: "৳16,500 BDT",
      specs: [
        "4x Dahua 3MP UHD High-Density IP Audio dome cameras",
        "1x Dahua PoE Network NVR with mobile audio syncing",
        "1x 1TB Seagate specialized surveillance hard drive",
        "High-grade Cat6 cables + connectors & layout boxes",
        "Onsite camera placement angle optimization",
        "1 Year full service & maintenance support"
      ],
      color: "border-blue-600 shadow-lg ring-1 ring-blue-500/20 shadow-blue-500/5",
      badge: "Best Seller"
    },
    {
      title: "Elite Enterprise Security Package (8 Cameras)",
      tagline: "Heavy-Duty Outdoor/Indoor Warehouses Coverage",
      price: "৳29,999 BDT",
      specs: [
        "8x Hikvision 4MP crystal night-vision outdoor bullet cams",
        "1x Hikvision 8-Channel full audio PoE NVR system",
        "1x 2TB Western Digital purple specialized storage HDD",
        "Premium backup power units for cameras running during loading",
        "Multi-user client configurations for admins & supervisors",
        "1 Year onsite warranty & instant hotline technician support"
      ],
      color: "border-slate-200 hover:border-slate-350"
    }
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBox('');

    if (!name || !phone || !address || !date || !propertyBrief) {
      setErrorBox('Please complete all mandatory fields to request security consulting.');
      return;
    }

    setSubmitting(true);
    const payload = {
      serviceType: 'cctv' as const,
      specificService: specificPackage,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      customerAddress: address,
      preferredDate: date,
      preferredTime: timeSlot,
      description: propertyBrief
    };

    const result = await submitServiceRequest(payload);
    setSubmitting(false);

    if (result) {
      setBookingResult(result);
      setPropertyBrief('');
    } else {
      setErrorBox('Error occurred while logging booking request. Try again.');
    }
  };

  const handleSelectPackage = (title: string) => {
    setSpecificPackage(title);
    const el = document.getElementById('cctv_form_section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-50 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-orange-950 text-white rounded-3xl p-6 md:p-12 mb-10 border border-slate-800 shadow relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="bg-orange-500 font-bold text-xs uppercase px-3 py-1 rounded-full mb-3 inline-block">
              Premium Property Surveillance
            </span>
            <h1 className="text-xl md:text-3.5xl font-extrabold tracking-tight mb-3">
              Certified CCTV Camera Installation Store
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6">
              Establish unbreakable secure bounds. We configure professional Hikvision & Dahua setups, multi-channel NVR channels, IP setups, night visions with zero blinds spots. Stream on mobile anywhere.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-bold">
              <a href="#cctv_form_section" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-center cursor-pointer transition-all">
                Schedule Site Inspection
              </a>
              <a 
                href="https://wa.me/8801827104825"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-center flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Solutions Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Dynamic Packages Showcase */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-slate-950 font-extrabold text-xl md:text-2xl tracking-tight">Pre-Configured CCTV Surveillance Bundles</h2>
            <p className="text-slate-500 text-xs mt-1">Get up to 10% discount on standard installation packs. Zero hidden costs.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {cctvPackages.map((pkg, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-3xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${pkg.color}`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-6 bg-blue-600 text-white font-bold text-[10px] uppercase.tracking-wider px-3 py-1 rounded-full shadow">
                    {pkg.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-slate-950 font-extrabold text-sm mb-1 leading-snug">{pkg.title}</h3>
                  <p className="text-slate-400 text-[10px] font-medium uppercase mb-4 leading-none">{pkg.tagline}</p>
                  
                  <div className="text-lg md:text-2xl font-black text-orange-500 mb-5 font-mono">{pkg.price}</div>

                  <ul className="flex flex-col gap-3 font-sans text-xs text-slate-600 mb-6">
                    {pkg.specs.map((spec, sidx) => (
                      <li key={sidx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => handleSelectPackage(pkg.title)}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-colors text-center"
                >
                  Choose Package Setup
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Blocks Checklist */}
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-10 border border-slate-800 shadow mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
          <div className="flex flex-col gap-2">
            <AppWindow className="w-6 h-6 text-orange-500" />
            <h4 className="font-bold text-xs uppercase text-white mt-1">Remote Mobile Stream</h4>
            <p className="text-slate-400 text-xs leading-normal">Monitor your properties real-time from anywhere worldwide via custom mobile apps.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Wifi className="w-6 h-6 text-blue-400" />
            <h4 className="font-bold text-xs uppercase text-white mt-1">IP & NVR Configurations</h4>
            <p className="text-slate-400 text-xs leading-normal">PoE cabling reduces cable mess, carrying digital signals crystal clear even over large distances.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Volume2 className="w-6 h-6 text-emerald-400" />
            <h4 className="font-bold text-xs uppercase text-white mt-1">Audio Recording Integration</h4>
            <p className="text-slate-400 text-xs leading-normal">High sensitivity camera microphones capture voice logs at payment counters of shops.</p>
          </div>
          <div className="flex flex-col gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <h4 className="font-bold text-xs uppercase text-white mt-1">Consultation Support</h4>
            <p className="text-slate-400 text-xs leading-normal">Our experienced planners walk through layouts to bypass physical obstacles or blind spots.</p>
          </div>
        </div>

        {/* CCTV consultation request form (very important request) */}
        <div id="cctv_form_section" className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-6">
          
          <div className="lg:col-span-1 bg-gradient-to-tr from-slate-900 via-slate-950 to-orange-950 rounded-3xl p-6 text-white border border-slate-800 flex flex-col justify-between h-fit gap-8">
            <div>
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-500" />
                <span>Protection Assurance</span>
              </h3>
              <p className="text-xs text-slate-350 leading-relaxed mb-6">
                All cables are fully standard copper pipelines. Standard backup hard drives are surveillance grade, designed to withstand continuous 24/7 read-write.
              </p>
              <div className="flex flex-col gap-3 font-mono text-[10px] text-slate-400">
                <p>📍 Location: Amin Complex, Dhaka</p>
                <p>☎ Support: 01827104825</p>
                <p>⚡ Consultation Duration: ~30 Mins</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850/80 text-[11px]">
              <span className="font-semibold text-blue-400">💡 Service Area Range:</span>
              <p className="text-slate-400 leading-normal mt-1">On-site inspections are dispatched throughout Keraniganj, Mokhgazar, Lalbagh, Motijheel, and wider Dhaka suburbs.</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            {bookingResult ? (
              <div className="text-center py-8 font-sans">
                <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-600">Surveillance Ticket Created!</span>
                <h4 className="text-slate-900 font-extrabold text-xl mt-1">Ticket: {bookingResult.id}</h4>
                <p className="text-slate-500 text-xs max-w-sm mx-auto mt-2 leading-relaxed">
                  Your CCTV site consultation request has been successfully recorded. Our planning officer will get in touch soon at <strong>{bookingResult.customerPhone}</strong>.
                </p>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl max-w-sm mx-auto my-6 text-left text-xs">
                  <p className="mb-1"><span className="text-slate-400 font-medium">Selected Package:</span> <strong className="text-slate-800">{bookingResult.specificService}</strong></p>
                  <p className="mb-1"><span className="text-slate-400 font-medium">Customer:</span> <strong className="text-slate-800">{bookingResult.customerName}</strong></p>
                  <p className="mb-1"><span className="text-slate-400 font-medium">Preferred Date:</span> <strong className="text-slate-800">{bookingResult.preferredDate} ({bookingResult.preferredTime})</strong></p>
                  <p><span className="text-slate-400 font-medium">Booking Status:</span> <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono">Pending Approval</span></p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center text-xs font-bold">
                  <a 
                    href="tel:01827104825"
                    className="bg-slate-950 text-white px-5 py-2 rounded-lg"
                  >
                    Call Support Hotline
                  </a>
                  <button 
                    onClick={() => setBookingResult(null)}
                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg"
                  >
                    File Another Request
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-slate-900 font-bold text-sm mb-1 uppercase tracking-tight">Request Site Consultation</h3>
                <p className="text-slate-400 text-xs mb-6">Complete property details. Consultation session in Dhaka is free of charge.</p>

                <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  
                  {errorBox && (
                    <div className="col-span-1 sm:col-span-2 bg-rose-50 text-rose-500 p-3 rounded-lg border border-rose-100 font-bold">
                      {errorBox}
                    </div>
                  )}

                  {/* Specific Service selection */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Select Desired Package Bundle *</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-150 p-2.5 rounded-lg focus:outline-none focus:bg-white"
                      value={specificPackage}
                      onChange={(e) => setSpecificPackage(e.target.value)}
                    >
                      <option value="Starter Home Security Kit (2 Cameras)">Starter Home Security Kit (2 Cameras) - ৳8,500 BDT</option>
                      <option value="Business Premium IP Kit (4 Cameras Setup)">Business Premium IP Kit (4 Cameras) - ৳16,500 BDT</option>
                      <option value="Elite Enterprise Security Package (8 Cameras)">Elite Enterprise Security Package (8 Cameras) - ৳29,999 BDT</option>
                      <option value="Custom Complex Multi-Camera Consultation">Custom Complex Site Survey (Firms/Factories)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Your Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Al-Haj Jahangir"
                        className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:bg-white"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <User className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Mobile Connection Number *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="e.g. 01945566033"
                        className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:bg-white"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <Phone className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. borer@gmail.com"
                        className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:bg-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Mail className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Preferred Survey Date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:bg-white"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                      <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Pick Time Slot *</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-150 p-2.5 rounded-lg focus:outline-none"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                    >
                      <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                      <option value="01:00 PM - 04:00 PM">Afternoon (01:00 PM - 04:00 PM)</option>
                      <option value="04:00 PM - 07:00 PM">Evening (04:00 PM - 07:00 PM)</option>
                    </select>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Target Property Specific Address *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Zinjira Bazar, Keraniganj, Dhaka"
                        className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:bg-white"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                      <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Describe property layout, camera heights and specifications *</label>
                    <textarea
                      rows={4}
                      placeholder="e.g. Commercial 2-story clothing storefront. We need to install 2 bullet cameras outdoor targeting the street fronts, and 2 dome cameras indoor covering active checkout desks..."
                      className="w-full bg-slate-50 border border-slate-150 p-3 rounded-lg focus:outline-none focus:bg-white font-sans"
                      value={propertyBrief}
                      onChange={(e) => setPropertyBrief(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2 mt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer"
                    >
                      {submitting ? 'Creating Service Ticket...' : 'Confirm Surveillance Installation Booking Request'}
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
