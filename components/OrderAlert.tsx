
import React, { useEffect } from 'react';
import { Bell, CheckCircle } from 'lucide-react';

interface Props {
  title: string;
  message: string;
  onAccept: () => void;
  onDismiss?: () => void;
}

const OrderAlert: React.FC<Props> = ({ title, message, onAccept, onDismiss }) => {
  
  useEffect(() => {
    // Play simulated notification sound
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // Octave jump
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
    
    // Cleanup
    return () => {
        oscillator.disconnect();
        gainNode.disconnect();
        audioCtx.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-bounce-slow border-4 border-white ring-4 ring-blue-500/50">
         <div className="bg-blue-600 p-6 flex justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
             <div className="bg-white p-4 rounded-full shadow-lg relative z-10">
                 <Bell className="w-8 h-8 text-blue-600 animate-swing" />
             </div>
         </div>
         <div className="p-6 text-center">
             <h2 className="text-xl font-black text-slate-900 mb-2">{title}</h2>
             <p className="text-slate-500 mb-6 font-medium">{message}</p>
             
             <div className="space-y-3">
                <button 
                   onClick={onAccept}
                   className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-transform active:scale-95 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                   <CheckCircle className="w-5 h-5" /> View Order
                </button>
                {onDismiss && (
                   <button 
                      onClick={onDismiss}
                      className="w-full py-3 bg-white text-slate-400 rounded-xl font-bold hover:text-slate-600 transition-colors"
                   >
                      Dismiss
                   </button>
                )}
             </div>
         </div>
      </div>
    </div>
  );
};

export default OrderAlert;
