
import React from 'react';
import { Home, ShoppingCart, User, Search } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
}

const BottomNav: React.FC<Props> = ({ activeTab, onTabChange, cartCount }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 md:hidden flex justify-around items-center p-1">
      <button 
        onClick={() => onTabChange('home')}
        className={`p-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
      >
        <Home className="w-6 h-6" />
      </button>
      
      <button 
        onClick={() => onTabChange('search')}
        className={`p-3 rounded-xl transition-all ${activeTab === 'search' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
      >
        <Search className="w-6 h-6" />
      </button>

      <button 
        onClick={() => onTabChange('cart')}
        className={`p-3 rounded-xl transition-all relative ${activeTab === 'cart' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        )}
      </button>

      <button 
        onClick={() => onTabChange('profile')}
        className={`p-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
      >
        <User className="w-6 h-6" />
      </button>
    </div>
  );
};

export default BottomNav;
