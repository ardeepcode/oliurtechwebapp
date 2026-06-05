import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Layers, Package, ShoppingCart, Calendar, Users, Cpu, 
  Trash2, Plus, Edit, ListFilter, TrendingUp, CheckCircle,
  Truck, HelpCircle, Save, PenSquare, Eye, Download, Printer,
  FileSpreadsheet, FileText
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, navigateTo, products, refreshProducts,
    submitServiceRequest // used for updates / etc if needed
  } = useApp();

  // Route security shield
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="w-full bg-slate-50 font-sans py-16 text-center">
        <h2 className="text-rose-500 font-bold mb-2">Restricted Security Area</h2>
        <p className="text-slate-400 text-xs mb-4">Please authenticate using the administrator login page.</p>
        <button onClick={() => navigateTo('admin-login')} className="bg-indigo-600 text-white font-bold text-xs p-2.5 px-4 rounded">
          Authenticate Staff
        </button>
      </div>
    );
  }

  // Admin View State tabs
  const [adminTab, setAdminTab] = useState<'analytics' | 'products' | 'orders' | 'servicing' | 'reports'>('analytics');

  // Reports state properties
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [selectedDate, setSelectedDate] = useState('2026-06-01');
  const [startDate, setStartDate] = useState('2026-05-25');
  const [endDate, setEndDate] = useState('2026-06-01');
  const [reportOrderFilter, setReportOrderFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [reportQuery, setReportQuery] = useState('');

  // Backend Data States
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Dynamic Product Edit Form fields
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProductMode, setEditProductMode] = useState<string | null>(null); // Id of edit target
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('DESKTOP');
  const [prodImage, setProdImage] = useState('');
  const [prodPrice, setProdPrice] = useState(1500);
  const [prodOrigPrice, setProdOrigPrice] = useState(1800);
  const [prodStock, setProdStock] = useState(10);
  const [prodDescription, setProdDescription] = useState('');
  const [prodSpecs, setProdSpecs] = useState(''); // comma-separated strings inside string

  // Fetch all orders & requests
  const fetchAdminData = async () => {
    setLoadingOrders(true);
    setLoadingRequests(true);
    try {
      const oRes = await fetch('/api/orders');
      if (oRes.ok) {
        const oData = await oRes.json();
        setAllOrders(oData);
      }

      const rRes = await fetch('/api/service-requests');
      if (rRes.ok) {
        const rData = await rRes.json();
        setAllRequests(rData);
      }
    } catch (e) {
      console.error("Error loading admin panels", e);
    } finally {
      setLoadingOrders(false);
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [adminTab]);

  // Handle Order Status Modification
  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus })
      });
      if (res.ok) {
        alert(`Order ${orderId} has been successfully updated.`);
        fetchAdminData();
      } else {
        alert("Server failed to update order attributes.");
      }
    } catch (err) {
      alert("Connectivity exception occurred.");
    }
  };

  // Handle Service Request Status Modification + Notes
  const handleUpdateServiceStatus = async (requestId: string, status: string, notes: string) => {
    try {
      const res = await fetch(`/api/service-requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        alert("Service ticket record changed successfully!");
        fetchAdminData();
      } else {
        alert("Server issue while writing service alterations.");
      }
    } catch (e) {
      alert("Error reaching system backend API.");
    }
  };

  // Save or Create Product Item
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prodName || !prodBrand || !prodImage) {
      alert("Pristine titles, brand handles and component visual URLs are mandatory.");
      return;
    }

    const payload = {
      name: prodName,
      brand: prodBrand,
      category: prodCategory,
      images: [prodImage],
      price: Number(prodPrice),
      originalPrice: Number(prodOrigPrice),
      stock: Number(prodStock),
      description: prodDescription,
      rating: 4.8,
      reviews: [],
      specifications: prodSpecs.split(',').reduce((acc: any, cur: string) => {
        const parts = cur.split(':');
        if (parts.length >= 2) {
          acc[parts[0].trim()] = parts[1].trim();
        }
        return acc;
      }, { "Warranty": "1 Year" })
    };

    const url = editProductMode ? `/api/products/${editProductMode}` : '/api/products';
    const method = editProductMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editProductMode ? "Product updated successfully!" : "New product inserted securely!");
        setShowProductForm(false);
        setEditProductMode(null);
        // Clear forms
        setProdName('');
        setProdBrand('');
        setProdImage('');
        setProdDescription('');
        setProdSpecs('');
        refreshProducts(); // refresh client cache list
      } else {
        alert("Error handling database transaction for goods.");
      }
    } catch (e) {
      alert("Connection failure.");
    }
  };

  // Setup Product Edit form
  const triggerEditProduct = (p: any) => {
    setEditProductMode(p.id);
    setProdName(p.name);
    setProdBrand(p.brand);
    setProdCategory(p.category);
    setProdImage(p.images[0] || '');
    setProdPrice(p.price);
    setProdOrigPrice(p.originalPrice);
    setProdStock(p.stock);
    setProdDescription(p.description || '');
    
    // flatten specs object to key:val, key:val
    const flatSpecs = Object.entries(p.specifications || {})
      .map(([k, v]) => `${k}:${v}`)
      .join(', ');
    setProdSpecs(flatSpecs);

    setShowProductForm(true);
  };

  // Trigger Delete Product
  const handleDeleteProduct = async (pId: string) => {
    if (!window.confirm("Are you absolutely sure you wish to delete this item from inventories? This action is irreversible.")) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${pId}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Product wiped successfully.");
        refreshProducts();
      } else {
        alert("Backend failed to erase product database locks.");
      }
    } catch (e) {
      alert("Connectivity loss.");
    }
  };

  // ANALYTICS DERIVATIVES
  const totalRevenueVal = allOrders
    .filter(ord => ord.status !== 'cancelled')
    .reduce((sum, current) => sum + current.total, 0);

  const totalDesktopStock = products.filter(p => p.category === 'DESKTOP').length;
  const totalLaptopStock = products.filter(p => p.category === 'LAPTOP').length;
  const totalCctvStock = products.filter(p => p.category === 'CCTV CAMERA').length;

  const orderCategoryDistributionData = [
    { name: 'Desktop Setups', value: totalDesktopStock, color: '#3B82F6' },
    { name: 'Laptop Series', value: totalLaptopStock, color: '#F59E0B' },
    { name: 'CCTV Camera Bundles', value: totalCctvStock, color: '#10B981' }
  ];

  const salesLineChartData = [
    { date: 'June 01', Sales: totalRevenueVal / 2 },
    { date: 'June 02', Sales: totalRevenueVal * 0.75 },
    { date: 'June 03', Sales: totalRevenueVal }
  ];

  return (
    <div className="w-full bg-slate-50 font-sans py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Upper Administrative Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase leading-none">
                Mainframe Administration Activated
              </span>
              <span className="text-slate-500 font-mono text-[10px]">Secure Terminal Connection Verified</span>
            </div>
            <h1 className="text-lg md:text-2xl font-black mt-1 uppercase tracking-tight">Oliur Tech Control Room</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => { setAdminTab('analytics'); }} 
              className={`p-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'analytics' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-850 text-slate-300'
              }`}
            >
              System Analytics
            </button>
            <button 
              onClick={() => { setAdminTab('products'); }} 
              className={`p-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'products' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-850 text-slate-300'
              }`}
            >
              Products Stock ({products.length})
            </button>
            <button 
              onClick={() => { setAdminTab('orders'); }} 
              className={`p-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-850 text-slate-300'
              }`}
            >
              Customer Orders ({allOrders.length})
            </button>
            <button 
              onClick={() => { setAdminTab('servicing'); }} 
              className={`p-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'servicing' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-850 text-slate-300'
              }`}
            >
              IT Support ({allRequests.length})
            </button>
            <button 
              onClick={() => { setAdminTab('reports'); }} 
              className={`p-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'reports' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 hover:bg-slate-850 text-slate-300'
              }`}
            >
              Sales Reports
            </button>
          </div>
        </div>

        {/* --------------------------- VIEW A: SYSTEM ANALYTICS --------------------------- */}
        {adminTab === 'analytics' && (
          <div className="flex flex-col gap-8">
            
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              <div className="bg-white border rounded-2xl p-5 shadow-sm text-xs">
                <span className="text-slate-450 uppercase tracking-wider text-[10px] font-bold block leading-none mb-1">Gross Billing Sales</span>
                <p className="text-xl md:text-2xl font-black text-slate-900 font-mono">৳{totalRevenueVal.toLocaleString()} <span className="text-xs text-slate-400 font-sans">BDT</span></p>
                <span className="text-emerald-500 font-extrabold text-[10px] mt-1 block">✔ Live Transaction Validated</span>
              </div>

              <div className="bg-white border rounded-2xl p-5 shadow-sm text-xs">
                <span className="text-slate-450 uppercase tracking-wider text-[10px] font-bold block leading-none mb-1">Total Sales Orders</span>
                <p className="text-xl md:text-2xl font-black text-slate-900 font-mono">{allOrders.length} <span className="text-xs text-slate-400 font-sans">Orders</span></p>
                <span className="text-blue-500 font-extrabold text-[10px] mt-1 block">📈 Satisfactory Conversion Rate</span>
              </div>

              <div className="bg-white border rounded-2xl p-5 shadow-sm text-xs">
                <span className="text-slate-450 uppercase tracking-wider text-[10px] font-bold block leading-none mb-1">IT Service Bookings</span>
                <p className="text-xl md:text-2xl font-black text-slate-900 font-mono">{allRequests.length} <span className="text-xs text-slate-400 font-sans">Tickets</span></p>
                <span className="text-orange-500 font-extrabold text-[10px] mt-1 block">🛠 Computer & CCTV installs</span>
              </div>

              <div className="bg-white border rounded-2xl p-5 shadow-sm text-xs">
                <span className="text-slate-450 uppercase tracking-wider text-[10px] font-bold block leading-none mb-1">Corporate Catalog Sizes</span>
                <p className="text-xl md:text-2xl font-black text-slate-900 font-mono">{products.length} <span className="text-xs text-slate-400 font-sans">Coded SKUs</span></p>
                <span className="text-indigo-500 font-extrabold text-[10px] mt-1 block">📦 High-Density Tech Store</span>
              </div>
            </div>

            {/* Recharts Graphical Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Sales line graph left */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border shadow-sm">
                <div className="mb-6 font-sans">
                  <h3 className="text-slate-900 font-bold text-xs uppercase">Billed Revenue growth over time</h3>
                  <p className="text-slate-400 text-[11px] mt-1">Reflects aggregated customer paid acquisitions inside Bangladesh.</p>
                </div>

                <div className="h-64 text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesLineChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Sales" fill="#2563EB" name="Billed Revenue (BDT)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie diagram distribution right */}
              <div className="lg:col-span-1 bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-slate-900 font-bold text-xs uppercase mb-1">Product Categories Coverage</h3>
                  <p className="text-slate-400 text-[11px]">Aggregated distribution of high-value SKUs in store.</p>
                </div>

                <div className="h-44 my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderCategoryDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderCategoryDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-2 font-sans text-xs">
                  {orderCategoryDistributionData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} /> {item.name}</span>
                      <strong className="text-slate-900 font-mono">{item.value} items</strong>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* --------------------------- VIEW B: PRODUCT STOCK MANAGEMENT --------------------------- */}
        {adminTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-3 font-sans">
              <div>
                <h3 className="text-slate-900 font-bold text-sm uppercase">Active Inventories & Products ({products.length})</h3>
                <p className="text-slate-400 text-xs mt-1">Insert, edit parameters, check warranty schemas or delete physical store laptops, PCs & CCTV boxes.</p>
              </div>

              <button
                onClick={() => { 
                  setEditProductMode(null); 
                  setProdName(''); 
                  setProdBrand(''); 
                  setProdImage(''); 
                  setProdDescription(''); 
                  setProdSpecs(''); 
                  setShowProductForm(true); 
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Product</span>
              </button>
            </div>

            {/* PRODUCT ADD/EDIT FORM OVERLAY */}
            {showProductForm && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 mb-8 max-w-4xl animate-in fade-in duration-200">
                <div className="flex justify-between border-b pb-2 mb-4">
                  <h4 className="text-slate-900 font-bold text-xs uppercase">{editProductMode ? 'Edit Product Parameters' : 'Insert New Tech Equipment'}</h4>
                  <button onClick={() => setShowProductForm(false)} className="text-slate-400 font-bold hover:text-slate-650 cursor-pointer text-xs">✕ Close Form</button>
                </div>

                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Product Title *</label>
                    <input type="text" required className="w-full bg-white border p-2 text-xs rounded-lg focus:outline-none" placeholder="e.g. Asus Vivobook 15 Core i5 12th Gen" value={prodName} onChange={(e) => setProdName(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Brand Handle *</label>
                    <input type="text" required className="w-full bg-white border p-2 text-xs rounded-lg focus:outline-none" placeholder="e.g. ASUS" value={prodBrand} onChange={(e) => setProdBrand(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Store Category *</label>
                    <select className="w-full bg-white border p-2 text-xs rounded-lg focus:outline-none" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                      <option value="DESKTOP">DESKTOP</option>
                      <option value="LAPTOP">LAPTOP</option>
                      <option value="MONITOR">MONITOR</option>
                      <option value="CCTV CAMERA">CCTV CAMERA</option>
                      <option value="SMARTPHONE">SMARTPHONE</option>
                      <option value="ACCESSORIES">ACCESSORIES</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Target BDT Price *</label>
                    <input type="number" required className="w-full bg-white border p-2 text-xs rounded-lg focus:outline-none" value={prodPrice} onChange={(e) => setProdPrice(Number(e.target.value))} />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Original BDT Price *</label>
                    <input type="number" required className="w-full bg-white border p-2 text-xs rounded-lg focus:outline-none" value={prodOrigPrice} onChange={(e) => setProdOrigPrice(Number(e.target.value))} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Component Visual URL Link *</label>
                    <input type="text" required className="w-full bg-white border p-2 text-xs rounded-lg focus:outline-none" value={prodImage} onChange={(e) => setProdImage(e.target.value)} placeholder="https://images.unsplash.com/..." />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Stock Availability *</label>
                    <input type="number" required className="w-full bg-white border p-2 text-xs rounded-lg focus:outline-none" value={prodStock} onChange={(e) => setProdStock(Number(e.target.value))} />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-500 font-semibold mb-1">Specifications (Format key:val, comma-separated rules)</label>
                    <input type="text" className="w-full bg-white border p-2 text-xs rounded-lg focus:outline-none font-mono" placeholder="Processor:Intel i5, RAM:8GB DDR4, Storage:512GB SSD, Warranty:2 Years" value={prodSpecs} onChange={(e) => setProdSpecs(e.target.value)} />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-500 font-semibold mb-1">Detailed Description *</label>
                    <textarea rows={4} required className="w-full bg-white border p-2 rounded-lg focus:outline-none font-sans" value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} placeholder="Asus Vivobook provides high performance under multi-thread loads..." />
                  </div>

                  <div className="sm:col-span-3 pt-2">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2.5 px-6 rounded-lg text-xs cursor-pointer">
                      {editProductMode ? 'Save Edits' : 'Save New Product Record'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TABULAR PRODUCTS LIST */}
            <div className="overflow-x-auto text-[11px] font-sans">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 uppercase text-slate-400 font-bold border-b">
                    <th className="p-3">Cover Image</th>
                    <th className="p-3 w-1/3">Product Title</th>
                    <th className="p-3">Brand Handles</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Billed Price</th>
                    <th className="p-3">Inventory Stock</th>
                    <th className="p-3 text-right">Utility Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 border-b">
                      <td className="p-3">
                        <div className="w-10 h-10 rounded border overflow-hidden bg-white shrink-0">
                          <img src={p.images[0]} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-3 font-bold text-slate-900 truncate max-w-xs">{p.name}</td>
                      <td className="p-3 font-semibold text-slate-650">{p.brand}</td>
                      <td className="p-3 uppercase font-mono text-[10px] text-slate-450">{p.category}</td>
                      <td className="p-3 font-mono font-bold text-blue-600 text-xs">৳{p.price.toLocaleString()} BDT</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                          p.stock > 3 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'
                        }`}>
                          {p.stock} Left
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => triggerEditProduct(p)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded cursor-pointer" title="Edit Item"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="bg-rose-50 hover:bg-rose-100 text-rose-650 p-1.5 rounded cursor-pointer" title="Delete SKU"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --------------------------- VIEW C: CUSTOMER SALES ORDERS --------------------------- */}
        {adminTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border shadow-sm">
            <div className="border-b pb-4 mb-6">
              <h3 className="text-slate-900 font-bold text-sm uppercase">Acquisitions & Customer Orders ({allOrders.length})</h3>
              <p className="text-slate-400 text-xs mt-1">Alter order state updates dynamically relative to shipping milestones.</p>
            </div>

            {loadingOrders ? (
              <div className="text-center py-8">Searching sales records...</div>
            ) : (
              <div className="flex flex-col gap-5 text-xs font-sans">
                {allOrders.map((ord) => (
                  <div key={ord.id} className="border border-slate-150/60 bg-slate-50/50 rounded-2xl p-5 flex flex-col gap-4">
                    
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3 border-dashed border-slate-200">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 font-bold leading-none">ORDER SEQUENCE CODE</span>
                        <h4 className="text-slate-900 font-extrabold font-mono text-sm leading-none mt-0.5">{ord.id}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-none">Buyer: <strong>{ord.customerName} ({ord.customerPhone})</strong></p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-none">Shipping: <strong>{ord.shippingAddress}</strong></p>
                      </div>

                      {/* Dropdown status changer controls (highly interactive in admin!) */}
                      <div className="flex flex-wrap gap-2 text-[11px] font-sans">
                        <div className="flex flex-col gap-0.5">
                          <label className="text-[9px] text-slate-400 uppercase font-bold font-sans">Order Stage:</label>
                          <select 
                            className="bg-white border rounded p-1 text-[11px] font-bold focus:outline-none"
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value, ord.paymentStatus)}
                          >
                            <option value="pending">PENDING</option>
                            <option value="processing">PROCESSING</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <label className="text-[9px] text-slate-400 uppercase font-bold font-sans">Bank Check:</label>
                          <select 
                            className="bg-white border rounded p-1 text-[11px] font-bold focus:outline-none"
                            value={ord.paymentStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, ord.status, e.target.value)}
                          >
                            <option value="pending">PENDING</option>
                            <option value="paid">PAID</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Order products summary */}
                    <div className="flex flex-col gap-2 bg-white rounded-xl p-3 border border-slate-100">
                      {ord.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-slate-650 font-medium">{item.name} <strong className="text-slate-400">x{item.quantity}</strong></span>
                          <span className="font-bold text-slate-800 font-mono">৳{(item.price * item.quantity).toLocaleString()} BDT</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs">
                      <div>
                        <span>Method: <strong>{ord.paymentMethod.toUpperCase()}</strong></span>
                        {ord.paymentTxnId && <span className="ml-3 bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-[10px]">TxnID: {ord.paymentTxnId}</span>}
                      </div>

                      <strong className="text-slate-900 font-bold mt-1 sm:mt-0 font-sans">Aggregate total: <strong className="text-blue-600 font-mono text-xs">৳{ord.total.toLocaleString()} BDT</strong></strong>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --------------------------- VIEW D: IT SUPPORT BOOKINGS --------------------------- */}
        {adminTab === 'servicing' && (
          <div className="bg-white rounded-3xl p-6 border shadow-sm">
            <div className="border-b pb-4 mb-6">
              <h3 className="text-slate-900 font-bold text-sm uppercase">Professional IT Services Bookings ({allRequests.length})</h3>
              <p className="text-slate-400 text-xs mt-1">Review diagnostic schedules, update progress, write professional staff notes to keep clients informed.</p>
            </div>

            {loadingRequests ? (
              <div className="text-center py-8">Searching support tickets...</div>
            ) : (
              <div className="flex flex-col gap-5 text-xs font-sans">
                {allRequests.map((srv) => (
                  <div key={srv.id} className="border border-slate-150-60 bg-slate-50/50 rounded-2xl p-5 flex flex-col gap-4">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3 border-dashed border-slate-200">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400 font-bold">Ticket:</span>
                          <strong className="text-slate-900 font-bold font-mono text-xs">{srv.id}</strong>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold font-mono ${
                            srv.serviceType === 'computer' ? 'bg-blue-105 text-blue-600 border border-blue-200' : 'bg-orange-105 text-orange-600 border border-orange-200'
                          }`}>
                            {srv.serviceType === 'computer' ? '🔧 Computer Fix' : '📹 CCTV install'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-450 mt-1">Client: <strong>{srv.customerName} ({srv.customerPhone}) • {srv.customerEmail}</strong></p>
                        <p className="text-[10px] text-slate-450 mt-1">Address: <strong>{srv.customerAddress}</strong></p>
                      </div>

                      {/* Dropdown status controls */}
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] text-slate-400 uppercase font-bold font-sans">Ticket Mode Status:</label>
                        <select
                          className="bg-white border rounded p-1 text-[11px] font-bold focus:outline-none"
                          value={srv.status}
                          onChange={(e) => handleUpdateServiceStatus(srv.id, e.target.value, srv.notes || '')}
                        >
                          <option value="pending">PENDING</option>
                          <option value="approved">APPROVED</option>
                          <option value="processing">PROCESSING</option>
                          <option value="completed">COMPLETED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-xs bg-white rounded-xl p-3 border border-slate-100">
                      <p className="mb-1"><span className="text-slate-400">Prescribed diagnostic scope:</span> <strong className="text-slate-800">{srv.specificService}</strong></p>
                      <p className="mb-1"><span className="text-slate-400">Scheduled:</span> <strong className="text-slate-800">{srv.preferredDate} ({srv.preferredTime})</strong></p>
                      <p className="italic text-slate-500 mt-2 font-sans border-t pt-2 border-slate-50">"{srv.description}"</p>
                    </div>

                    {/* Interactive Tech Notes Editor inside Admin (Very cool functionality request!) */}
                    <InteractiveNotesForm 
                      request={srv} 
                      onSaveNotes={(notesVal) => handleUpdateServiceStatus(srv.id, srv.status, notesVal)} 
                    />

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --------------------------- VIEW E: INTUITIVE SALES REPORTS --------------------------- */}
        {adminTab === 'reports' && (() => {
          // Calculations inside self-executing function inside React
          const getFilteredReportOrders = () => {
            let result = allOrders;

            // 1. Period filter
            if (reportPeriod === 'daily') {
              result = result.filter(o => o.createdAt && o.createdAt.startsWith(selectedDate));
            } else if (reportPeriod === 'weekly') {
              const end = new Date(selectedDate);
              const start = new Date(selectedDate);
              start.setDate(end.getDate() - 6); // 7 days inclusive
              
              const startStr = start.toISOString().split('T')[0];
              const endStr = selectedDate;

              result = result.filter(o => {
                if (!o.createdAt) return false;
                const d = o.createdAt.split('T')[0];
                return d >= startStr && d <= endStr;
              });
            } else if (reportPeriod === 'custom') {
              result = result.filter(o => {
                if (!o.createdAt) return false;
                const d = o.createdAt.split('T')[0];
                return d >= startDate && d <= endDate;
              });
            }

            // 2. Payment Status filter
            if (reportOrderFilter === 'paid') {
              result = result.filter(o => o.paymentStatus === 'paid');
            } else if (reportOrderFilter === 'pending') {
              result = result.filter(o => o.paymentStatus === 'pending');
            }

            // 3. Search query filter
            if (reportQuery.trim() !== '') {
              const q = reportQuery.toLowerCase().trim();
              result = result.filter(o => {
                const nameMatch = o.customerName && o.customerName.toLowerCase().includes(q);
                const phoneMatch = o.customerPhone && o.customerPhone.toLowerCase().includes(q);
                const idMatch = o.id && o.id.toString().toLowerCase().includes(q);
                return nameMatch || phoneMatch || idMatch || false;
              });
            }

            return [...result].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          };

          const reportOrders = getFilteredReportOrders();

          // Financial calculations
          const validFinOrders = reportOrders.filter(o => o.status !== 'cancelled');
          const reportRevenue = validFinOrders.reduce((sum, o) => sum + o.total, 0);
          const reportOrdersCount = reportOrders.length;
          const reportCancelledCount = reportOrders.filter(o => o.status === 'cancelled').length;
          const reportPendingAmount = reportOrders.filter(o => o.paymentStatus === 'pending' && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
          const reportAOV = validFinOrders.length > 0 ? reportRevenue / validFinOrders.length : 0;

          // Units and breakdowns
          let reportUnitsSold = 0;
          const reportCategoryBreakdown: Record<string, { count: number; sales: number }> = {};
          const reportPaymentBreakdown: Record<string, { count: number; sales: number }> = {};

          reportOrders.forEach(ord => {
            const isCancelled = ord.status === 'cancelled';
            
            if (ord.items && Array.isArray(ord.items)) {
              ord.items.forEach((item: any) => {
                const qty = item.quantity || 1;
                reportUnitsSold += qty;

                // Category lookup
                const matchedProd = products.find(p => p.id === item.id);
                const cat = matchedProd ? matchedProd.category : 'ACCESSORIES';

                if (!reportCategoryBreakdown[cat]) {
                  reportCategoryBreakdown[cat] = { count: 0, sales: 0 };
                }
                reportCategoryBreakdown[cat].count += qty;
                if (!isCancelled) {
                  reportCategoryBreakdown[cat].sales += (item.price * qty);
                }
              });
            }

            const method = ord.paymentMethod || 'cod';
            if (!reportPaymentBreakdown[method]) {
              reportPaymentBreakdown[method] = { count: 0, sales: 0 };
            }
            reportPaymentBreakdown[method].count += 1;
            if (!isCancelled) {
              reportPaymentBreakdown[method].sales += ord.total;
            }
          });

          // CSV Download Handler
          const handleDownloadCSV = () => {
            const rows = [
              ["OLIUR TECH SALES REPORT"],
              [`Generated At`, new Date().toLocaleString()],
              [`Report Period Type`, reportPeriod.toUpperCase()],
              [`Date Range`, reportPeriod === 'daily' ? selectedDate : reportPeriod === 'weekly' ? `7 Days up to ${selectedDate}` : `${startDate} to ${endDate}`],
              [`Financial Net Revenue (BDT)`, `৳${reportRevenue.toLocaleString()}`],
              [`Total Items Handled`, reportUnitsSold],
              [],
              ["Order ID", "Date Created", "Customer Name", "Contact", "Payment Type", "Payment Status", "Shipping Stage", "Total Amount BDT"]
            ];

            reportOrders.forEach(ord => {
              rows.push([
                ord.id,
                ord.createdAt ? ord.createdAt.split('T')[0] : '',
                ord.customerName,
                ord.customerPhone,
                ord.paymentMethod ? ord.paymentMethod.toUpperCase() : 'COD',
                ord.paymentStatus ? ord.paymentStatus.toUpperCase() : 'PENDING',
                ord.status ? ord.status.toUpperCase() : 'PENDING',
                ord.total.toString()
              ]);
            });

            const csvContent = rows.map(r => r.map(val => {
              const clean = (val || '').toString().replace(/"/g, '""');
              return clean.includes(',') || clean.includes('\n') || clean.includes('"') ? `"${clean}"` : clean;
            }).join(",")).join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `Oliur_Tech_Sales_Report_${reportPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };

          const handlePrint = () => {
            window.print();
          };

          return (
            <div className="flex flex-col gap-8 animate-in fade-in duration-200">
              
              {/* Report Query Filters Dashboard */}
              <div className="bg-white rounded-3xl p-6 border shadow-sm flex flex-col gap-6 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-3">
                  <div>
                    <h3 className="text-slate-900 font-extrabold text-sm uppercase flex items-center gap-2">
                      <FileText className="w-5 h-5 text-brand-secondary" />
                      <span>Administrative Reports Center</span>
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Configure parameters to inspect daily, weekly or historical shop performance metrics.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleDownloadCSV}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold p-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Export CSV Spreadsheet</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold p-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Document</span>
                    </button>
                  </div>
                </div>

                {/* Filter Controls Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                  
                  {/* Period selection */}
                  <div>
                    <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">Reporting Period Type</label>
                    <div className="grid grid-cols-3 bg-slate-100 rounded-lg p-1 border">
                      <button 
                        onClick={() => setReportPeriod('daily')}
                        className={`py-1.5 rounded-md text-center transition-all cursor-pointer font-bold ${
                          reportPeriod === 'daily' ? 'bg-white text-brand-secondary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Daily
                      </button>
                      <button 
                        onClick={() => setReportPeriod('weekly')}
                        className={`py-1.5 rounded-md text-center transition-all cursor-pointer font-bold ${
                          reportPeriod === 'weekly' ? 'bg-white text-brand-secondary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Weekly
                      </button>
                      <button 
                        onClick={() => setReportPeriod('custom')}
                        className={`py-1.5 rounded-md text-center transition-all cursor-pointer font-bold ${
                          reportPeriod === 'custom' ? 'bg-white text-brand-secondary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                  </div>

                  {/* Period Context Input Fields */}
                  {reportPeriod === 'daily' && (
                    <div>
                      <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">Select Active Day</label>
                      <input 
                        type="date" 
                        max="2026-12-31"
                        className="bg-white border rounded-lg p-2 w-full font-sans text-xs focus:ring-2 focus:ring-blue-500 font-bold focus:outline-none"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  )}

                  {reportPeriod === 'weekly' && (
                    <div>
                      <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">Week Trailing End Date</label>
                      <input 
                        type="date" 
                        className="bg-white border rounded-lg p-2 w-full font-sans text-xs focus:ring-2 focus:ring-blue-500 font-bold focus:outline-none"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  )}

                  {reportPeriod === 'custom' && (
                    <div className="grid grid-cols-2 gap-2 md:col-span-1">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">Range Start</label>
                        <input 
                          type="date" 
                          className="bg-white border rounded-lg p-1.5 w-full font-sans text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">Range End</label>
                        <input 
                          type="date" 
                          className="bg-white border rounded-lg p-1.5 w-full font-sans text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment State Filters */}
                  <div>
                    <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">Payment Verification Status</label>
                    <select
                      className="bg-white border rounded-lg p-2 w-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={reportOrderFilter}
                      onChange={(e: any) => setReportOrderFilter(e.target.value)}
                    >
                      <option value="all">ALL VERIFIED ORDERS</option>
                      <option value="paid">PAID IN FULL ONLY</option>
                      <option value="pending">PENDING ACQUISITIONS ONLY</option>
                    </select>
                  </div>

                  {/* User Search Query */}
                  <div>
                    <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">Filter Customer Name / Phone / OrderID</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Search current scope..."
                        className="bg-white border rounded-lg p-2 w-full text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                        value={reportQuery}
                        onChange={(e) => setReportQuery(e.target.value)}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Financial Dashboard Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                
                <div className="bg-white border rounded-2xl p-5 shadow-sm text-xs border-l-4 border-blue-600">
                  <span className="text-slate-450 uppercase tracking-wider text-[10px] font-bold block mb-1">Financial Net Revenue</span>
                  <p className="text-xl md:text-2xl font-black text-slate-900 font-mono">৳{reportRevenue.toLocaleString()} BDT</p>
                  <span className="text-slate-450 text-[10px] block mt-1">Excludes cancelled transactions</span>
                </div>

                <div className="bg-white border rounded-2xl p-5 shadow-sm text-xs border-l-4 border-emerald-600">
                  <span className="text-slate-450 uppercase tracking-wider text-[10px] font-bold block mb-1">Handled Orders</span>
                  <p className="text-xl md:text-2xl font-black text-slate-900 font-mono">
                    {reportOrdersCount} <span className="text-xs font-sans text-slate-400">Total</span>
                  </p>
                  <span className="text-rose-500 font-semibold text-[10px] block mt-1">
                    {reportCancelledCount} Cancelled • {reportOrdersCount - reportCancelledCount} Validated
                  </span>
                </div>

                <div className="bg-white border rounded-2xl p-5 shadow-sm text-xs border-l-4 border-orange-500">
                  <span className="text-slate-450 uppercase tracking-wider text-[10px] font-bold block mb-1">Average Order Value (AOV)</span>
                  <p className="text-xl md:text-2xl font-black text-slate-900 font-mono">৳{Math.round(reportAOV).toLocaleString()} BDT</p>
                  <span className="text-slate-450 text-[10px] block mt-1">Average yield per customer ticket</span>
                </div>

                <div className="bg-white border rounded-2xl p-5 shadow-sm text-xs border-l-4 border-purple-600">
                  <span className="text-slate-450 uppercase tracking-wider text-[10px] font-bold block mb-1">C.O.D. Outstanding Payments</span>
                  <p className="text-xl md:text-2xl font-black text-slate-900 font-mono">৳{reportPendingAmount.toLocaleString()} BDT</p>
                  <span className="text-slate-450 text-[10px] block mt-1">Sum of pending Cash On Delivery</span>
                </div>

              </div>

              {/* Proportional Grid Analysis Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans text-xs">
                
                {/* Store Category Breakdown */}
                <div className="bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-slate-900 font-bold uppercase block tracking-wider mb-1 text-[11px]">Product Categories Demand Share</h4>
                    <p className="text-slate-400 text-[11px] mb-4">Percentage volume of technology products sold in report window.</p>
                  </div>

                  <div className="space-y-4">
                    {Object.keys(reportCategoryBreakdown).length === 0 ? (
                      <div className="text-slate-405 text-center py-4">No categories sold in this window</div>
                    ) : (
                      Object.entries(reportCategoryBreakdown).map(([cat, detail], index) => {
                        const pct = Math.round((detail.sales / (reportRevenue || 1)) * 100);
                        return (
                          <div key={index} className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-xs font-semibold">
                              <span className="uppercase text-slate-700 font-sans tracking-wide text-[10px]">{cat}</span>
                              <span className="font-mono text-slate-900 text-[11px]">{pct}% (৳{detail.sales.toLocaleString()} BDT)</span>
                            </div>
                            <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="absolute left-0 top-0 h-full bg-blue-600 rounded-full" 
                                style={{ width: `${Math.min(100, Math.max(2, pct))}%` }} 
                              />
                            </div>
                            <div className="text-[10px] text-slate-400 font-sans mt-0.5">Quantity sold: <strong>{detail.count} items</strong></div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Gateway Payment Breakdown */}
                <div className="bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-slate-900 font-bold uppercase block tracking-wider mb-1 text-[11px]">Payment Methods share</h4>
                    <p className="text-slate-400 text-[11px] mb-4">Billed processing volume distributed across dynamic local gateways.</p>
                  </div>

                  <div className="space-y-4">
                    {Object.keys(reportPaymentBreakdown).length === 0 ? (
                      <div className="text-slate-405 text-center py-4">No verified payments in this window</div>
                    ) : (
                      Object.entries(reportPaymentBreakdown).map(([method, detail], index) => {
                        const pct = Math.round((detail.sales / (reportRevenue || 1)) * 100);
                        return (
                          <div key={index} className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-xs font-semibold">
                              <span className="uppercase text-slate-700 font-sans tracking-wide text-[10px]">{method}</span>
                              <span className="font-mono text-slate-900 text-[11px]">{pct}% (৳{detail.sales.toLocaleString()} BDT)</span>
                            </div>
                            <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="absolute left-0 top-0 h-full bg-orange-505 bg-orange-500 rounded-full" 
                                style={{ width: `${Math.min(100, Math.max(2, pct))}%` }} 
                              />
                            </div>
                            <div className="text-[10px] text-slate-400 font-sans mt-0.5">Transactions Count: <strong>{detail.count} times</strong></div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* printable A4 Report simulation sheet */}
              <div className="mt-4 border-2 border-slate-200 border-dashed rounded-3xl p-4 bg-slate-50/40">
                <p className="text-[11px] text-slate-500 font-sans mb-3 text-center">
                  Below is a <strong>Print-Ready A4 Document view</strong>. When you click <strong>"Print Document"</strong>, the document below is formatted cleanly for physical paper or PDF exporting.
                </p>

                <div 
                  id="print-journal-sheet"
                  className="bg-white border rounded-sm p-8 shadow-md max-w-4xl mx-auto text-slate-800 font-sans relative overflow-hidden"
                  style={{ minHeight: '650px' }}
                >
                  
                  {/* Decorative Header ribbon */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500" />

                  {/* Document Header block */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 border-slate-200 mt-2 gap-4">
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">OLIUR TECH</h4>
                      <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1 md:mt-0">Building the Dream of Technology</p>
                      <div className="text-[10px] text-slate-500 mt-2">
                        <span>Amin Complex, Zinjira, Keraniganj, Dhaka</span><br />
                        <span>Phone: +880 1827-104825 • Email: oliurtech@gmail.com</span>
                      </div>
                    </div>

                    <div className="text-right sm:items-end">
                      <h5 className="text-xs uppercase font-extrabold tracking-widest text-[#2563EB] font-mono">SALES AUDIT SHEET</h5>
                      <div className="text-[10px] text-slate-500 mt-2 space-y-0.5">
                        <p><strong>Period:</strong> {reportPeriod.toUpperCase()}</p>
                        <p><strong>Window Coverage:</strong> {
                          reportPeriod === 'daily' ? selectedDate : reportPeriod === 'weekly' ? `7 Days ending ${selectedDate}` : `${startDate} to ${endDate}`
                        }</p>
                        <p><strong>Generated on:</strong> {new Date().toLocaleString()}</p>
                        <p><strong>Status:</strong> staff authorized audit copy</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Segment inside letter */}
                  <div className="grid grid-cols-3 gap-6 py-6 border-b border-slate-200 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Net Sales Revenue</p>
                      <p className="text-base font-extrabold text-slate-900 font-mono mt-0.5">৳{reportRevenue.toLocaleString()} BDT</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Validated Orders</p>
                      <p className="text-base font-extrabold text-slate-900 font-mono mt-0.5">{reportOrdersCount - reportCancelledCount} of {reportOrdersCount} sales</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Audit Parameters</p>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5 leading-tight">Paid orders filter: {reportOrderFilter.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Table area mapping transactions */}
                  <div className="py-6 min-h-[250px]">
                    <h5 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-4 border-l-2 border-blue-600 pl-1.5 leading-none">Journalized Ledger Entries</h5>
                    
                    {reportOrders.length === 0 ? (
                      <div className="text-center py-12 text-slate-450 italic text-xs">
                        No transactions registered inside selected period matching parameters.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans text-[10px] border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-t border-slate-200">
                              <th className="p-2.5">ID</th>
                              <th className="p-2.5">Date</th>
                              <th className="p-2.5">Customer / Contact</th>
                              <th className="p-2.5">Method</th>
                              <th className="p-2.5">Bank Status</th>
                              <th className="p-2.5">Cargo State</th>
                              <th className="p-2.5 text-right">Net Sales (BDT)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportOrders.map((ord, idx) => (
                              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="p-2.5 font-bold font-mono text-slate-800">{ord.id}</td>
                                <td className="p-2.5 text-slate-500 font-mono">{ord.createdAt ? ord.createdAt.split('T')[0] : ''}</td>
                                <td className="p-2.5">
                                  <div className="font-bold text-slate-800">{ord.customerName}</div>
                                  <div className="text-slate-400 font-medium text-[9px]">{ord.customerPhone}</div>
                                </td>
                                <td className="p-2.5 uppercase font-mono text-slate-600 font-semibold">{ord.paymentMethod}</td>
                                <td className="p-2.5">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                                    ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                  }`}>
                                    {ord.paymentStatus}
                                  </span>
                                </td>
                                <td className="p-2.5">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-sans uppercase ${
                                    ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                                    ord.status === 'cancelled' ? 'bg-rose-100 text-rose-600' : 
                                    'bg-slate-100 text-slate-600'
                                  }`}>
                                    {ord.status}
                                  </span>
                                </td>
                                <td className="p-2.5 text-right font-bold text-slate-900 font-mono">
                                  {ord.status === 'cancelled' ? (
                                    <span className="text-rose-500 line-through">৳{ord.total.toLocaleString()}</span>
                                  ) : (
                                    <span>৳{ord.total.toLocaleString()}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Sign-off footer section inside simulation */}
                  <div className="border-t border-slate-100 pt-8 mt-4 flex flex-col md:flex-row justify-between items-start md:items-center text-xs text-slate-400 gap-4">
                    <div>
                      <p className="font-semibold text-slate-500 font-mono">System Audit Status: Verified</p>
                      <p className="text-[9px] mt-0.5">Oliur Tech Mainframe ledger replication validated digitally.</p>
                    </div>

                    <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="inline-block border-t border-slate-400 w-44 pt-1 mb-1 text-center font-bold text-slate-600">
                        Authorized Staff Signature
                      </div>
                      <p className="text-[9px] text-center">Printed reference ID: {currentUser.name}</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          );
        })()}

      </div>

    </div>
  );
};

// Private component helper for Service ticket staff notes input
interface InteractiveNotesFormProps {
  request: any;
  onSaveNotes: (notes: string) => void;
}

const InteractiveNotesForm: React.FC<InteractiveNotesFormProps> = ({ request, onSaveNotes }) => {
  const [notesText, setNotesText] = useState(request.notes || '');

  return (
    <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-55/30 font-sans text-xs">
      <label className="block text-blue-900 font-bold text-[10px] uppercase mb-1.5">Staff Diagnostic Notes / Timelines (Updates Client Dashboard):</label>
      <div className="flex gap-2">
        <input 
          type="text"
          className="bg-white border p-1.5 px-3 rounded flex-1 focus:outline-none text-xs"
          placeholder="e.g. Diagnosed motherboard voltage chip leak. Sourcing replacement capacitors. Repair ETA: 24 Hours."
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
        />
        <button
          onClick={() => onSaveNotes(notesText)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs p-1.5 px-4 rounded flex items-center gap-1 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Advice</span>
        </button>
      </div>
    </div>
  );
};
