
import React, { useState } from 'react';
import { Medicine, SafetyAdvice } from '../types';
import { X, ShoppingCart, Info, ShieldCheck, AlertTriangle, CheckCircle2, Factory, Thermometer, ChevronDown, ChevronUp, Share2, Star, ShoppingBag } from 'lucide-react';
import MedicineCard from './MedicineCard';

interface Props {
  medicine: Medicine;
  onClose: () => void;
  onAddToCart: (medicine: Medicine) => void;
  similarMedicines: Medicine[];
  onSelectSimilar: (medicine: Medicine) => void;
}

const MedicineDetailsModal: React.FC<Props> = ({ medicine, onClose, onAddToCart, similarMedicines, onSelectSimilar }) => {
  const discount = medicine.discount || 0;
  const discountedPrice = medicine.price - (medicine.price * discount / 100);
  
  const [activeAccordion, setActiveAccordion] = useState<string | null>('intro');

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const SafetyCard = ({ type, advice }: { type: keyof SafetyAdvice, advice?: string }) => {
    if (!advice) return null;
    
    const isSafe = advice.toLowerCase().includes('safe');
    const isCaution = advice.toLowerCase().includes('caution') || advice.toLowerCase().includes('consult');
    const isUnsafe = advice.toLowerCase().includes('unsafe');

    let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
    let icon = <Info className="w-5 h-5" />;
    
    if (isSafe) {
        colorClass = 'bg-green-50 text-green-700 border-green-100';
        icon = <CheckCircle2 className="w-5 h-5" />;
    } else if (isUnsafe) {
        colorClass = 'bg-red-50 text-red-700 border-red-100';
        icon = <AlertTriangle className="w-5 h-5" />;
    } else if (isCaution) {
        colorClass = 'bg-orange-50 text-orange-700 border-orange-100';
        icon = <AlertTriangle className="w-5 h-5" />;
    }

    return (
      <div className={`p-4 rounded-xl border flex gap-3 ${colorClass} transition-all`}>
        <div className="shrink-0 pt-0.5">{icon}</div>
        <div>
          <h4 className="font-bold text-sm capitalize mb-1">{type}</h4>
          <p className="text-xs font-medium leading-relaxed">{advice}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-4xl h-[90vh] md:h-[85vh] md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col relative animate-slide-up">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
           <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Details</span>
              <h2 className="text-lg font-black text-slate-800 line-clamp-1">{medicine.name}</h2>
           </div>
           <div className="flex gap-2">
             <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
             </button>
             <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                <X className="w-5 h-5" />
             </button>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 pb-20 md:pb-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8">
             
             {/* Left Column: Image & Basic Info */}
             <div className="md:col-span-5 bg-white p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-100">
                <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-6 border border-slate-100 group">
                   <img src={medicine.image} alt={medicine.name} className="w-full h-full object-contain mix-blend-multiply p-4 transition-transform duration-700 group-hover:scale-110" />
                   {discount > 0 && (
                      <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-200">
                         {discount}% OFF
                      </span>
                   )}
                   <button className="absolute bottom-4 right-4 bg-white/80 backdrop-blur p-2 rounded-lg shadow-sm text-slate-500 hover:text-blue-600">
                      <ShoppingBag className="w-5 h-5" />
                   </button>
                </div>
                
                <div className="space-y-4">
                   <div>
                      <h1 className="text-2xl font-black text-slate-900 leading-tight">{medicine.name}</h1>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">{medicine.packSize}</span>
                         <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">
                           4.5 <Star className="w-3 h-3 fill-current" />
                         </span>
                      </div>
                   </div>

                   <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                      <div>
                         <p className="text-xs text-slate-500 line-through font-medium">MRP ₹{medicine.price.toFixed(2)}</p>
                         <p className="text-3xl font-black text-slate-900">₹{discountedPrice.toFixed(2)}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Inclusive of all taxes</p>
                      </div>
                      <button 
                        onClick={() => onAddToCart(medicine)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                      >
                         Add to Cart
                      </button>
                   </div>

                   <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                      <div>
                         <p className="text-xs font-bold text-green-800 uppercase mb-0.5">Genuine Product</p>
                         <p className="text-[10px] text-green-700 leading-snug">Sourced directly from licensed manufacturers. 100% Authentic.</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Column: Detailed Info */}
             <div className="md:col-span-7 p-6 md:p-8 space-y-6">
                
                {/* Manufacturer & Salt */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-slate-400">
                         <Factory className="w-4 h-4" />
                         <span className="text-[10px] font-bold uppercase">Manufacturer</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{medicine.manufacturer || 'Generic'}</p>
                   </div>
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-slate-400">
                         <Thermometer className="w-4 h-4" />
                         <span className="text-[10px] font-bold uppercase">Salt Composition</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{medicine.composition || 'Not Specified'}</p>
                   </div>
                </div>

                {/* Safety Advice */}
                {medicine.safetyAdvice && (
                   <div className="space-y-3">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Safety Advice</h3>
                      <div className="grid grid-cols-1 gap-3">
                         <SafetyCard type="alcohol" advice={medicine.safetyAdvice.alcohol} />
                         <SafetyCard type="pregnancy" advice={medicine.safetyAdvice.pregnancy} />
                         <SafetyCard type="driving" advice={medicine.safetyAdvice.driving} />
                         <SafetyCard type="kidney" advice={medicine.safetyAdvice.kidney} />
                      </div>
                   </div>
                )}

                {/* Accordions */}
                <div className="space-y-2">
                   {/* Introduction */}
                   <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <button 
                         onClick={() => toggleAccordion('intro')}
                         className="w-full flex justify-between items-center p-4 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                         <span>Introduction</span>
                         {activeAccordion === 'intro' ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                      </button>
                      {activeAccordion === 'intro' && (
                         <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-2 animate-fade-in">
                            {medicine.introduction || medicine.longDescription || medicine.description}
                         </div>
                      )}
                   </div>

                   {/* Uses */}
                   <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <button 
                         onClick={() => toggleAccordion('uses')}
                         className="w-full flex justify-between items-center p-4 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                         <span>Uses of {medicine.name}</span>
                         {activeAccordion === 'uses' ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                      </button>
                      {activeAccordion === 'uses' && (
                         <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-2 animate-fade-in">
                            <ul className="list-disc pl-5 space-y-1">
                               {medicine.uses?.map((use, i) => <li key={i}>{use}</li>) || <li>General Health</li>}
                            </ul>
                         </div>
                      )}
                   </div>

                   {/* Side Effects */}
                   <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <button 
                         onClick={() => toggleAccordion('sideEffects')}
                         className="w-full flex justify-between items-center p-4 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                         <span>Side Effects</span>
                         {activeAccordion === 'sideEffects' ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                      </button>
                      {activeAccordion === 'sideEffects' && (
                         <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-2 animate-fade-in">
                            <p className="mb-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-100">
                               Most side effects do not require any medical attention and disappear as your body adjusts to the medicine. Consult your doctor if they persist or if you’re worried about them.
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                               {medicine.sideEffects?.map((effect, i) => <li key={i}>{effect}</li>) || <li>Nausea (rare)</li>}
                            </ul>
                         </div>
                      )}
                   </div>
                </div>

                {/* Storage Info */}
                {medicine.storage && (
                   <div className="bg-slate-100 rounded-xl p-4 text-xs font-medium text-slate-600">
                      <span className="font-bold uppercase text-slate-400 block mb-1">Storage</span>
                      {medicine.storage}
                   </div>
                )}
             </div>
          </div>

          {/* Similar Products Section */}
          {similarMedicines.length > 0 && (
             <div className="p-6 md:p-8 bg-slate-100 border-t border-slate-200">
                <h3 className="font-black text-slate-800 text-lg mb-4">Similar Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {similarMedicines.slice(0, 4).map(sim => (
                      <div key={sim.id} className="scale-90 origin-top-left">
                         <MedicineCard 
                            medicine={sim} 
                            onAdd={onAddToCart} 
                            onClick={onSelectSimilar}
                         />
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>

        {/* Mobile Sticky Footer */}
        <div className="md:hidden bg-white border-t border-slate-200 p-4 sticky bottom-0 z-30 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] flex gap-4">
           <div className="flex-1">
              <p className="text-xs text-slate-400 line-through">₹{medicine.price}</p>
              <p className="text-xl font-black text-slate-900">₹{discountedPrice}</p>
           </div>
           <button 
             onClick={() => { onAddToCart(medicine); onClose(); }}
             className="flex-[2] bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200"
           >
              Add to Cart
           </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailsModal;
