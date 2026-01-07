import React from 'react';
import { Medicine } from '../types';
import { Plus, Package, Info, ShoppingCart } from 'lucide-react';

interface Props {
  medicine: Medicine;
  onAdd: (medicine: Medicine) => void;
  onClick?: (medicine: Medicine) => void;
}

const MedicineCard: React.FC<Props> = ({ medicine, onAdd, onClick }) => {
  const discount = medicine.discount || 0;
  const discountedPrice = medicine.price - (medicine.price * discount / 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
      <div 
        className="h-48 shrink-0 bg-slate-100 dark:bg-slate-700 relative cursor-pointer overflow-hidden"
        onClick={() => onClick && onClick(medicine)}
      >
        <img 
          src={medicine.image} 
          alt={medicine.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <div className="bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-600 dark:text-slate-300 backdrop-blur-sm">
            {medicine.category}
          </div>
          {discount > 0 && (
            <div className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">
              {discount}% OFF
            </div>
          )}
        </div>
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
             <Info className="w-3 h-3" /> View Details
           </span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 
          className="font-semibold text-slate-800 dark:text-slate-100 leading-tight cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={() => onClick && onClick(medicine)}
        >
          {medicine.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
           <Package className="w-3 h-3 text-slate-400" />
           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{medicine.packSize}</p>
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 h-8 leading-relaxed mb-4">
          {medicine.description}
        </p>
        
        <div className="mt-auto">
            <div className="mb-2">
                <p className="text-[9px] text-slate-400 leading-tight">
                <span className="font-bold text-slate-500">Note:</span> Consult doctor before use.
                </p>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex flex-col">
                    {discount > 0 && (
                    <span className="text-[10px] text-slate-400 line-through">₹{medicine.price.toFixed(2)}</span>
                    )}
                    <span className="font-bold text-slate-900 dark:text-white">₹{discountedPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => {
                        e.stopPropagation();
                        onAdd(medicine);
                        }}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                        title="Quick Add to Cart"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd(medicine);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all shadow-sm shadow-blue-200 dark:shadow-none flex items-center gap-1 active:scale-95"
                    aria-label="Add to cart"
                    >
                    <Plus className="w-4 h-4" /> <span className="text-xs font-bold">Add</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;