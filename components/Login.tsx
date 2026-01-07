
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { MOCK_USERS } from '../constants';
import { Smartphone, Mail, Chrome, Facebook, ArrowRight, Lock, CheckCircle, ArrowLeft, Bike } from 'lucide-react';
import Register from './Register';
import BrandLogo from './BrandLogo';

interface Props {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT'>('LOGIN');
  const [method, setMethod] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [inputValue, setInputValue] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Quick Demo Login Handlers
  const handleQuickLogin = (role: UserRole) => {
    onLogin(MOCK_USERS[role]);
  };

  const handleRegister = (newUser: UserProfile) => {
    onLogin(newUser);
  };

  const handleResetPassword = () => {
    if (!inputValue) return;
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
        setResetSent(true);
        setLoading(false);
    }, 1500);
  };

  if (showRegister) {
    return <Register onRegister={handleRegister} onCancel={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-[500px] h-[500px] bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="text-center mb-10 relative z-10">
        <div className="flex flex-col items-center justify-center gap-6 mb-4">
           
           <BrandLogo size="xl" animated />
           
           <div className="text-center">
             <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-none drop-shadow-sm">
               MED<span className="text-cyan-500">.</span>FAST
             </h1>
             <div className="flex items-center justify-center gap-2 mt-3">
                <Bike className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-bold text-slate-500 tracking-[0.3em] uppercase">Health Express</p>
             </div>
           </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl w-full max-w-md border border-white/80 relative z-10 transition-all duration-500 hover:shadow-blue-200/50">
        
        {mode === 'FORGOT' ? (
           <div className="animate-fade-in">
              <div className="text-center mb-6">
                 <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm border border-blue-100">
                    <Lock className="w-8 h-8" />
                 </div>
                 <h2 className="text-2xl font-black text-slate-800">Reset Password</h2>
                 <p className="text-sm text-slate-500 mt-1 font-medium">Enter your email to receive a secure link.</p>
              </div>

              {!resetSent ? (
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-xs font-bold text-slate-500 mb-2 ml-4 uppercase tracking-wide">Email Address</label>
                    <input 
                      type="email"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <button 
                    onClick={handleResetPassword} 
                    disabled={loading || !inputValue}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    {loading ? 'Sending Link...' : 'Send Reset Link'} {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-100 p-6 rounded-3xl text-center animate-slide-up shadow-sm">
                   <div className="flex justify-center mb-4">
                      <div className="bg-green-100 p-4 rounded-full">
                         <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                   </div>
                   <h3 className="font-bold text-green-800 text-lg">Check your inbox! 📬</h3>
                   <p className="text-sm text-green-600 mt-2 leading-relaxed font-medium">
                      We've sent a magic link to<br/>
                      <span className="font-black text-green-700">{inputValue}</span>
                   </p>
                   <p className="text-xs text-green-500 mt-4 font-bold">Didn't get it? <button onClick={() => setResetSent(false)} className="underline hover:text-green-700">Resend</button></p>
                </div>
              )}

              <button 
                onClick={() => { setMode('LOGIN'); setResetSent(false); setInputValue(''); }}
                className="w-full mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
           </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex mb-8 bg-slate-100 p-1.5 rounded-3xl">
              <button 
                onClick={() => setMode('LOGIN')}
                className={`flex-1 py-3 text-sm font-black uppercase tracking-wide rounded-2xl transition-all duration-300 ${mode === 'LOGIN' ? 'bg-white shadow-lg text-slate-900 scale-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setMode('SIGNUP')}
                className={`flex-1 py-3 text-sm font-black uppercase tracking-wide rounded-2xl transition-all duration-300 ${mode === 'SIGNUP' ? 'bg-white shadow-lg text-slate-900 scale-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sign Up
              </button>
            </div>

            {/* Input Method Switcher */}
            <div className="flex gap-4 mb-6">
              <button onClick={() => setMethod('PHONE')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 text-xs font-bold transition-all ${method === 'PHONE' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500 hover:border-slate-200 bg-white'}`}>
                  <Smartphone className="w-4 h-4" /> Phone
              </button>
              <button onClick={() => setMethod('EMAIL')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 text-xs font-bold transition-all ${method === 'EMAIL' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500 hover:border-slate-200 bg-white'}`}>
                  <Mail className="w-4 h-4" /> Email
              </button>
            </div>

            {/* Form Inputs */}
            <div className="space-y-5 mb-8">
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 mb-2 ml-4 uppercase tracking-wide transition-colors group-focus-within:text-blue-600">
                    {method === 'PHONE' ? 'Mobile Number' : 'Email Address'}
                </label>
                <input 
                  type={method === 'PHONE' ? 'tel' : 'email'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={method === 'PHONE' ? '+91 98765 43210' : 'name@example.com'}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-slate-300 text-slate-700"
                />
              </div>

              {mode === 'LOGIN' && (
                <div className="flex justify-end pr-2">
                   <button 
                     onClick={() => { setMode('FORGOT'); setInputValue(''); }}
                     className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
                   >
                     Forgot Password?
                   </button>
                </div>
              )}

              {mode === 'LOGIN' && (
                <button onClick={() => handleQuickLogin(UserRole.CUSTOMER)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-300 hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-2 group active:scale-95">
                  Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              {mode === 'SIGNUP' && (
                <button onClick={() => setShowRegister(true)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-blue-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95">
                  Create Account
                </button>
              )}
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/50 backdrop-blur px-3 text-slate-400 font-bold tracking-wider">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center gap-2 p-4 border-2 border-slate-100 rounded-2xl hover:bg-white hover:border-slate-300 transition-all font-bold text-slate-600 text-sm bg-white/50">
                <Chrome className="w-5 h-5 text-red-500" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 p-4 border-2 border-slate-100 rounded-2xl hover:bg-white hover:border-slate-300 transition-all font-bold text-slate-600 text-sm bg-white/50">
                <Facebook className="w-5 h-5 text-blue-600" /> Facebook
              </button>
            </div>

            {/* Demo Quick Links */}
            <div className="text-center bg-white/50 rounded-3xl p-5 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Instant Demo Access</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <button onClick={() => handleQuickLogin(UserRole.SHOP_OWNER)} className="px-5 py-2.5 bg-white text-blue-600 rounded-xl text-xs font-bold border-2 border-blue-50 hover:border-blue-200 transition-colors shadow-sm">Shop Owner</button>
                <button onClick={() => handleQuickLogin(UserRole.RIDER)} className="px-5 py-2.5 bg-white text-orange-600 rounded-xl text-xs font-bold border-2 border-orange-50 hover:border-orange-200 transition-colors shadow-sm">Rider</button>
                <button onClick={() => handleQuickLogin(UserRole.ADMIN)} className="px-5 py-2.5 bg-white text-slate-600 rounded-xl text-xs font-bold border-2 border-slate-100 hover:border-slate-300 transition-colors shadow-sm">Admin</button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <p className="mt-8 text-xs text-slate-400 font-bold tracking-wide uppercase opacity-70">
        &copy; {new Date().getFullYear()} Med-Fast Technologies Inc.
      </p>
    </div>
  );
};

export default Login;
