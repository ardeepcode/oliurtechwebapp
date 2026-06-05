import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Heart, ShoppingCart, Zap, Percent } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, navigateTo } = useApp();

  const isFav = isInWishlist(product.id);
  
  // Calculate discount percentage
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Rating stars generator
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-slate-300" />);
      }
    }
    return stars;
  };

  const handleCardClick = () => {
    navigateTo(`/product/${product.id}`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    navigateTo('cart');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative flex flex-col h-full cursor-pointer font-sans"
    >
      {/* Badge container */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        {hasDiscount && (
          <span className="bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
            <Percent className="w-2.5 h-2.5" />
            <span>{discountPercent}% Off</span>
          </span>
        )}
        {product.stock <= 0 ? (
          <span className="bg-rose-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
            Out of Stock
          </span>
        ) : product.stock < 5 ? (
          <span className="bg-amber-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
            Only {product.stock} Left
          </span>
        ) : null}
      </div>

      {/* Wishlist toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full shadow-sm transition-all bg-white hover:bg-slate-50 cursor-pointer ${
          isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-400-500 hover:text-rose-500'
        }`}
        title="Add to Wishlist"
      >
        <Heart className="w-4 h-4" />
      </button>

      {/* Product Image */}
      <div className="w-full bg-slate-50 aspect-square overflow-hidden relative shrink-0">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=600'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Content info */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 leading-none">
          {product.brand} • {product.category}
        </span>
        
        <h3 className="text-slate-900 font-semibold text-xs leading-relaxed line-clamp-2 mb-2 group-hover:text-brand-secondary transition-colors">
          {product.name}
        </h3>

        {/* Ratings block */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-[10px] text-slate-400 font-medium font-sans">
            ({product.reviews?.length || 0})
          </span>
        </div>

        {/* Pricing Block */}
        <div className="mt-auto mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-slate-950 font-sans">
              ৳{product.price.toLocaleString()} BDT
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-slate-400 line-through font-sans">
                ৳{product.originalPrice.toLocaleString()} BDT
              </span>
            )}
          </div>
        </div>

        {/* Action button grids */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full text-center px-2 py-2 rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold border transition-all cursor-pointer ${
              product.stock <= 0 
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add Cart</span>
          </button>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className={`w-full text-center px-2 py-2 rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold text-white transition-all cursor-pointer ${
              product.stock <= 0
                ? 'bg-slate-300 cursor-allowed text-slate-500'
                : 'bg-gradient-to-r from-brand-secondary to-blue-700 hover:from-brand-secondary hover:to-blue-600 hover:shadow-md hover:shadow-blue-500/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};
