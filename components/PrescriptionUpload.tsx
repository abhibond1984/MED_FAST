
import React, { useState } from 'react';
import { Upload, X, Check, FileText, Sparkles, Loader2, PlusCircle, AlertCircle } from 'lucide-react';
import { analyzePrescriptionImage } from '../services/geminiService';
import { MEDICINES } from '../constants';
import { Medicine } from '../types';

interface Props {
  onUpload: (imageUrl: string) => void;
  onAddToCart?: (medicine: Medicine) => void;
}

const PrescriptionUpload: React.FC<Props> = ({ onUpload, onAddToCart }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // AI State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    medicinesFound: string[];
    matchedProducts: Medicine[];
  } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      runAIAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const runAIAnalysis = async (base64: string) => {
    setAnalyzing(true);
    try {
      const result = await analyzePrescriptionImage(base64, MEDICINES);
      
      const matched = MEDICINES.filter(m => result.matchedProductIds.includes(m.id));
      
      setAnalysisResult({
        summary: result.summary,
        medicinesFound: result.medicinesFound,
        matchedProducts: matched
      });
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (preview) {
      setUploading(true);
      setProgress(0);
      
      // Simulate progress bar
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onUpload(preview);
            setUploading(false);
            setPreview(null);
            setAnalysisResult(null);
            setProgress(0);
          }, 300);
        }
      }, 150);
    }
  };

  const getDiscountedPrice = (item: Medicine) => {
      return item.price - (item.price * (item.discount || 0) / 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Quick Prescription Upload</h3>
          <p className="text-xs text-slate-500">We'll identify medicines automatically</p>
        </div>
      </div>
      
      {!preview ? (
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            accept="image/*"
          />
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
               <Upload className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-700">Click to upload or drag & drop</p>
            <p className="text-xs text-slate-500 mt-1">AI will scan for medicines instantly</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
             {/* Image Preview */}
             <div className="w-full md:w-1/3 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 max-h-48">
                <img src={preview} alt="Prescription preview" className="w-full h-full object-contain" />
                <button 
                  onClick={() => { setPreview(null); setAnalysisResult(null); }}
                  className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
             </div>

             {/* AI Analysis Result */}
             <div className="w-full md:w-2/3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                {analyzing ? (
                   <div className="h-full flex flex-col items-center justify-center text-purple-600 space-y-2 py-4">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-xs font-bold animate-pulse">AI is reading prescription...</span>
                   </div>
                ) : analysisResult ? (
                   <div className="space-y-3">
                      <div className="flex items-center gap-1 text-purple-700">
                         <Sparkles className="w-3 h-3" />
                         <span className="text-xs font-black uppercase tracking-wider">AI Analysis</span>
                      </div>
                      <p className="text-xs text-slate-600 italic border-l-2 border-purple-200 pl-2">
                        "{analysisResult.summary}"
                      </p>
                      
                      {/* Detected List */}
                      <div className="mt-2">
                         <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Medicines Demanded:</p>
                         <div className="flex flex-wrap gap-1">
                           {analysisResult.medicinesFound.map((name, i) => (
                             <span key={i} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-700">
                               {name}
                             </span>
                           ))}
                         </div>
                      </div>

                      {/* Stock Matching */}
                      <div className="mt-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Available in Stock:</p>
                        {analysisResult.matchedProducts.length > 0 ? (
                          <div className="space-y-1">
                            {analysisResult.matchedProducts.map(med => (
                               <div key={med.id} className="flex justify-between items-center bg-white p-2 rounded border border-green-100 shadow-sm">
                                  <div>
                                    <span className="text-xs font-bold text-slate-800 block">{med.name}</span>
                                    <div className="flex gap-2 text-[10px] font-medium">
                                       <span className="text-green-600">In Stock</span>
                                       <span className="text-slate-600">
                                          ₹{getDiscountedPrice(med).toFixed(2)}
                                          {med.discount ? <span className="text-red-500 ml-1">({med.discount}% off)</span> : ''}
                                       </span>
                                    </div>
                                  </div>
                                  {onAddToCart && (
                                    <button 
                                      onClick={() => onAddToCart(med)}
                                      className="text-white bg-blue-600 hover:bg-blue-700 p-1 rounded transition-colors"
                                      title="Add to Cart"
                                    >
                                      <PlusCircle className="w-4 h-4" />
                                    </button>
                                  )}
                               </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                            <AlertCircle className="w-4 h-4" />
                            <span>No exact matches in stock. Store will review manually.</span>
                          </div>
                        )}
                      </div>
                   </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-400 py-4">
                    Analysis failed or image unclear.
                  </div>
                )}
             </div>
          </div>

          {uploading ? (
             <div className="w-full space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                   <span>Uploading to Secure Server...</span>
                   <span>{progress}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                     style={{ width: `${progress}%` }}
                   ></div>
                </div>
             </div>
          ) : (
            <button 
                onClick={handleSubmit}
                disabled={uploading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                <Check className="w-4 h-4" /> Send Prescription to Store
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PrescriptionUpload;
