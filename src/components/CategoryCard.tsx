import React from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Laptop, Monitor, Camera, Smartphone, HardDrive } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryCardProps {
  categoryId: ProductCategory;
  name: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ categoryId, name }) => {
  const { navigateTo, products } = useApp();

  const count = products.filter(p => p.category === categoryId).length;

  const getIcon = () => {
    switch (categoryId) {
      case 'desktop': return <Cpu className="w-6 h-6" />;
      case 'laptop': return <Laptop className="w-6 h-6" />;
      case 'monitor': return <Monitor className="w-6 h-6" />;
      case 'cctv': return <Camera className="w-6 h-6" />;
      case 'smartphone': return <Smartphone className="w-6 h-6" />;
      case 'accessories': return <HardDrive className="w-6 h-6" />;
    }
  };

  const getColor = () => {
    switch (categoryId) {
      case 'desktop': return 'from-blue-500 to-indigo-600 shadow-blue-500/10 text-blue-500';
      case 'laptop': return 'from-purple-500 to-indigo-500 shadow-purple-500/10 text-indigo-500';
      case 'monitor': return 'from-cyan-500 to-blue-500 shadow-cyan-500/10 text-cyan-600';
      case 'cctv': return 'from-orange-500 to-red-500 shadow-orange-500/10 text-orange-500';
      case 'smartphone': return 'from-emerald-500 to-teal-500 shadow-teal-500/10 text-emerald-500';
      case 'accessories': return 'from-amber-500 to-orange-400 shadow-amber-500/10 text-amber-500';
    }
  };

  const handleClick = () => {
    navigateTo('shop', { category: categoryId });
  };

  return (
    <div 
      onClick={handleClick} 
      className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 select-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 cursor-pointer"
    >
      <div className={`p-4 rounded-xl bg-slate-50 group-hover:bg-slate-100 group-hover:scale-105 transition-all ${getColor()}`}>
        {getIcon()}
      </div>
      <div>
        <h4 className="text-slate-900 font-bold text-sm tracking-tight group-hover:text-blue-600 transition-colors">
          {name}
        </h4>
        <span className="text-[11px] text-slate-400 font-medium font-mono">
          {count} {count === 1 ? 'Product' : 'Products'}
        </span>
      </div>
    </div>
  );
};
