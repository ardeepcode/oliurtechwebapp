import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus, MoveRight, HelpCircle } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, navigateTo } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = cart.length > 0 ? 100 : 0; // Standard shipping 100 BDT in Dhaka
  const total = subtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <div className="w-full bg-slate-50 font-sans py-16 text-center">
        <div className="bg-slate-200 text-slate-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-slate-900 font-extrabold text-base mb-2">Your Shopping Cart is vacant</h2>
        <p className="text-slate-400 text-xs max-w-sm mx-auto leading-normal mb-8">
          Explore our range of premium components, laptops, smart accessories and CCTV kits to assemble your dreams.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-lg cursor-pointer transition-all shadow-md shadow-blue-500/10"
        >
          Return to Catalog Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 font-sans py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Navigation title paths */}
        <div className="text-xs text-slate-400 mb-6 flex flex-wrap gap-1 items-center">
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigateTo('home')}>Oliur Tech</span>
          <span>/</span>
          <span className="text-slate-600 font-bold">Shopping Cart</span>
        </div>

        <h1 className="text-slate-950 font-extrabold text-lg md:text-xl tracking-tight uppercase border-l-3 border-blue-500 pl-2 mb-8">
          Interactive Shopping Basket
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Area: Cart Item List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item) => {
              const hasDiscount = item.product.originalPrice > item.product.price;
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  
                  {/* Image & Title group */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img 
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=300'} 
                        alt={item.product.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">{item.product.brand} • {item.product.category}</span>
                      <h4 
                        onClick={() => navigateTo(`/product/${item.product.id}`)}
                        className="text-slate-900 font-bold text-xs truncate max-w-[220px] sm:max-w-[280px] hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] font-mono font-bold text-slate-900 mt-1">
                        ৳{item.product.price.toLocaleString()} BDT
                      </p>
                    </div>
                  </div>

                  {/* Quantity edits & delete */}
                  <div className="flex items-center justify-between sm:justify-start gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-500 hover:bg-slate-50 border-r border-slate-150"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3.5 py-0.5 text-xs text-slate-800 font-bold font-mono">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-slate-500 hover:bg-slate-50 border-l border-slate-150"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-medium block leading-none">Subtotal:</span>
                      <span className="text-xs font-black text-slate-950 font-mono">৳{(item.product.price * item.quantity).toLocaleString()} BDT</span>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>

          {/* Right Area: Order Summary panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit">
              <h3 className="text-slate-950 font-bold text-xs tracking-wide uppercase mb-6 border-b border-slate-100 pb-3">Checkout Receipt</h3>
              
              <div className="flex flex-col gap-3 text-xs text-slate-600 mb-6 font-sans">
                <div className="flex justify-between items-center">
                  <span>Cart Items Value:</span>
                  <span className="font-bold text-slate-900 font-mono">৳{subtotal.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>General Logistics Fee:</span>
                  <span className="font-bold text-slate-900 font-mono">৳{deliveryCharge.toLocaleString()} BDT</span>
                </div>
                
                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Aggregate Total Price:</span>
                  <span className="font-black text-slate-950 text-base font-mono">৳{total.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* Promo validation */}
              <div className="flex gap-1.5 mb-6">
                <input 
                  type="text" 
                  placeholder="Insert Promo Code..."
                  className="bg-slate-50 text-xs border border-slate-100 pl-3 py-2 w-full rounded-lg focus:outline-none"
                />
                <button 
                  onClick={() => alert("Promo code is invalid or expired for this item setup.")}
                  className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-[11px] px-4 rounded-lg cursor-pointer transition-colors"
                >
                  Verify
                </button>
              </div>

              <button 
                onClick={() => navigateTo('checkout')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 transition-colors"
              >
                <span>Proceed to Checkout</span>
                <MoveRight className="w-3.5 h-3.5" />
              </button>

              <div className="mt-4 text-center">
                <button 
                  onClick={() => navigateTo('shop')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 hover:underline font-bold"
                >
                  ← Keep Shopping Catalog
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
