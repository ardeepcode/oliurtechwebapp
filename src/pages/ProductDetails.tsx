import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Review } from '../types';
import { Star, Heart, ShoppingCart, Zap, ShieldCheck, Truck, RotateCcw, AlertTriangle, Cpu, Tag, Check, Send } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails: React.FC = () => {
  const { productDetailId, products, addToCart, toggleWishlist, isInWishlist, navigateTo, refreshProducts } = useApp();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

  // Review Form States
  const [reviewerName, setReviewerName] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Find product by id from global list or fetch.
  // Using active products list in context ensures it synchronizes instantly.
  useEffect(() => {
    if (productDetailId) {
      const match = products.find(p => p.id === productDetailId);
      if (match) {
        setProduct(match);
        setActiveImage(match.images[0]);
      }
    }
  }, [productDetailId, products]);

  if (!product) {
    return (
      <div className="w-full bg-slate-50 font-sans py-16 text-center">
        <h2 className="text-sm font-bold text-slate-800">Synchronizing product data...</h2>
        <button 
          onClick={() => navigateTo('shop')}
          className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg mt-4 cursor-pointer"
        >
          Back To Catalog
        </button>
      </div>
    );
  }

  const isFav = isInWishlist(product.id);
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  // Filter Related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleQtyChange = (qty: number) => {
    if (qty > 0 && qty <= product.stock) {
      setQuantity(qty);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigateTo('cart');
  };

  // Submit actual user review straight to backend API!
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');

    if (!reviewerName) {
      setReviewError('Please enter your full name');
      return;
    }
    if (!reviewComment) {
      setReviewError('Please share your thoughts or critique comments');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewerName,
          rating: ratingInput,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        // Clear forms
        setReviewerName('');
        setReviewComment('');
        setRatingInput(5);
        // Refresh products list in context to update rating
        await refreshProducts();
        alert("Review uploaded successfully! Thank you.");
      } else {
        const data = await res.json();
        setReviewError(data.message || 'Error occurred while saving review');
      }
    } catch (err) {
      setReviewError('Failed to publish review. Check server connection.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (ratingNum: number) => {
    const stars = [];
    const floorRating = Math.floor(ratingNum);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-slate-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="w-full bg-slate-50 font-sans py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Navigation Map Paths */}
        <div className="text-xs text-slate-400 mb-6 flex flex-wrap gap-1 items-center">
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigateTo('home')}>Oliur Tech</span>
          <span>/</span>
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigateTo('shop', { category: product.category })}>{product.category}</span>
          <span>/</span>
          <span className="text-slate-600 font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product Details Section A */}
        <section className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
          
          {/* Column 1: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl aspect-square overflow-hidden relative">
              <img
                src={activeImage || 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=600'}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-orange-500 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 mt-1">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 bg-slate-50 transition-colors ${
                      activeImage === img ? 'border-blue-600' : 'border-slate-100 hover:border-slate-350'
                    }`}
                  >
                    <img src={img} alt="Thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Specific product attributes & Checkout logic */}
          <div className="flex flex-col">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-1 flex items-center gap-1.5 font-sans">
              <Tag className="w-3.5 h-3.5 text-blue-500" />
              <span>{product.brand} Store Official</span>
            </span>

            <h1 className="text-lg md:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight mb-2">
              {product.name}
            </h1>

            {/* Reviews summary */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-xs font-bold text-slate-800 font-sans">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviews?.length || 0} reviews)</span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed mb-6 font-sans">
              {product.description}
            </p>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
              <div className="flex items-baseline gap-2.5 mb-2">
                <span className="text-xl md:text-2.5xl font-extrabold text-slate-950 font-sans">
                  ৳{product.price.toLocaleString()} BDT
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through font-sans">
                    ৳{product.originalPrice.toLocaleString()} BDT
                  </span>
                )}
              </div>
              <div className="text-[11px] font-sans flex items-center gap-1.5 text-slate-500 mt-1">
                <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
                <span>Price matches official cash sales in Bangladesh stores</span>
              </div>
            </div>

            {/* User operational features */}
            {product.stock > 0 ? (
              <div className="flex flex-col gap-4 mb-6">
                {/* Quantity select */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-bold font-sans">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <button 
                      onClick={() => handleQtyChange(quantity - 1)}
                      className="px-3 py-1.5 text-xs text-slate-500 font-sans hover:bg-slate-50 border-r border-slate-200"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs text-slate-800 font-bold font-sans">{quantity}</span>
                    <button 
                      onClick={() => handleQtyChange(quantity + 1)}
                      className="px-3 py-1.5 text-xs text-slate-500 font-sans hover:bg-slate-50 border-l border-slate-200"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">({product.stock} items remaining)</span>
                </div>

                {/* Main operational actions */}
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-slate-950/5"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-blue-500/15"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy Now</span>
                  </button>

                  <button 
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-xl border border-slate-200 transition-colors cursor-pointer hover:bg-slate-50 ${
                      isFav ? 'text-rose-500 border-rose-500 fill-rose-500/20' : 'text-slate-400'
                    }`}
                  >
                    <Heart className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl p-4 flex items-center gap-2 mb-6">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                <span className="text-xs font-bold font-sans">Out of Stock. Please request stock updates via service desk.</span>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 border-t border-slate-100 pt-5 gap-3 text-center text-slate-500">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-blue-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-800 leading-tight block">Official Quality</span>
                <span className="text-[9px] text-slate-400 leading-tight">Authentic Brand Components</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-800 leading-tight block">Safe Courier</span>
                <span className="text-[9px] text-slate-400 leading-tight">Dhaka Home Delivery ৳100</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="text-[10px] font-bold text-slate-800 leading-tight block">7 Days Warranty</span>
                <span className="text-[9px] text-slate-400 leading-tight">Product Return Guarantee</span>
              </div>
            </div>

          </div>
        </section>

        {/* Tab blocks: Product Specifications vs Customer Reviews */}
        <section className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm mb-12">
          
          {/* Tab heads */}
          <div className="flex border-b border-slate-100 mb-6 gap-6 font-sans">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'specs' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Specifications List
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'reviews' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Customer Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          {/* Specifications Table Panel */}
          {activeTab === 'specs' && (
            <div className="overflow-x-auto">
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                        <td className="p-3.5 font-bold text-slate-600 border-b border-slate-100 w-1/3">{key}</td>
                        <td className="p-3.5 text-slate-800 border-b border-slate-100 font-medium">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-slate-400">Specifications details will be populated.</p>
              )}
            </div>
          )}

          {/* Reviews Panel */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* List reviews */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, index) => (
                    <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-100 font-sans">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-none mb-1">{rev.name}</h4>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex">{renderStars(rev.rating)}</div>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal italic">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs">No feedback reviews posted yet for this product.</p>
                    <p className="text-[10px] mt-1 text-slate-400">Be the first to share your experience with other clients!</p>
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 h-fit">
                <h3 className="text-slate-900 font-bold text-xs tracking-wide uppercase mb-4">Post Your Feedback</h3>
                
                <form onSubmit={handleSubmitReview} className="flex flex-col gap-3 text-xs">
                  {reviewError && (
                    <div className="bg-rose-50 text-rose-500 p-2.5 rounded border border-rose-100 text-[11px] font-bold">
                      {reviewError}
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Your Full Name:</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-250 p-2 text-xs rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Tariqul Islam"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Select Rating Star:</label>
                    <select
                      className="w-full bg-white border border-slate-250 p-2 text-xs rounded-lg focus:outline-none"
                      value={ratingInput}
                      onChange={(e) => setRatingInput(Number(e.target.value))}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ Great (4 Stars)</option>
                      <option value="3">⭐⭐⭐ Neutral (3 Stars)</option>
                      <option value="2">⭐⭐ Poor (2 Stars)</option>
                      <option value="1">⭐ Awful (1 Star)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Critique Comment:</label>
                    <textarea
                      rows={3}
                      className="w-full bg-white border border-slate-250 p-2 text-xs rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Share your authentic experience with product assembly, packaging and performance..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs border border-transparent shadow hover:shadow-blue-500/10 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </section>

        {/* Related products Section */}
        {relatedProducts.length > 0 && (
          <section className="mb-8">
            <div className="border-b border-slate-200 pb-3 mb-6">
              <h2 className="text-slate-900 font-extrabold text-lg tracking-tight">Related Catalog Products</h2>
              <p className="text-slate-400 text-xs mt-1">Explore other products in the {product.category} sector</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
