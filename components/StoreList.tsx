import React from 'react';
import { Store } from '../types';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { NEARBY_STORES } from '../constants';

interface Props {
  selectedStoreId: string | null;
  onSelect: (storeId: string | null) => void;
}

const StoreList: React.FC<Props> = ({ selectedStoreId, onSelect }) => {
  return (
    <div className="space-y-4">
      <div 
        onClick={() => onSelect(null)}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
          selectedStoreId === null 
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-slate-100 bg-white hover:border-emerald-200'
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="text-emerald-600">⚡</span> Auto-Assign (Fastest)
            </h4>
            <p className="text-xs text-slate-500 mt-1">We'll find the nearest store with stock</p>
          </div>
          {selectedStoreId === null && <CheckCircle className="w-5 h-5 text-emerald-600" />}
        </div>
      </div>

      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Nearby Pharmacies</h4>
      
      <div className="space-y-3">
        {NEARBY_STORES.map((store) => (
          <div 
            key={store.id}
            onClick={() => onSelect(store.id)}
            className={`flex gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
              selectedStoreId === store.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-100 bg-white hover:border-blue-200'
            }`}
          >
            <img src={store.image} alt={store.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-800 text-sm">{store.name}</h4>
                <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-700 border border-yellow-100">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {store.rating}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {store.address}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-1">{store.distance} km away</p>
            </div>
            {selectedStoreId === store.id && (
               <div className="flex items-center">
                 <CheckCircle className="w-5 h-5 text-blue-600" />
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;