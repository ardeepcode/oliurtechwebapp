import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Filter, X, RefreshCw } from 'lucide-react';
import { ProductCategory } from '../types';

export const Shop: React.FC = () => {
  const { products, queryParams, navigateTo } = useApp();

  // Search, sorting & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(120000);
  const [sortBy, setBy] = useState<string>('default');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state from Nav queries (e.g. from header query or category clicks)
  useEffect(() => {
    if (queryParams.category) {
      setSelectedCategory(queryParams.category);
    } else {
      setSelectedCategory('all');
    }

    if (queryParams.search) {
      setSearchTerm(queryParams.search);
    } else {
      setSearchTerm('');
    }
  }, [queryParams]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'desktop', name: 'Desktops & PCs' },
    { id: 'laptop', name: 'Laptops & Notebooks' },
    { id: 'monitor', name: 'Monitors & Screens' },
    { id: 'cctv', name: 'CCTV Surveillance' },
    { id: 'smartphone', name: 'Smartphones' },
    { id: 'accessories', name: 'Accessories' },
  ];

  // Derive unique brands in DB
  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand || 'Generic')))];

  // Clear filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMaxPrice(120000);
    setBy('default');
    navigateTo('shop'); // Clear hash query params
  };

  // Filter application pipeline
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesCategory = selectedCategory === 'all' ? true : p.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' ? true : p.brand === selectedBrand;
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default order based on index
  });

  return (
    <div className="w-full bg-slate-50 font-sans py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Page title path */}
        <div className="text-xs text-slate-400 mb-6 flex flex-wrap gap-1 items-center">
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigateTo('home')}>Oliur Tech</span>
          <span>/</span>
          <span className="text-slate-600 font-bold">Catalog Shop</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar FILTERS (Hidden on small screens, shown as drawer) */}
          <aside className="hidden lg:block w-3/4 max-w-[260px] shrink-0 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-500" />
                <span>Filters Board</span>
              </h3>
              <button 
                onClick={resetFilters}
                className="text-[10px] text-orange-500 hover:underline flex items-center gap-1 cursor-pointer font-semibold uppercase tracking-wider"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-slate-950 font-bold text-xs tracking-wide uppercase mb-3 text-slate-800">Categories</h4>
              <div className="flex flex-col gap-1 text-slate-500 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); navigateTo('shop', { category: cat.id }); }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.id 
                        ? 'bg-blue-50 font-bold text-blue-600' 
                        : 'hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Brands */}
            <div className="mb-6 border-t border-slate-100 pt-5">
              <h4 className="text-slate-950 font-bold text-xs tracking-wide uppercase mb-3 text-slate-800">Brands</h4>
              <div className="flex flex-col gap-1 text-slate-500 text-xs">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedBrand === brand 
                        ? 'bg-blue-50 font-bold text-blue-600' 
                        : 'hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {brand === 'all' ? 'All Brands' : brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Price */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-slate-950 font-bold text-xs tracking-wide uppercase mb-3 text-slate-800">Max Price (BDT)</h4>
              <input
                type="range"
                min="100"
                max="120000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2">
                <span>৳100</span>
                <span className="font-bold text-slate-800">৳{maxPrice.toLocaleString()} BDT</span>
              </div>
            </div>
          </aside>

          {/* Main Contents right area */}
          <div className="flex-1">
            
            {/* Action Bar */}
            <div className="bg-white rounded-2xl p-4 mb-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {/* Search input bar */}
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 text-slate-800 placeholder-slate-400 text-xs pl-3 pr-8 py-2 w-full rounded-lg border border-slate-100 focus:outline-none focus:border-blue-500"
                />
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              {/* Sorting & Filter controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                
                {/* Mobile Filter Button */}
                <button 
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden bg-slate-50 p-2.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer flex items-center gap-2 text-xs font-semibold"
                >
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setBy(e.target.value)}
                    className="bg-slate-50 font-semibold text-xs border border-transparent hover:border-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-none"
                  >
                    <option value="default">Release Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Popular Rating</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Products catalog list state display */}
            <div>
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm">
                  <SlidersHorizontal className="w-8 h-8 text-slate-350 mx-auto mb-4" />
                  <p className="text-slate-800 font-bold text-sm mb-2">No matching products found</p>
                  <p className="text-slate-400 text-xs">Try adjusting keywords, categories or maximum prices.</p>
                  <button 
                    onClick={resetFilters}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-lg mt-4 cursor-pointer"
                  >
                    Reset Selected Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* MOBILE DRAWER FILTERS PANEL */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/40 flex justify-end">
          <div className="bg-white w-3/4 max-w-sm h-full p-6 overflow-y-auto animate-in slide-in-from-right duration-200 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-500" />
                  <span>Sidebar Filters</span>
                </h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 cursor-pointer">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Category</p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); navigateTo('shop', { category: cat.id }); }}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedCategory === cat.id 
                          ? 'bg-blue-600 border-blue-600 text-white font-semibold' 
                          : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6 border-t border-slate-100 pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Brand</p>
                <div className="flex flex-wrap gap-1.5">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedBrand === brand 
                          ? 'bg-blue-600 border-blue-600 text-white font-semibold' 
                          : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}
                    >
                      {brand === 'all' ? 'All Brands' : brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prices */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Max Price</p>
                <input
                  type="range"
                  min="100"
                  max="120000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2">
                  <span>৳100</span>
                  <span className="font-bold text-slate-800">৳{maxPrice.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-8 pt-4 border-t border-slate-100">
              <button 
                onClick={resetFilters} 
                className="bg-slate-100 py-2.5 rounded-lg text-slate-600 text-xs font-bold transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <button 
                onClick={() => setMobileFiltersOpen(false)} 
                className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
