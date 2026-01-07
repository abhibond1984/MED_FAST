import React, { useState } from 'react';
import { CreditCard, Smartphone, Banknote, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  amount: number;
  onPaymentComplete: (method: string) => void;
  onCancel: () => void;
}

const PaymentGateway: React.FC<Props> = ({ amount, onPaymentComplete, onCancel }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('UPI');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      onPaymentComplete(selectedMethod);
    }, 2000);
  };

  if (processing) {
    return (
      <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full border border-slate-100">
           <div className="relative">
             <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
             <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative z-10" />
           </div>
           <h3 className="mt-6 text-xl font-bold text-slate-800">Processing Payment</h3>
           <p className="text-slate-500 text-sm mt-2">Securely connecting to {selectedMethod}...</p>
           <p className="text-2xl font-black text-slate-900 mt-4">₹{amount.toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Payment Gateway</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3" /> 256-bit Secure SSL
            </p>
          </div>
          <div className="text-right">
            <span className="block text-xs text-slate-400">Total Payable</span>
            <span className="block text-xl font-bold">₹{amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Select Payment Method</h3>
          
          <div className="space-y-3">
            {/* UPI */}
            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedMethod === 'UPI' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>
              <input type="radio" name="payment" className="hidden" checked={selectedMethod === 'UPI'} onChange={() => setSelectedMethod('UPI')} />
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 mr-4">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">UPI</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] bg-white border border-slate-200 px-1 rounded text-slate-500">GPay</span>
                  <span className="text-[10px] bg-white border border-slate-200 px-1 rounded text-slate-500">PhonePe</span>
                  <span className="text-[10px] bg-white border border-slate-200 px-1 rounded text-slate-500">Paytm</span>
                </div>
              </div>
              {selectedMethod === 'UPI' && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
            </label>

            {/* Card */}
            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedMethod === 'CARD' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>
              <input type="radio" name="payment" className="hidden" checked={selectedMethod === 'CARD'} onChange={() => setSelectedMethod('CARD')} />
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 mr-4">
                <CreditCard className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">Credit / Debit Card</p>
                <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
              </div>
              {selectedMethod === 'CARD' && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
            </label>

            {/* COD */}
            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>
              <input type="radio" name="payment" className="hidden" checked={selectedMethod === 'COD'} onChange={() => setSelectedMethod('COD')} />
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 mr-4">
                <Banknote className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">Cash on Delivery</p>
                <p className="text-xs text-slate-500">Pay cash upon arrival</p>
              </div>
              {selectedMethod === 'COD' && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
            </label>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handlePay}
            className="flex-2 w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Pay ₹{amount.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;