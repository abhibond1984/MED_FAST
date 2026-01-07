
import React, { useState } from 'react';
import { UserProfile, UserRole, ApprovalStatus, AppFeatures, Doctor } from '../types';
import { MOCK_USERS, DOCTORS } from '../constants';
import { Users, ShoppingBag, Bike, TrendingUp, DollarSign, Activity, AlertCircle, Shield, CheckCircle2, XCircle, Lock, Unlock, ToggleLeft, ToggleRight, Search, Stethoscope } from 'lucide-react';

interface Props {
  user: UserProfile;
  features: AppFeatures;
  onUpdateFeatures: (f: AppFeatures) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ user, features, onUpdateFeatures, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'approvals' | 'features'>('dashboard');
  
  // Local State for Management (In a real app, this would be backend data)
  const [allUsers, setAllUsers] = useState<UserProfile[]>(Object.values(MOCK_USERS));
  const [allDoctors, setAllDoctors] = useState<Doctor[]>(DOCTORS);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const pendingUsers = allUsers.filter(u => u.status === 'PENDING');
  const pendingDoctors = allDoctors.filter(d => d.status === 'PENDING');
  const activeUsers = allUsers.filter(u => u.status !== 'PENDING' && u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Handlers
  const handleUserStatusChange = (userId: string, newStatus: ApprovalStatus) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleDoctorStatusChange = (docId: string, newStatus: ApprovalStatus) => {
    setAllDoctors(prev => prev.map(d => d.id === docId ? { ...d, status: newStatus } : d));
  };

  const toggleFeature = (key: keyof AppFeatures) => {
    onUpdateFeatures({ ...features, [key]: !features[key] });
  };

  // Mock Data for Dashboard Stats
  const stats = [
    { title: 'Total Users', value: allUsers.length.toString(), change: '+12%', icon: Users, color: 'blue' },
    { title: 'Pending Approvals', value: (pendingUsers.length + pendingDoctors.length).toString(), change: 'Urgent', icon: AlertCircle, color: 'orange' },
    { title: 'Active Riders', value: allUsers.filter(u => u.role === UserRole.RIDER && u.status === 'APPROVED').length.toString(), change: '+5%', icon: Bike, color: 'emerald' },
    { title: 'Revenue (Today)', value: '₹1.2L', change: '+18%', icon: DollarSign, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
           <h1 className="text-xl font-black text-white italic tracking-tighter">MED<span className="text-purple-500">-</span>FAST</h1>
           <span className="text-xs font-mono text-purple-400">ADMIN CONSOLE</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-inner' : 'hover:bg-white/5'}`}
          >
             <Activity className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('approvals')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'approvals' ? 'bg-white/10 text-white shadow-inner' : 'hover:bg-white/5'}`}
          >
             <div className="relative">
               <Shield className="w-5 h-5" />
               {(pendingUsers.length + pendingDoctors.length) > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>}
             </div>
             Approvals
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-white/10 text-white shadow-inner' : 'hover:bg-white/5'}`}
          >
             <Users className="w-5 h-5" /> User Management
          </button>
          <button 
            onClick={() => setActiveTab('features')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'features' ? 'bg-white/10 text-white shadow-inner' : 'hover:bg-white/5'}`}
          >
             <ToggleLeft className="w-5 h-5" /> Feature Control
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2">
             <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-600" alt="Admin" />
             <div>
                <p className="text-sm font-bold text-white">Super Admin</p>
                <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-300">Logout</button>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="bg-white border-b border-slate-200 p-6 md:hidden flex justify-between items-center sticky top-0 z-20">
           <h1 className="text-lg font-black italic">MED-FAST ADMIN</h1>
           <button onClick={onLogout} className="text-sm text-red-600 font-bold">Logout</button>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
           
           {/* DASHBOARD TAB */}
           {activeTab === 'dashboard' && (
             <div className="animate-fade-in">
                <div className="flex justify-between items-end mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">System Overview</h2>
                      <p className="text-slate-500">Real-time platform metrics.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                              <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{stat.change}</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                        <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                      </div>
                    ))}
                </div>
             </div>
           )}

           {/* APPROVALS TAB */}
           {activeTab === 'approvals' && (
             <div className="animate-slide-up">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Pending Approvals</h2>
                
                {(pendingUsers.length === 0 && pendingDoctors.length === 0) ? (
                  <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-slate-200">
                     <CheckCircle2 className="w-16 h-16 text-green-200 mx-auto mb-4" />
                     <p className="text-slate-400 font-bold text-lg">All caught up! No pending requests.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Pending Users */}
                    {pendingUsers.map(u => (
                      <div key={u.id} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex flex-col md:flex-row items-center gap-6">
                         <div className="relative">
                            <img src={u.avatar} className="w-16 h-16 rounded-full object-cover" />
                            <span className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">NEW</span>
                         </div>
                         <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-lg text-slate-900">{u.name}</h3>
                            <p className="text-sm text-slate-500">{u.role.replace('_', ' ')} • Joined: {new Date(u.joinedAt || 0).toLocaleDateString()}</p>
                            <div className="mt-2 flex gap-2 justify-center md:justify-start">
                               {u.role === UserRole.SHOP_OWNER && <span className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">Lic: {u.licenseNumber}</span>}
                               {u.role === UserRole.RIDER && <span className="text-xs bg-slate-100 px-2 py-1 rounded">Vehicle: {u.vehicleType}</span>}
                            </div>
                         </div>
                         <div className="flex gap-3">
                            <button onClick={() => handleUserStatusChange(u.id, 'BLOCKED')} className="px-6 py-2 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50">Reject</button>
                            <button onClick={() => handleUserStatusChange(u.id, 'APPROVED')} className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-200">Approve</button>
                         </div>
                      </div>
                    ))}
                    
                    {/* Pending Doctors */}
                    {pendingDoctors.map(d => (
                       <div key={d.id} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex flex-col md:flex-row items-center gap-6">
                         <div className="relative">
                            <img src={d.image} className="w-16 h-16 rounded-full object-cover" />
                            <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">DOC</span>
                         </div>
                         <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-lg text-slate-900">{d.name}</h3>
                            <p className="text-sm text-slate-500">{d.specialty} • {d.experience} Yrs Exp.</p>
                            <div className="mt-2 text-xs bg-slate-100 inline-block px-2 py-1 rounded">{d.qualification}</div>
                         </div>
                         <div className="flex gap-3">
                            <button onClick={() => handleDoctorStatusChange(d.id, 'BLOCKED')} className="px-6 py-2 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50">Reject</button>
                            <button onClick={() => handleDoctorStatusChange(d.id, 'APPROVED')} className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-200">Approve</button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
           )}

           {/* USERS MANAGEMENT TAB */}
           {activeTab === 'users' && (
             <div className="animate-fade-in">
               <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
                  <div className="relative w-full md:w-auto">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Search users..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                     />
                  </div>
               </div>

               <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <tr>
                           <th className="p-4">User / Entity</th>
                           <th className="p-4">Role</th>
                           <th className="p-4">Status</th>
                           <th className="p-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {/* Users */}
                        {activeUsers.map(u => (
                           <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4">
                                 <div className="flex items-center gap-3">
                                    <img src={u.avatar} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                                    <div>
                                       <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                                       <p className="text-xs text-slate-500">{u.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-4">
                                 <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-slate-100 text-slate-600">
                                    {u.role}
                                 </span>
                              </td>
                              <td className="p-4">
                                 <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center w-fit gap-1 ${u.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {u.status === 'APPROVED' ? <CheckCircle2 className="w-3 h-3"/> : <Lock className="w-3 h-3" />}
                                    {u.status}
                                 </span>
                              </td>
                              <td className="p-4 text-right">
                                 {u.role !== UserRole.ADMIN && (
                                    <button 
                                      onClick={() => handleUserStatusChange(u.id, u.status === 'APPROVED' ? 'BLOCKED' : 'APPROVED')}
                                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                                         u.status === 'APPROVED' 
                                         ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                         : 'border-green-200 text-green-600 hover:bg-green-50'
                                      }`}
                                    >
                                       {u.status === 'APPROVED' ? 'Block Access' : 'Unblock'}
                                    </button>
                                 )}
                              </td>
                           </tr>
                        ))}
                        {/* Doctors Section Header */}
                        <tr className="bg-slate-50"><td colSpan={4} className="p-2 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Professionals</td></tr>
                        {/* Doctors */}
                        {allDoctors.filter(d => d.status !== 'PENDING').map(d => (
                           <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4">
                                 <div className="flex items-center gap-3">
                                    <img src={d.image} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                                    <div>
                                       <p className="font-bold text-slate-900 text-sm">{d.name}</p>
                                       <p className="text-xs text-slate-500">{d.specialty}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-4"><span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-blue-50 text-blue-600">DOCTOR</span></td>
                              <td className="p-4">
                                 <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center w-fit gap-1 ${d.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {d.status === 'APPROVED' ? <CheckCircle2 className="w-3 h-3"/> : <Lock className="w-3 h-3" />}
                                    {d.status}
                                 </span>
                              </td>
                              <td className="p-4 text-right">
                                 <button 
                                   onClick={() => handleDoctorStatusChange(d.id, d.status === 'APPROVED' ? 'BLOCKED' : 'APPROVED')}
                                   className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                                      d.status === 'APPROVED' 
                                      ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                      : 'border-green-200 text-green-600 hover:bg-green-50'
                                   }`}
                                 >
                                    {d.status === 'APPROVED' ? 'Block Profile' : 'Unblock'}
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
             </div>
           )}

           {/* FEATURES TOGGLE TAB */}
           {activeTab === 'features' && (
             <div className="animate-fade-in max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Global Feature Flags</h2>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
                   
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className="bg-fuchsia-100 p-3 rounded-xl text-fuchsia-600"><Stethoscope className="w-6 h-6"/></div>
                         <div>
                            <h3 className="font-bold text-slate-800">Doctor Consultation</h3>
                            <p className="text-xs text-slate-500">Enable "Find Doctors" tab for customers.</p>
                         </div>
                      </div>
                      <button onClick={() => toggleFeature('enableDoctors')} className={`text-2xl transition-colors ${features.enableDoctors ? 'text-green-500' : 'text-slate-300'}`}>
                         {features.enableDoctors ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                      </button>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><ShoppingBag className="w-6 h-6"/></div>
                         <div>
                            <h3 className="font-bold text-slate-800">Pharmacy & Ordering</h3>
                            <p className="text-xs text-slate-500">Enable purchasing medicines.</p>
                         </div>
                      </div>
                      <button onClick={() => toggleFeature('enablePharmacy')} className={`text-2xl transition-colors ${features.enablePharmacy ? 'text-green-500' : 'text-slate-300'}`}>
                         {features.enablePharmacy ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                      </button>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><Activity className="w-6 h-6"/></div>
                         <div>
                            <h3 className="font-bold text-slate-800">AI Chatbot</h3>
                            <p className="text-xs text-slate-500">Show PharmaBot for customers.</p>
                         </div>
                      </div>
                      <button onClick={() => toggleFeature('enableChatbot')} className={`text-2xl transition-colors ${features.enableChatbot ? 'text-green-500' : 'text-slate-300'}`}>
                         {features.enableChatbot ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                      </button>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><AlertCircle className="w-6 h-6"/></div>
                         <div>
                            <h3 className="font-bold text-slate-800">Promotional Ads</h3>
                            <p className="text-xs text-slate-500">Show banners and offers.</p>
                         </div>
                      </div>
                      <button onClick={() => toggleFeature('enableAds')} className={`text-2xl transition-colors ${features.enableAds ? 'text-green-500' : 'text-slate-300'}`}>
                         {features.enableAds ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                      </button>
                   </div>
                </div>
             </div>
           )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
