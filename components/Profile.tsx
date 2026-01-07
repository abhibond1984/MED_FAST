
import React, { useState } from 'react';
import { UserProfile, UserRole, FamilyMember } from '../types';
import { LogOut, MapPin, Phone, Mail, FileText, Activity, Store as StoreIcon, ShoppingBag, Calendar, Trophy, Repeat, Edit3, ArrowRight, ChevronRight, Users, PlusCircle, User, CheckCircle2 } from 'lucide-react';
import { MEDICINES } from '../constants';

interface Props {
  user: UserProfile;
  onLogout: () => void;
  onClose: () => void;
  onReorder: (items: any[]) => void;
}

const Profile: React.FC<Props> = ({ user, onLogout, onClose, onReorder }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'orders' | 'family'>('details');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(user.familyMembers || []);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(user.familyMembers?.[0]?.id || 'fam-1');
  const [showAddMember, setShowAddMember] = useState(false);
  
  // New Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberAddress, setNewMemberAddress] = useState('');
  const [useMainAddress, setUseMainAddress] = useState(true);

  // Simulated order history linked to real medicines for the Reorder feature
  const MockOrders = [
    { 
      id: 'ORD-101', 
      date: 'Today, 10:30 AM', 
      total: 185.50, 
      status: 'Delivered',
      items: [{ ...MEDICINES[0], quantity: 2 }, { ...MEDICINES[1], quantity: 1 }] 
    },
    { 
      id: 'ORD-99', 
      date: 'Yesterday', 
      total: 450.00, 
      status: 'Delivered',
      items: [{ ...MEDICINES[3], quantity: 10 }]
    },
    { 
      id: 'ORD-84', 
      date: '21 Aug 2024', 
      total: 120.00, 
      status: 'Cancelled',
      items: [{ ...MEDICINES[2], quantity: 1 }]
    },
  ];

  const handleAddMember = () => {
    if (!newMemberName || !newMemberRelation) return;
    
    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: newMemberName,
      relation: newMemberRelation,
      useMainAddress: useMainAddress,
      address: useMainAddress ? undefined : newMemberAddress,
      prescriptions: []
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setShowAddMember(false);
    setNewMemberName('');
    setNewMemberRelation('');
    setNewMemberAddress('');
  };

  const getSelectedMember = () => familyMembers.find(m => m.id === selectedMemberId);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl overflow-hidden flex flex-col transition-colors animate-slide-in-right">
        
        {/* Header Section */}
        <div className="relative shrink-0">
          <div className="h-40 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white backdrop-blur-md transition-colors"
            >
              <ArrowRight className="w-5 h-5 transform rotate-180" />
            </button>
          </div>
          
          <div className="px-6 -mt-12 flex justify-between items-end relative z-10">
            <div className="p-1.5 bg-white dark:bg-slate-900 rounded-full shadow-lg">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800"
              />
            </div>
            {user.role === UserRole.CUSTOMER && (
               <div className="mb-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                  <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase leading-none opacity-70">Points</p>
                    <p className="text-sm font-black leading-none">{user.healthPoints || 0}</p>
                  </div>
               </div>
            )}
          </div>
          
          <div className="px-6 pt-3 pb-6 text-left">
             <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{user.name}</h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {user.email}
                  </p>
                </div>
                <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                   <Edit3 className="w-4 h-4" />
                </button>
             </div>
             <div className="mt-3 flex gap-2">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {user.role.replace('_', ' ')}
                </span>
             </div>
          </div>
        </div>

        {/* Tab Navigation */}
        {user.role === UserRole.CUSTOMER && (
          <div className="px-6 border-b border-slate-100 dark:border-slate-800 shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-6 whitespace-nowrap">
              <button 
                onClick={() => setActiveTab('details')}
                className={`py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'details' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                My Details
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'orders' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                Orders & Transactions
              </button>
              <button 
                onClick={() => setActiveTab('family')}
                className={`py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'family' 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                Family & Prescriptions
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-6 transition-colors">
          
          {/* MY DETAILS TAB */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                 <div className="space-y-4">
                    {user.phone && (
                      <div className="flex items-start gap-4">
                         <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                           <Phone className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Phone Number</p>
                           <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.phone}</p>
                         </div>
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-start gap-4">
                         <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                           <MapPin className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Delivery Address</p>
                           <p className="text-sm font-semibold text-slate-800 dark:text-white leading-relaxed">{user.address}</p>
                         </div>
                      </div>
                    )}
                 </div>
              </div>

              {/* Shop Owner Details (if applicable) */}
              {user.role === UserRole.SHOP_OWNER && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store Information</h3>
                      <StoreIcon className="w-4 h-4 text-blue-500" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between border-b border-slate-50 dark:border-slate-700 pb-2">
                         <span className="text-sm text-slate-500 dark:text-slate-400">Store Name</span>
                         <span className="text-sm font-bold text-slate-800 dark:text-white">{user.storeName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 dark:border-slate-700 pb-2">
                         <span className="text-sm text-slate-500 dark:text-slate-400">License</span>
                         <span className="text-sm font-mono text-slate-800 dark:text-white">{user.licenseNumber}</span>
                      </div>
                   </div>
                </div>
              )}

              <button onClick={onLogout} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          )}

          {/* ORDERS HISTORY TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Recent Transactions</h3>
              {MockOrders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-xl ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                         <ShoppingBag className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-900 dark:text-white">{order.status}</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                           <Calendar className="w-3 h-3" /> {order.date}
                         </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-slate-900 dark:text-white">₹{order.total.toFixed(0)}</p>
                       <p className="text-[10px] text-slate-400 font-mono">{order.id}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 mb-4">
                     <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                             <div className="flex items-center gap-2">
                                <span className="bg-white dark:bg-slate-800 w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold text-slate-500 border border-slate-200">
                                  {item.quantity}x
                                </span>
                                <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">{item.name}</span>
                             </div>
                             <span className="text-slate-500 dark:text-slate-400">₹{(item.price * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  {order.status === 'Delivered' && (
                     <button 
                       onClick={() => { onReorder(order.items); onClose(); }}
                       className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                     >
                        <Repeat className="w-3.5 h-3.5" /> Reorder Again
                     </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* FAMILY TAB */}
          {activeTab === 'family' && (
            <div className="animate-fade-in">
              {/* Member Selector */}
              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                 {familyMembers.map(member => (
                   <button
                     key={member.id}
                     onClick={() => setSelectedMemberId(member.id)}
                     className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl border transition-all ${
                       selectedMemberId === member.id 
                         ? 'bg-blue-50 border-blue-500 shadow-md' 
                         : 'bg-white border-slate-200 hover:border-blue-300'
                     }`}
                   >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        selectedMemberId === member.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                         {member.name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{member.relation}</span>
                   </button>
                 ))}
                 <button 
                    onClick={() => setShowAddMember(true)}
                    className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl border border-dashed border-slate-300 hover:bg-slate-50"
                 >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                       <PlusCircle className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-500">Add New</span>
                 </button>
              </div>

              {/* Add Member Form */}
              {showAddMember && (
                <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-slide-down">
                   <h3 className="text-sm font-bold text-slate-800 mb-3">Add Family Member</h3>
                   <div className="space-y-3">
                      <input 
                         type="text" 
                         placeholder="Name (e.g. Papa)" 
                         value={newMemberName}
                         onChange={e => setNewMemberName(e.target.value)}
                         className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                      />
                      <input 
                         type="text" 
                         placeholder="Relation (e.g. Father)" 
                         value={newMemberRelation}
                         onChange={e => setNewMemberRelation(e.target.value)}
                         className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                      />
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer" onClick={() => setUseMainAddress(!useMainAddress)}>
                         <div className={`w-4 h-4 rounded border flex items-center justify-center ${useMainAddress ? 'bg-blue-500 border-blue-500' : 'border-slate-400'}`}>
                            {useMainAddress && <CheckCircle2 className="w-3 h-3 text-white" />}
                         </div>
                         Use my default address
                      </div>
                      {!useMainAddress && (
                        <input 
                           type="text" 
                           placeholder="Enter separate address..." 
                           value={newMemberAddress}
                           onChange={e => setNewMemberAddress(e.target.value)}
                           className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                        />
                      )}
                      <div className="flex gap-2">
                         <button onClick={() => setShowAddMember(false)} className="flex-1 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold">Cancel</button>
                         <button onClick={handleAddMember} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Save Profile</button>
                      </div>
                   </div>
                </div>
              )}

              {/* Selected Member Details */}
              {getSelectedMember() && (
                <div className="space-y-4">
                   <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div className="flex items-start gap-3 mb-3">
                         <User className="w-5 h-5 text-blue-500" />
                         <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">{getSelectedMember()?.name}</h4>
                            <p className="text-xs text-slate-500">{getSelectedMember()?.relation} {getSelectedMember()?.age ? `• ${getSelectedMember()?.age} Years` : ''}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                         <MapPin className="w-4 h-4 shrink-0" />
                         <p>{getSelectedMember()?.useMainAddress ? user.address : getSelectedMember()?.address}</p>
                      </div>
                   </div>

                   <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Prescriptions</h3>
                   
                   {getSelectedMember()?.prescriptions && getSelectedMember()!.prescriptions!.length > 0 ? (
                      <div className="space-y-3">
                         {getSelectedMember()!.prescriptions!.map(pres => (
                            <div key={pres.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex gap-3">
                               <img src={pres.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-slate-200" alt="Prescription" />
                               <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pres.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {pres.status}
                                     </span>
                                     <span className="text-[10px] text-slate-400">{new Date(pres.uploadedAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">{pres.diagnosis || 'General Prescription'}</p>
                                  <button className="text-[10px] text-blue-600 font-bold mt-2 hover:underline">View Medicines</button>
                               </div>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                         <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                         <p className="text-sm text-slate-400 font-medium">No prescriptions saved yet.</p>
                      </div>
                   )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
