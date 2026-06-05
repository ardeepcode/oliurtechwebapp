import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, Truck, ShieldCheck, CheckCircle, Info, 
  ArrowRight, Landmark, Radio, Key, Smartphone, AlertCircle
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, placeNewOrder, navigateTo, currentUser } = useApp();

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket' | 'card'>('cod');
  const [orderError, setOrderError] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // MOCK GATEWAY MODAL STATE
  const [showPortal, setShowPortal] = useState(false);
  const [portalStep, setPortalStep] = useState<'number' | 'otp' | 'pin' | 'processing' | 'success'>('number');
  const [walletNo, setWalletNo] = useState('');
  const [walletOtp, setWalletOtp] = useState('');
  const [walletPin, setWalletPin] = useState('');
  const [mockTxnId, setMockTxnId] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = 100; // Dhaka delivery 100 BDT
  const total = subtotal + deliveryCharge;

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="w-full bg-slate-50 font-sans py-16 text-center">
        <h2 className="text-slate-800 font-bold mb-4">Your cart is empty. Please select products first.</h2>
        <button onClick={() => navigateTo('shop')} className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">
          Go To Products Catalog
        </button>
      </div>
    );
  }

  // Handle final checkout confirmation
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    if (!name || !phone || !address) {
      setOrderError('Name, mobile phone, and physical address are strictly required.');
      return;
    }

    // If it's a mobile wallet payment, bypass direct complete and open the mock gateway portal first!
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') {
      setPortalStep('number');
      setWalletNo(phone || '01827104825');
      setShowPortal(true);
      return;
    }

    // Cash on Delivery path
    submitOrderToDb();
  };

  const submitOrderToDb = async (specifiedTxnId?: string) => {
    setIsPlacing(true);
    const orderPayload = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: address,
      paymentMethod,
      paymentTxnId: specifiedTxnId || '',
    };

    const order = await placeNewOrder(orderPayload);
    setIsPlacing(false);

    if (order) {
      setCompletedOrder(order);
    } else {
      setOrderError('Failed to record order. Please verify connectivity.');
    }
  };

  // Simulated Mobile Portal complete
  const handleMockProceed = () => {
    if (portalStep === 'number') {
      if (!walletNo || walletNo.length < 11) {
        alert("Enter a non-empty, 11-digit mobile wallet number.");
        return;
      }
      setPortalStep('otp');
    } else if (portalStep === 'otp') {
      if (!walletOtp) {
        alert("Please enter the received OTP code.");
        return;
      }
      setPortalStep('pin');
    } else if (portalStep === 'pin') {
      if (!walletPin) {
        alert("Enter your wallet PIN to authorize transaction.");
        return;
      }
      setPortalStep('processing');
      
      const newTxnId = (paymentMethod[0].toUpperCase()) + 'TXN' + Math.floor(100000 + Math.random() * 900000);
      setMockTxnId(newTxnId);

      setTimeout(() => {
        setPortalStep('success');
        setTimeout(() => {
          setShowPortal(false);
          submitOrderToDb(newTxnId);
        }, 1500);
      }, 2000);
    }
  };

  const getPortalBrand = () => {
    switch (paymentMethod) {
      case 'bkash': return { name: 'bKash Merchant Pay', color: 'bg-pink-600', text: 'text-pink-600' };
      case 'nagad': return { name: 'Nagad Authorized Pay', color: 'bg-orange-600', text: 'text-orange-600' };
      case 'rocket': return { name: 'Rocket Portal Charge', color: 'bg-purple-700', text: 'text-purple-700' };
      default: return { name: 'Gateway', color: 'bg-blue-600', text: 'text-blue-600' };
    }
  };

  return (
    <div className="w-full bg-slate-50 font-sans py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {completedOrder ? (
          // ORDER COMPLETED SUCCESS VIEW
          <div className="bg-white rounded-3xl p-6 md:p-12 border border-slate-100 shadow-sm max-w-2xl mx-auto text-center font-sans">
            <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-emerald-600 block mb-1">
              Purchase Successful!
            </span>
            <h2 className="text-slate-900 font-extrabold text-xl md:text-2.5xl tracking-tight">
              Order Registered Perfectly
            </h2>
            <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed mt-2.5">
              Congratulations! Your order has been placed. Use the unique order code below to track status timelines from your account dashboard.
            </p>

            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl max-w-md mx-auto my-8 text-left text-xs font-sans">
              <p className="mb-2"><span className="text-slate-400 font-medium">Order Number:</span> <strong className="text-slate-900 font-mono text-xs">{completedOrder.id}</strong></p>
              <p className="mb-2"><span className="text-slate-400 font-medium">Customer:</span> <strong className="text-slate-800">{completedOrder.customerName} ({completedOrder.customerPhone})</strong></p>
              <p className="mb-2"><span className="text-slate-400 font-medium">Shipping Address:</span> <strong className="text-slate-800">{completedOrder.shippingAddress}</strong></p>
              <p className="mb-2"><span className="text-slate-400 font-medium">Payment Option:</span> <strong className="text-slate-800 uppercase font-mono">{completedOrder.paymentMethod}</strong></p>
              {completedOrder.paymentTxnId && (
                <p className="mb-2"><span className="text-pink-600 font-semibold uppercase font-mono">bKash/Nagad TxnID:</span> <strong className="text-slate-900 font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{completedOrder.paymentTxnId}</strong></p>
              )}
              <p><span className="text-slate-400 font-medium">Aggregate Total:</span> <strong className="text-blue-600 font-mono">৳{completedOrder.total.toLocaleString()} BDT</strong></p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => navigateTo('account', { tab: 'orders' })} 
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer"
              >
                Track from My Dashboard
              </button>
              <button 
                onClick={() => navigateTo('shop')} 
                className="bg-slate-100 hover:bg-slate-150 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl cursor-pointer"
              >
                Back To Products
              </button>
            </div>
          </div>
        ) : (
          // ACTIVE CHECKOUT FORM VIEW
          <div>
            <div className="text-xs text-slate-400 mb-6 flex items-center gap-1.5 flex-wrap">
              <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigateTo('home')}>Oliur Tech</span>
              <span>/</span>
              <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigateTo('cart')}>Shopping Cart</span>
              <span>/</span>
              <span className="text-slate-600 font-bold">Delivery Invoice</span>
            </div>

            <h1 className="text-slate-900 font-extrabold text-lg md:text-xl uppercase border-l-3 border-blue-500 pl-2 mb-8 tracking-tight">
              Shipping & Payment Delivery details
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Areas left */}
              <div className="lg:col-span-2">
                <form onSubmit={handleCheckoutSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col gap-6">
                  
                  {orderError && (
                    <div className="bg-rose-50 text-rose-500 p-3 rounded-lg border border-rose-100 text-xs font-bold font-sans">
                      {orderError}
                    </div>
                  )}

                  {/* Operational User Info */}
                  <div>
                    <h3 className="text-slate-950 font-bold text-xs uppercase tracking-wide mb-4 border-b border-slate-50 pb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-orange-500" />
                      <span>Billing Shipping Address Details</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Customer Full Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Rowshan Ara Begum"
                          className="w-full bg-slate-50 border border-slate-150 p-2 text-xs rounded-lg focus:outline-none focus:bg-white"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-semibold mb-1">Mobile Contact Phone *</label>
                        <input
                          type="tel"
                          placeholder="e.g. 01827xxxx"
                          className="w-full bg-slate-50 border border-slate-150 p-2 text-xs rounded-lg focus:outline-none focus:bg-white"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <label className="block text-slate-500 font-semibold mb-1">Email Connection</label>
                        <input
                          type="email"
                          placeholder="e.g. user@gmail.com"
                          className="w-full bg-slate-50 border border-slate-150 p-2 text-xs rounded-lg focus:outline-none focus:bg-white"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <label className="block text-slate-500 font-semibold mb-1">Physical Delivery Address * (Bangladeshi Address)</label>
                        <input
                          type="text"
                          placeholder="e.g. House #3, Road #2, Zinjira, Keraniganj, Dhaka, Bangladesh"
                          className="w-full bg-slate-50 border border-slate-150 p-3 text-xs rounded-lg focus:outline-none focus:bg-white"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operational Payment selector */}
                  <div>
                    <h3 className="text-slate-950 font-bold text-xs uppercase tracking-wide mb-4 border-b border-slate-50 pb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      <span>Select Preferred Payment Path</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                      
                      {/* COD */}
                      <label 
                        className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer transition-colors ${
                          paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'cod'} 
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-0.5 accent-blue-600"
                        />
                        <div>
                          <strong className="text-slate-900 block leading-none mb-1">Cash On Delivery (COD)</strong>
                          <span className="text-[10px] text-slate-450 leading-tight block">Hand over total price to active bicycle rider delivers items relative to Dhaka.</span>
                        </div>
                      </label>

                      {/* bKash */}
                      <label 
                        className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer transition-colors ${
                          paymentMethod === 'bkash' ? 'border-pink-600 bg-pink-50/10' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'bkash'} 
                          onChange={() => setPaymentMethod('bkash')}
                          className="mt-0.5 accent-pink-600"
                        />
                        <div>
                          <strong className="text-pink-600 block leading-none mb-1">bKash (Interactive Mobile Wallet)</strong>
                          <span className="text-[10px] text-slate-450 leading-tight block">Authorize direct merchant checkout. Custom beautiful simulated payment portal sync.</span>
                        </div>
                      </label>

                      {/* Nagad */}
                      <label 
                        className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer transition-colors ${
                          paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-50/10' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'nagad'} 
                          onChange={() => setPaymentMethod('nagad')}
                          className="mt-0.5 accent-orange-500"
                        />
                        <div>
                          <strong className="text-orange-600 block leading-none mb-1">Nagad (Simulated Checkout)</strong>
                          <span className="text-[10px] text-slate-450 leading-tight block">Authorize direct pay. Full transactional authentication.</span>
                        </div>
                      </label>

                      {/* Rocket */}
                      <label 
                        className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer transition-colors ${
                          paymentMethod === 'rocket' ? 'border-purple-600 bg-purple-50/10' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'rocket'} 
                          onChange={() => setPaymentMethod('rocket')}
                          className="mt-0.5 accent-purple-600"
                        />
                        <div>
                          <strong className="text-purple-600 block leading-none mb-1">Rocket DBBL Pay</strong>
                          <span className="text-[10px] text-slate-450 leading-tight block">Direct DBBL authorization simulation.</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPlacing}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    {isPlacing ? 'Processing Secure transaction...' : 'Authorized & Place Order'}
                  </button>

                </form>
              </div>

              {/* Basket list details area right */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit gap-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-slate-950 font-bold text-xs uppercase tracking-wide border-b border-slate-150 pb-3 mb-4">Summary Desk</h3>
                    
                    {/* Cart listings minimal */}
                    <div className="flex flex-col gap-3 font-sans mb-6">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <span className="text-slate-650 max-w-[150px] truncate">{item.product.name} <strong className="text-slate-400">x{item.quantity}</strong></span>
                          <span className="font-bold text-slate-800 font-mono">৳{(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-4 text-xs flex flex-col gap-2 font-sans text-slate-600">
                      <div className="flex justify-between">
                        <span>Cart Total price:</span>
                        <span className="font-bold text-slate-800 font-mono">৳{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Logistics:</span>
                        <span className="font-bold text-slate-800 font-mono">৳{deliveryCharge.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-950 text-sm">
                        <span>Grand Aggregate:</span>
                        <span className="font-black text-blue-600 font-mono">৳{total.toLocaleString()} BDT</span>
                      </div>
                    </div>
                  </div>

                  {/* Security certificate badges */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-[10px] text-slate-500 flex flex-col gap-2 font-sans mt-3">
                    <p className="flex items-center gap-1"><ShieldCheck className="w-4.5 h-4.5 text-blue-500 shrink-0" /> <span>Authorized SSL 128-bit encryption secured.</span></p>
                    <p className="flex items-center gap-1"><CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> <span>Authentic warranty parameters stored instantly.</span></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ------------------------- MOCKING CHECKOUT PORTAL MODAL OVERLAY ------------------------- */}
      {showPortal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in duration-200">
            
            {/* Header portion brand banner */}
            <div className={`${getPortalBrand().color} text-white p-5 text-center relative`}>
              <button 
                onClick={() => setShowPortal(false)}
                className="absolute top-3 right-3 text-white/50 hover:text-white font-bold cursor-pointer text-xs"
              >
                ✕ Cancel Payment
              </button>
              <Smartphone className="w-6 h-6 mx-auto mb-2" />
              <h3 className="font-mono text-sm uppercase tracking-wider">{getPortalBrand().name}</h3>
              <p className="text-[10px] opacity-85 mt-1 font-sans">Authorized transaction for Oliur Tech Store</p>
            </div>

            {/* Portal Interactivity block body */}
            <div className="p-6 font-sans">
              
              {/* Receipt value */}
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center mb-6 text-xs">
                <span className="text-slate-400">Total payable charge BDT:</span>
                <p className="text-lg font-black text-slate-900 font-mono">৳{total.toLocaleString()} BDT</p>
              </div>

              {/* Step 1: Input wallet number */}
              {portalStep === 'number' && (
                <div className="flex flex-col gap-4 text-xs">
                  <p className="text-slate-500 text-[11px] leading-relaxed">Enter your active 11-digit mobile wallet number linked to personal account balance:</p>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Your Account Number:</label>
                    <input 
                      type="tel" 
                      className={`w-full border p-2.5 rounded-lg font-mono tracking-widest text-[#0F172A] focus:outline-none focus:border-indigo-500 ${getPortalBrand().text} text-center font-bold text-sm bg-slate-5 font-sans`}
                      placeholder="e.g. 018XXXXXXXX"
                      maxLength={11}
                      value={walletNo}
                      onChange={(e) => setWalletNo(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleMockProceed}
                    className={`w-full ${getPortalBrand().color} text-white font-bold py-2.5 rounded-lg active:scale-95 transition-all text-xs cursor-pointer`}
                  >
                    Request Authentication OTP
                  </button>
                </div>
              )}

              {/* Step 2: OTP Entry simulation */}
              {portalStep === 'otp' && (
                <div className="flex flex-col gap-4 text-xs">
                  <span className="bg-blue-105 border border-blue-200 p-2 text-blue-600 rounded text-[10px] leading-snug block font-medium">
                    🔍 Simulated SMS OTP: <strong>9283</strong> has been dispatched to <strong>{walletNo}</strong>. Use to authorize checkout.
                  </span>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Enter OTP code received via SMS:</label>
                    <input 
                      type="text" 
                      className="w-full border p-2.5 rounded-lg tracking-widest text-center text-sm font-black focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 9283"
                      maxLength={4}
                      value={walletOtp}
                      onChange={(e) => setWalletOtp(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleMockProceed}
                    className={`w-full ${getPortalBrand().color} text-white font-bold py-2.5 rounded-lg active:scale-95 transition-all text-xs cursor-pointer`}
                  >
                    Authorize OTP Code
                  </button>
                </div>
              )}

              {/* Step 3: Enter security PIN */}
              {portalStep === 'pin' && (
                <div className="flex flex-col gap-3 text-xs">
                  <div className="bg-yellow-50 text-yellow-700 border border-yellow-100 p-2 rounded text-[9px] flex items-start gap-1">
                    <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                    <span>Oliur Tech operates under completely sandboxed gateways. Entering mock characters as PIN is 100% secure.</span>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Enter mock security PIN:</label>
                    <input 
                      type="password" 
                      className="w-full border p-2.5 rounded-lg tracking-widest text-center text-sm font-black focus:outline-none"
                      placeholder="••••"
                      maxLength={5}
                      value={walletPin}
                      onChange={(e) => setWalletPin(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleMockProceed}
                    className={`w-full ${getPortalBrand().color} text-white font-bold py-2.5 rounded-lg active:scale-95 transition-all text-xs cursor-pointer`}
                  >
                    Complete authorized Merchant payment
                  </button>
                </div>
              )}

              {/* Step 4: Loading progress animation */}
              {portalStep === 'processing' && (
                <div className="text-center py-6 text-xs text-slate-500">
                  <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                  <p>Contacting bank security infrastructure...</p>
                  <p className="text-[10px] text-slate-400 mt-1">Acquiring balance verification locks.</p>
                </div>
              )}

              {/* Step 5: Success screen inside portal */}
              {portalStep === 'success' && (
                <div className="text-center py-6 text-xs text-slate-500 font-sans">
                  <div className="bg-emerald-100 text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <strong className="text-emerald-600 font-bold uppercase tracking-wider block">Authorized Checked Success!</strong>
                  <p className="text-[10px] text-slate-400 mt-1">Receipt reference TxnId: <strong>{mockTxnId}</strong></p>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
