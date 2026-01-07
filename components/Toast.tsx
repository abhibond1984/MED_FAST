
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface Props {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<Props> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] animate-slide-down">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl border ${
        type === 'success' 
          ? 'bg-slate-900 text-white border-slate-700' 
          : 'bg-red-500 text-white border-red-600'
      }`}>
        {type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-white" />}
        <span className="text-sm font-semibold">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
