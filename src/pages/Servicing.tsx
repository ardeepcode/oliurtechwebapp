import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Laptop, Cpu, Wrench, Shield, CheckCircle, Zap, 
  Clock, Calendar, User, Phone, Mail, MapPin, AlignLeft,
  ChevronDown, PhoneCall, HelpCircle, MessageSquare
} from 'lucide-react';

export const Servicing: React.FC = () => {
  const { currentPath, queryParams, submitServiceRequest, navigateTo, currentUser } = useApp();

  // Form Fields
  const [specificService, setSpecificService] = useState('Hardware Upgrade');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [problemDescription, setProblemDescription] = useState('');

  const [bookingResult, setBookingResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorBox, setErrorBox] = useState('');

  // Auto populate if user logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email);
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Scroll to form if requested by CTA
  useEffect(() => {
    if (queryParams.scrollToForm === 'true') {
      const el = document.getElementById('computer_service_form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [queryParams]);

  const serviceOffers = [
    { title: "Desktop Repair", desc: "Motherboard diagnostics, SMPS replacement, blue screen crashes or boot errors resolution." },
    { title: "Laptop Repair", desc: "No display fixes, keyboard replace, hinge alignments, thermal pad cleaning & liquid metal repast." },
    { title: "Hardware Upgrade", desc: "Speed up your desktop or notebook with extreme-brand NVMe SSDs and high-tier RAM upgrades." },
    { title: "Windows & OS Setup", desc: "Genuine legal Windows 10/11 operating systems config, driver installation and standard utility apps." },
    { title: "Virus & Ransomware Removal", desc: "In-depth system sweeps, malware extermination, secure registry repair and antivirus setup." },
    { title: "Networking Solutions", desc: "Wired LAN routing, high-density WiFi mesh configurations for modern duplex flats or offices." }
  ];

  const pricingTable = [
    { name: "Complete Hardware Overhaul & Dust Clean", scope: "Disassembly, thermal paste application, structural fan clean", price: "৳500 BDT" },
    { name: "Genuine Windows 10/11 Setup + Driver Configuration", scope: "Clean OS flash, licensing, motherboard chipset drivers setup", price: "৳700 BDT" },
    { name: "Laptop Hinge & Physical Case Repair", scope: "Hinge welding, case structural realignment", price: "৳1,200 BDT" },
    { name: "Slow Laptop Upgrade Workmanship Fee", scope: "Direct mounting of SSD or RAM (components sold separately)", price: "৳300 BDT" },
    { name: "Ransomware Cleanup & Security Hardening", scope: "Malware removal, secure browser setup, free custom antivirus", price: "৳1,000 BDT" },
    { name: "Network Router & Extender Sync", scope: "Subnet planning, local port routing, dual-band wifi tuning", price: "৳800 BDT" }
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBox('');

    if (!name || !phone || !address || !date || !problemDescription) {
      setErrorBox('Please complete all fields marked as mandatory before scheduling.');
      return;
    }

    setSubmitting(true);
    const payload = {
      serviceType: 'computer' as const,
      specificService,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      customerAddress: address,
      preferredDate: date,
      preferredTime: timeSlot,
      description: problemDescription
    };

    const result = await submitServiceRequest(payload);
    setSubmitting(false);

    if (result) {
      setBookingResult(result);
      // Clear specific form details
      setProblemDescription('');
    } else {
      setErrorBox('Failed to record service request. Please check connections.');
    }
  };

  return (
    <div className="w-full bg-slate-50 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-900 text-white rounded-3xl p-6 md:p-12 mb-10 border border-slate-800 shadow relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="bg-blue-600 font-bold text-xs uppercase px-3 py-1 rounded-full mb-3 inline-block">
              Dhaka's Unrivalled Tech Support
            </span>
            <h1 className="text-xl md:text-3.5xl font-extrabold tracking-tight mb-3">
              Professional Computer & Laptop Servicing
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6">
              Don't compromise on speed. Our certified hand-picked technicians perform micro-soldering, hardware diagnostics, and thermal optimizations in Keraniganj with absolute integrity.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-bold">
              <a href="#computer_service_form" className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2.5 rounded-lg text-center cursor-pointer transition-all">
                Schedule Diagnostics Session
              </a>
              <a href="tel:01827104825" className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-lg text-center flex items-center justify-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                <span>Call Hotline Support</span>
              </a>
            </div>
          </div>
        </div>

        {/* Highlight Services Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-slate-950 font-extrabold text-xl md:text-2xl tracking-tight">Our Specialty Work</h2>
            <p className="text-slate-500 text-xs mt-1">Providing safe and certified support since day one</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceOffers.map((offer, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex gap-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0 h-fit">
                  <Wrench className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-xs uppercase mb-1">{offer.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{offer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing List Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-12">
          <div className="mb-6">
            <h2 className="text-slate-900 font-extrabold text-md md:text-lg tracking-tight uppercase border-l-3 border-blue-500 pl-2">
              Transparent Servicing Rate Card
            </h2>
            <p className="text-slate-400 text-xs mt-1">Genuine prices - No hidden charges. Hardware components are charged separately based on actual market values.</p>
          </div>
          <div className="overflow-x-auto text-xs font-sans">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 uppercase text-slate-500 font-bold">
                  <th className="p-3 border-b border-slate-100 w-1/3">Scope of Work</th>
                  <th className="p-3 border-b border-slate-100">Deliverables</th>
                  <th className="p-3 border-b border-slate-100 text-right pr-6">Labour Fee (Fixed)</th>
                </tr>
              </thead>
              <tbody>
                {pricingTable.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-800 border-b border-slate-100">{item.name}</td>
                    <td className="p-3.5 text-slate-500 border-b border-slate-100">{item.scope}</td>
                    <td className="p-3.5 text-right font-bold text-blue-600 border-b border-slate-100 pr-6 font-mono">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Servicing Request Form (Very Important) */}
        <div id="computer_service_form" className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-6">
          
          {/* Booking instructions panels */}
          <div className="lg:col-span-1 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 flex flex-col justify-between h-fit gap-8">
            <div>
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                <span>The Oliur Tech Guarantee</span>
              </h3>
              <ul className="flex flex-col gap-4 text-xs font-sans">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>On-Shop Diagnosis:</strong> Bring your setup down to Amin Complex, Zinjira for live diagnostics.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Component Sourcing:</strong> Direct sourcing of Asus, MSI, Samsung, Corsair and Lenovo replacement parts with brand warranty parameters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>No Fix, No Fee:</strong> If we fail to diagnose or repair your critical system bug, you pay nothing.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px]">
              <p className="font-semibold text-orange-400 mb-1">💡 Quick Tip:</p>
              <p className="text-slate-400 leading-normal">Our team will call you within 1-2 working hours after booking submission to confirm appointments and provide technician timelines.</p>
            </div>
          </div>

          {/* Form Interactive Area */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            {bookingResult ? (
              // Booking Success Layout
              <div className="text-center py-8 font-sans">
                <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-600">Diagnostics Booked Successful!</span>
                <h4 className="text-slate-900 font-extrabold text-xl mt-1">Ticket: {bookingResult.id}</h4>
                <p className="text-slate-500 text-xs max-w-md mx-auto mt-2 leading-relaxed">
                  Congratulations, your computer servicing request has been logged. Our helpdesk team will contact you at <strong>{bookingResult.customerPhone}</strong> to schedule component logistics.
                </p>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl max-w-sm mx-auto my-6 text-left text-xs">
                  <p className="mb-1"><span className="text-slate-400 font-medium">Service Requested:</span> <strong className="text-slate-800">{bookingResult.specificService}</strong></p>
                  <p className="mb-1"><span className="text-slate-400 font-medium">Client Name:</span> <strong className="text-slate-800">{bookingResult.customerName}</strong></p>
                  <p className="mb-1"><span className="text-slate-400 font-medium">Scheduled Date:</span> <strong className="text-slate-800">{bookingResult.preferredDate} ({bookingResult.preferredTime})</strong></p>
                  <p><span className="text-slate-400 font-medium">Status:</span> <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono">Pending Approval</span></p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center text-xs font-bold">
                  <a 
                    href="https://wa.me/8801827104825"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Service Desk</span>
                  </a>
                  <button 
                    onClick={() => { setBookingResult(null); }}
                    className="bg-slate-100 hover:bg-slate-150 text-slate-700 px-4 py-2 rounded-lg"
                  >
                    File Another Booking
                  </button>
                </div>
              </div>
            ) : (
              // Actual Form Fields
              <div>
                <h3 className="text-slate-900 font-bold text-sm mb-1 uppercase tracking-tight">Schedule Your Consultation</h3>
                <p className="text-slate-400 text-xs mb-6">Complete diagnostics request. On-shop diagnostic check is entirely free.</p>

                <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  
                  {errorBox && (
                    <div className="col-span-1 sm:col-span-2 bg-rose-50 text-rose-500 p-3 rounded-lg border border-rose-100 font-bold">
                      {errorBox}
                    </div>
                  )}

                  {/* Specific Service selection */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Select Required Service *</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-150 p-2.5 rounded-lg focus:outline-none focus:bg-white"
                      value={specificService}
                      onChange={(e) => setSpecificService(e.target.value)}
                    >
                      <option value="Laptop Diagnostic & Repair">Laptop Diagnostic & Repair</option>
                      <option value="Desktop Repair">Desktop Repair</option>
                      <option value="Hardware Upgrade">Hardware Upgrade (SSD / RAM Mount)</option>
                      <option value="Windows & OS Setup">Genuine Windows & OS setup</option>
                      <option value="Virus & Malware Extermination">Virus & Malware Extermination</option>
                      <option value="Networking solutions">Wired / Dual Wifi networking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Your Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Tariqul Islam"
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
                        placeholder="e.g. 01827104825"
                        className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:bg-white"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <Phone className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Email Address (Optional)</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. client@gmail.com"
                        className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:bg-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Mail className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Preferred Date *</label>
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
                    <label className="block text-slate-500 font-semibold mb-1">Pickup / Service Home Address *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Amin Complex, Zinjira, Keraniganj, Dhaka"
                        className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:bg-white"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                      <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Explain the problem or request *</label>
                    <textarea
                      rows={4}
                      placeholder="e.g. Screen splits into random gray line colors occasionally. The CPU gets heavily hot and fan makes extreme hardware noise..."
                      className="w-full bg-slate-50 border border-slate-150 p-3 rounded-lg focus:outline-none focus:bg-white font-sans"
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2 mt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      {submitting ? 'Recording Ticket...' : 'Confirm Diagnostics Booking Request'}
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
