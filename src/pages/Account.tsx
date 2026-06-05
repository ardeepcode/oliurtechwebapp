import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, Lock, Mail, Phone, MapPin, 
  ShoppingBag, Calendar, Heart, Shield, CheckCircle, 
  Search, SlidersHorizontal, Trash2, Key, Edit3, Settings,
  Clock, Truck, Check, AlertCircle, Eye, Camera, Wrench,
  MoveRight
} from 'lucide-react';

export const Account: React.FC = () => {
  const { 
    currentUser, loginUser, logoutUser, updateUserProfile,
    userOrders, fetchUserOrders,
    userServiceRequests, fetchUserServiceRequests,
    wishlist, toggleWishlist, addToCart, navigateTo,queryParams
  } = useApp();

  // Navigation internal tabs inside Account
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'servicing' | 'wishlist' | 'tracking'>('profile');

  // Auth Layout States
  const [isRegister, setIsRegister] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authAddress, setAuthAddress] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Profile Edit fields
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Order Search Tracker
  const [trackInputId, setTrackInputId] = useState('');
  const [trackedOrderResult, setTrackedOrderResult] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Sync tab from nav parameters (e.g. from header links)
  useEffect(() => {
    if (queryParams.tab) {
      setActiveTab(queryParams.tab as any);
    }
  }, [queryParams]);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfilePhone(currentUser.phone || '');
      setProfileAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Auth execution register / login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const url = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { name: authName, email: authEmail, password: authPassword, phone: authPhone, address: authAddress }
      : { email: authEmail, password: authPassword };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setAuthLoading(false);

      if (res.ok) {
        if (isRegister) {
          // Log in instantly on register
          alert("Registration complete! Logging in...");
          setIsRegister(false);
          setAuthEmail(payload.email);
          setAuthPassword(payload.password);
          setTimeout(() => {
            // Trigger login immediately
            const clickEvent = new Event('submit', { cancelable: true });
            document.getElementById('auth_login_form')?.dispatchEvent(clickEvent);
          }, 300);
        } else {
          loginUser(data.user, data.token);
        }
      } else {
        setAuthError(data.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setAuthLoading(false);
      setAuthError('Connection failed to main backend gates.');
    }
  };

  // Profile Save
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');

    const success = await updateUserProfile({
      name: profileName,
      phone: profilePhone,
      address: profileAddress
    });

    if (success) {
      setProfileSuccess('Profile details saved successfully!');
    } else {
      setProfileSuccess('Error occurred saving profile details.');
    }
  };

  // Perform specific Order Trace
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError('');
    setTrackedOrderResult(null);

    if (!trackInputId.trim()) {
      setTrackingError('Please insert an order tracking reference.');
      return;
    }

    setTrackingLoading(true);
    try {
      const res = await fetch(`/api/orders/${trackInputId.trim()}`);
      setTrackingLoading(false);
      if (res.ok) {
        const data = await res.json();
        setTrackedOrderResult(data);
      } else {
        setTrackingError('No orders match this ID. Check spelling (e.g. ORD-10023).');
      }
    } catch (e) {
      setTrackingLoading(false);
      setTrackingError('Unable to trace connection server.');
    }
  };

  // Shortcut order track
  const handleTrackShortcut = (orderId: string) => {
    setTrackInputId(orderId);
    setActiveTab('tracking');
    // fetch timeline
    setTimeout(() => {
      const btn = document.getElementById('search_tracker_btn');
      if (btn) btn.click();
    }, 100);
  };

  // Helper timeline status step values
  const getProgressPoints = (status: string) => {
    const steps = [
      { id: 'pending', name: 'Order Placed', desc: 'Awaiting shop review', date: 'Pending' },
      { id: 'processing', name: 'Processing', desc: 'Assembling components in-house', date: 'Active' },
      { id: 'shipped', name: 'Shipped', desc: 'Handed over to Dhaka delivery rider', date: 'Transit' },
      { id: 'delivered', name: 'Delivered', desc: 'Product received with warranty log', date: 'Completed' }
    ];

    let activeIdxIdx = 0;
    if (status === 'pending') activeIdxIdx = 0;
    else if (status === 'processing') activeIdxIdx = 1;
    else if (status === 'shipped') activeIdxIdx = 2;
    else if (status === 'delivered') activeIdxIdx = 3;
    else if (status === 'cancelled') activeIdxIdx = -1; // cancelled

    return { steps, activeIdxIdx };
  };

  if (!currentUser) {
    // RENDER AUTH LOGIN / SIGNUP PORTAL
    return (
      <div className="w-full bg-slate-50 font-sans py-16 px-4 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg w-full max-w-md overflow-hidden flex flex-col md:flex-row">
          
          <div className="p-6 md:p-8 w-full">
            <div className="text-center mb-6">
              <span className="text-blue-600 font-extrabold text-xs uppercase tracking-wider">Oliur Tech Support Vault</span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                {isRegister ? 'Create Customer Account' : 'Log In To Account'}
              </h2>
              <p className="text-slate-400 text-xs mt-1">Track orders, book PC servicing & CCTV installations instantly.</p>
            </div>

            {authError && (
              <div className="bg-rose-50 text-rose-500 border border-rose-100 rounded-lg p-3 text-xs font-bold font-sans mb-4">
                {authError}
              </div>
            )}

            <form id="auth_login_form" onSubmit={handleAuthSubmit} className="flex flex-col gap-3 text-xs">
              
              {isRegister && (
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariqul Islam"
                    className="w-full bg-slate-50 border border-slate-150 p-2.5 rounded-lg focus:outline-none"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. client@gmail.com"
                    className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2.5 rounded-lg focus:outline-none"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                  />
                  <Mail className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Mobile Connection Number (Optional)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="e.g. 01827104825"
                      className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2.5 rounded-lg focus:outline-none"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                    />
                    <Phone className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  </div>
                </div>
              )}

              {isRegister && (
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Standard Physical Address (Optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Keraniganj, Dhaka"
                      className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2.5 rounded-lg focus:outline-none"
                      value={authAddress}
                      onChange={(e) => setAuthAddress(e.target.value)}
                    />
                    <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Security Account Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-150 pl-3 pr-8 py-2.5 rounded-lg focus:outline-none"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                  <Lock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer mt-2 text-xs"
              >
                {authLoading ? 'Verifying security keys...' : isRegister ? 'Confirm Account Register' : 'Safety Sign In'}
              </button>

            </form>

            <div className="border-t border-slate-100 pt-5 mt-5 text-center">
              <button 
                onClick={() => { setIsRegister(!isRegister); setAuthError(''); }}
                className="text-xs text-blue-600 hover:text-blue-500 font-bold"
              >
                {isRegister ? 'Already registered? Log In' : "Don't have an account? Sign Up Now"}
              </button>
            </div>

            <div className="bg-slate-50 text-slate-450 border border-slate-100 text-[10px] p-3 rounded-lg mt-4 leading-normal font-mono">
              💡 <strong>Quick Login details:</strong> Check our demo accounts:<br />
              - Customer Account: <strong>customer@gmail.com</strong> / pass: <strong>customer123</strong>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // RENDER CUSTOMER REGISTERED DASHBOARD
  return (
    <div className="w-full bg-slate-50 font-sans py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        <h1 className="text-slate-900 font-black text-xl md:text-2xl mb-8 uppercase tracking-tight">
          Client Account Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Area: Dashboard Options bar navigation */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-fit gap-6 text-xs text-slate-600">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                  {currentUser.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-xs">{currentUser.name}</h3>
                  <span className="bg-slate-100 text-[10px] font-mono leading-none rounded px-1 text-slate-400 capitalize">{currentUser.role} Account</span>
                </div>
              </div>

              {/* Sidebar Tabs option */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => { setActiveTab('profile'); setProfileSuccess(''); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-blue-500" />
                  <span>My Personal Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-indigo-500" />
                  <span>Product Sales Orders ({userOrders.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('servicing')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'servicing' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>IT Servicing Tickets ({userServiceRequests.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'wishlist' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Personal Wishlist ({wishlist.length})</span>
                </button>
                <button
                  onClick={() => { setActiveTab('tracking'); setTrackedOrderResult(null); setTrackInputId(''); setTrackingError(''); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'tracking' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Search className="w-4 h-4 text-cyan-600" />
                  <span>Specific Order Tracking</span>
                </button>
              </div>
            </div>

            <button 
              onClick={logoutUser}
              className="w-full bg-slate-950 text-white font-bold py-2 rounded-xl text-center hover:bg-slate-900 cursor-pointer text-[11px]"
            >
              Secure Account Logout
            </button>
          </div>

          {/* Right Area: Dynamic option views based on tabs */}
          <div className="lg:col-span-3">
            
            {/* TABS A: PROFILE MANAGEMENT */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-6">
                  <h3 className="text-slate-950 font-bold text-sm tracking-tight uppercase">My Personal Profile</h3>
                  <p className="text-slate-400 text-xs mt-1">Keep shipping credentials updated to prevent transit delays.</p>
                </div>

                <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  
                  {profileSuccess && (
                    <div className="col-span-1 sm:col-span-2 bg-emerald-50 text-emerald-600 border border-emerald-100 p-3 rounded-lg font-bold">
                      {profileSuccess}
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Corporate Full Name *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-150 p-2 text-xs rounded-lg focus:outline-none"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Login Email Channel (Cannot edit)</label>
                    <input
                      type="email"
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 text-slate-400 p-2 text-xs rounded-lg cursor-not-allowed"
                      value={currentUser.email}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Contact Mobile *</label>
                    <input
                      type="tel"
                      className="w-full bg-slate-50 border border-slate-150 p-2 text-xs rounded-lg focus:outline-none"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Standard Physical Delivery Address *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-150 p-2.5 text-xs rounded-lg focus:outline-none"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Save Profile Attributes
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TABS B: SALES ORDERS LIST */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-6">
                  <h3 className="text-slate-950 font-bold text-sm tracking-tight uppercase">My E-Commerce Orders ({userOrders.length})</h3>
                  <p className="text-slate-400 text-xs mt-1">Review active and previously delivered tech equipment histories.</p>
                </div>

                {userOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-sans">
                    <p className="text-xs">You have no order listings registered on this email account yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 font-sans text-xs">
                    {userOrders.map((ord) => (
                      <div key={ord.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <span className="text-slate-400 tracking-wider text-[10px] uppercase font-bold leading-none">ORDER REFERENCE REFERENCE</span>
                            <h4 className="text-slate-900 font-bold font-mono text-sm leading-none mt-0.5">{ord.id}</h4>
                            <span className="text-[10px] text-slate-400 mt-1 block">Registered: {new Date(ord.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono bg-blue-100 text-blue-600 px-2.5 py-1 rounded text-[10px] uppercase font-bold text-center leading-none">
                              {ord.status}
                            </span>
                            <span className={`font-mono px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                              ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'
                            }`}>
                              {ord.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Order elements miniature list */}
                        <div className="flex flex-col gap-2">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-slate-750 font-medium truncate max-w-[250px]">{item.name} <strong className="text-slate-400">x{item.quantity}</strong></span>
                              <span className="font-bold text-slate-800 font-mono">৳{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-slate-100 pt-3 gap-2 text-xs">
                          <span className="font-sans font-bold">Total billed charge: <strong className="text-blue-600 font-mono">৳{ord.total.toLocaleString()} BDT</strong></span>
                          <button 
                            onClick={() => handleTrackShortcut(ord.id)}
                            className="text-xs text-blue-600 hover:text-blue-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Live Timeline Track</span>
                            <MoveRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABS C: IT BOOKING TICKETS */}
            {activeTab === 'servicing' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-6">
                  <h3 className="text-slate-950 font-bold text-sm tracking-tight uppercase font-sans flex items-center gap-1.5 justify-between">
                    <span>Active Servicing Bookings ({userServiceRequests.length})</span>
                    <button 
                      onClick={() => navigateTo('computer-servicing')}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded"
                    >
                      + Book New Service
                    </button>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Monitor CCTV setup and hardware service request states easily.</p>
                </div>

                {userServiceRequests.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-sans">
                    <p className="text-xs">No active service records on this account.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 text-xs font-sans">
                    {userServiceRequests.map((srv) => (
                      <div key={srv.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-b border-slate-100 pb-2.5">
                          <div>
                            <span className="text-[10px] text-slate-400 leading-none">Diagnostic Ticket:</span>
                            <h4 className="text-slate-900 font-bold font-mono text-sm leading-tight mt-0.5">{srv.id}</h4>
                          </div>
                          
                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono">
                            {srv.status}
                          </span>
                        </div>

                        {/* Ticket description */}
                        <div className="flex flex-col gap-2 leading-relaxed">
                          <p><span className="text-slate-450">Specific Service:</span> <strong className="text-slate-800">{srv.specificService}</strong></p>
                          <p><span className="text-slate-450">Scheduled appointment:</span> <strong className="text-slate-800">{srv.preferredDate} ({srv.preferredTime})</strong></p>
                          <p className="italic text-slate-500">"{srv.description}"</p>
                          {srv.notes && (
                            <p className="bg-blue-50 text-blue-600 border border-blue-100 p-2.5 rounded-lg text-xs leading-normal font-sans">
                              <strong>💡 Tech Staff Note:</strong> {srv.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABS D: WISHLIST VIEW */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-6">
                  <h3 className="text-slate-950 font-bold text-sm tracking-tight uppercase">My Wishlist items ({wishlist.length})</h3>
                  <p className="text-slate-400 text-xs mt-1">Review saved products. Add list elements directly to active cart.</p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-sans">
                    <p className="text-xs">Your wishlist is empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((p) => (
                      <div key={p.id} className="border border-slate-100 bg-slate-50 rounded-2xl p-4 flex gap-3 relative justify-between overflow-hidden">
                        
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-xl bg-white border shrink-0 overflow-hidden">
                            <img src={p.images[0]} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-slate-900 font-bold text-xs truncate max-w-[140px]">{p.name}</h4>
                            <p className="text-xs font-mono font-bold text-blue-600 mt-1">৳{p.price.toLocaleString()} BDT</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 justify-center shrink-0 pr-1">
                          <button 
                            onClick={() => addToCart(p, 1)}
                            className="bg-blue-600 text-white font-bold p-1 px-2.5 rounded text-[10px] uppercase cursor-pointer"
                          >
                            Add Cart
                          </button>
                          <button 
                            onClick={() => toggleWishlist(p)}
                            className="text-slate-400 hover:text-rose-500 text-[10px] cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABS E: ORDER SPECIFIC TRACING TIMELINE */}
            {activeTab === 'tracking' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-6">
                  <h3 className="text-slate-950 font-bold text-sm tracking-tight uppercase">Live Order Timeline Tracker</h3>
                  <p className="text-slate-400 text-xs mt-1">Track shipping progress of products inside Bangladesh.</p>
                </div>

                {/* Tracking input bar search */}
                <form onSubmit={handleTrackSubmit} className="flex gap-2 mb-8 max-w-md">
                  <input
                    type="text"
                    required
                    placeholder="Enter order reference (e.g. ORD-10023)..."
                    className="bg-slate-50 border border-slate-150 p-2.5 text-xs rounded-lg flex-1 focus:outline-none"
                    value={trackInputId}
                    onChange={(e) => setTrackInputId(e.target.value)}
                  />
                  <button
                    type="submit"
                    id="search_tracker_btn"
                    disabled={trackingLoading}
                    className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg active:scale-95 cursor-pointer"
                  >
                    {trackingLoading ? 'Searching...' : 'Trace Order'}
                  </button>
                </form>

                {trackingError && (
                  <div className="bg-rose-50 text-rose-500 border border-rose-100 rounded-lg p-3 text-xs font-bold font-sans mb-4 max-w-md">
                    {trackingError}
                  </div>
                )}

                {/* Interactive Status Timeline result */}
                {trackedOrderResult && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 font-sans">
                    <span className="text-[10px] text-slate-400 font-extrabold tracking-wider leading-none uppercase block">Order tracking found</span>
                    <h4 className="text-slate-900 font-black text-lg font-mono tracking-tight leading-snug mt-0.5">{trackedOrderResult.id}</h4>

                    {trackedOrderResult.status === 'cancelled' ? (
                      <div className="bg-rose-50 border border-rose-100 text-rose-500 rounded p-3 text-xs leading-none mt-4 font-bold">
                        ❌ This order was cancelled. Please request helpdesk for details.
                      </div>
                    ) : (
                      // RENDER STEPS DYNAMIC TIMELINE
                      <div className="mt-8 flex flex-col md:flex-row gap-6 md:gap-4 relative justify-between font-sans">
                        
                        {/* Background structural rule on desktop */}
                        <div className="hidden md:block absolute top-[15px] left-[5%] right-[5%] h-[2px] bg-slate-200 z-0" />

                        {getProgressPoints(trackedOrderResult.status).steps.map((point, pointIdx) => {
                          const isActive = pointIdx <= getProgressPoints(trackedOrderResult.status).activeIdxIdx;
                          const isCurrent = pointIdx === getProgressPoints(trackedOrderResult.status).activeIdxIdx;

                          return (
                            <div key={point.id} className="flex md:flex-col items-center gap-3 md:gap-2 z-10 text-left md:text-center flex-1">
                              
                              {/* Glowing Circle code */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all border ${
                                isCurrent 
                                  ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                                  : isActive
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'bg-white border-slate-200 text-slate-400'
                              }`}>
                                {isActive ? '✔' : pointIdx + 1}
                              </div>

                              <div className="flex-1">
                                <strong className={`block text-xs ${isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'}`}>
                                  {point.name}
                                </strong>
                                <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                                  {point.desc}
                                </span>
                              </div>

                            </div>
                          );
                        })}

                      </div>
                    )}

                    {/* Receipt mini table below */}
                    <div className="border-t border-slate-200/50 mt-8 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                      <div>
                        <p className="mb-0.5"><span className="text-slate-400 font-medium">Customer:</span> <strong className="text-slate-800">{trackedOrderResult.customerName}</strong></p>
                        <p><span className="text-slate-400 font-medium">Transit Address:</span> <strong className="text-slate-800">{trackedOrderResult.shippingAddress}</strong></p>
                      </div>
                      <div>
                        <span className="font-bold">Billed amount: <strong className="text-blue-600 font-mono">৳{trackedOrderResult.total.toLocaleString()} BDT</strong></span>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
