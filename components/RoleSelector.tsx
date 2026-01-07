import React from 'react';
import { UserRole } from '../types';
import { User, ShoppingBag, Bike } from 'lucide-react';

interface Props {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<Props> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button
          onClick={() => onRoleChange(UserRole.CUSTOMER)}
          className={`flex flex-col items-center space-y-1 ${currentRole === UserRole.CUSTOMER ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Customer</span>
        </button>
        <button
          onClick={() => onRoleChange(UserRole.SHOP_OWNER)}
          className={`flex flex-col items-center space-y-1 ${currentRole === UserRole.SHOP_OWNER ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-medium">Shop</span>
        </button>
        <button
          onClick={() => onRoleChange(UserRole.RIDER)}
          className={`flex flex-col items-center space-y-1 ${currentRole === UserRole.RIDER ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <Bike className="w-6 h-6" />
          <span className="text-[10px] font-medium">Rider</span>
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
