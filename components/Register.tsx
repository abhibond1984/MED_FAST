
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { ArrowLeft, ShoppingBag, Bike, Shield, FileText, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface Props {
  onRegister: (user: UserProfile) => void;
  onCancel: () => void;
}

const Register: React.FC<Props> = ({ onRegister, onCancel }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  
  // Generic State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Shop Specific
  const [storeName, setStoreName] = useState('');
  const [license, setLicense] = useState('');
  const [gst, setGst] = useState('');
  const [licenseFile, setLicenseFile] = useState<string | null>(null);
  const [shopImage, setShopImage] = useState<string | null>(null);
  
  // Rider Specific
  const [vehicle, setVehicle] = useState('Scooter');
  const [dl, setDl] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (name: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    // Simulate verification
    if (role === UserRole.SHOP_OWNER && (!licenseFile || !shopImage)) {
      alert("Please upload verification documents.");
      return;
    }

    const newUser: UserProfile = {
      id: `${role}-${Date.now()}`,
      name,
      email,
      phone,
      address,
      role,
      status: 'APPROVED', // Default to APPROVED for demo purposes
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200',
      joinedAt: Date.now(),
      ...(role === UserRole.SHOP_OWNER ? {
        storeName,
        licenseNumber: license,
        gstIn: gst
      } : {}),
      ...(role === UserRole.RIDER ? {
        vehicleType: vehicle,
        licenseNumber: dl
      } : {})
    };

    // In a real app, this would trigger a "Pending Verification" state.
    // For this demo, we auto-approve.
    onRegister(newUser);
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
           <button onClick={onCancel} className="mb-4 flex items-center text-slate-500 hover:text-slate-800">
             <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
           </button>
           <h2 className="text-2xl font-black text-slate-900 mb-2">Join the Revolution 🚀</h2>
           <p className="text-slate-500 mb-8">Select your partner type to get started.</p>

           <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setRole(UserRole.SHOP_OWNER)}
                className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-100 hover:border-blue-500 transition-all text-left"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShoppingBag className="w-24 h-24 text-blue-600" />
                </div>
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Pharmacy Partner</h3>
                <p className="text-sm text-slate-500 mt-1">List your store, manage inventory, and get orders instantly.</p>
              </button>

              <button 
                onClick={() => setRole(UserRole.RIDER)}
                className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-100 hover:border-orange-500 transition-all text-left"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Bike className="w-24 h-24 text-orange-600" />
                </div>
                <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-orange-600">
                  <Bike className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Delivery Partner</h3>
                <p className="text-sm text-slate-500 mt-1">Join our fleet. Deliver health, earn money, flexible hours.</p>
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
           <div>
             <h2 className="text-xl font-bold">Partner Registration</h2>
             <p className="text-slate-400 text-sm">{role === UserRole.SHOP_OWNER ? 'Pharmacy Registration' : 'Rider Application'}</p>
           </div>
           <button onClick={() => setRole(null)} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
             <ArrowLeft className="w-5 h-5" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Basic Details</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2">
                 <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                 <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Rahul Verma" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                 <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="hello@example.com" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                 <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91 98765..." />
               </div>
               <div className="col-span-2">
                 <label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label>
                 <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Shop No, Street, City" />
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              {role === UserRole.SHOP_OWNER ? 'Business Verification' : 'Vehicle Details'}
            </h3>
            
            {role === UserRole.SHOP_OWNER ? (
              <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1">Store Name</label>
                   <input required type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. City Medico" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Drug License No.</label>
                      <input required type="text" value={license} onChange={e => setLicense(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="DL-12345" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN</label>
                      <input required type="text" value={gst} onChange={e => setGst(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="27AAAAA0000A1Z5" />
                    </div>
                 </div>

                 {/* Verification Uploads */}
                 <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                   <p className="text-xs font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Credentials Verification
                   </p>
                   
                   <div className="space-y-3">
                      <div className="relative border-2 border-dashed border-blue-200 bg-white rounded-lg p-3 hover:bg-blue-50 transition-colors">
                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, setLicenseFile)} />
                         <div className="flex items-center gap-3">
                           <div className="bg-blue-100 p-2 rounded-full text-blue-600"><FileText className="w-4 h-4" /></div>
                           <div className="flex-1">
                             <p className="text-xs font-bold text-slate-700">Upload Drug License</p>
                             <p className="text-[10px] text-slate-500">{licenseFile || "PDF or JPG (Max 2MB)"}</p>
                           </div>
                           {licenseFile && <CheckCircle className="w-4 h-4 text-green-500" />}
                         </div>
                      </div>

                      <div className="relative border-2 border-dashed border-blue-200 bg-white rounded-lg p-3 hover:bg-blue-50 transition-colors">
                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, setShopImage)} />
                         <div className="flex items-center gap-3">
                           <div className="bg-blue-100 p-2 rounded-full text-blue-600"><ImageIcon className="w-4 h-4" /></div>
                           <div className="flex-1">
                             <p className="text-xs font-bold text-slate-700">Upload Shop Photo</p>
                             <p className="text-[10px] text-slate-500">{shopImage || "Storefront with Nameboard"}</p>
                           </div>
                           {shopImage && <CheckCircle className="w-4 h-4 text-green-500" />}
                         </div>
                      </div>
                   </div>
                 </div>
              </div>
            ) : (
              <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1">Driving License No.</label>
                   <input required type="text" value={dl} onChange={e => setDl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="DL-123456789" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type</label>
                   <select value={vehicle} onChange={e => setVehicle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                     <option value="Scooter">Scooter / Bike</option>
                     <option value="Electric_Bike">Electric Bike</option>
                     <option value="Cycle">Bicycle</option>
                   </select>
                 </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button type="submit" className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" /> Submit for Verification
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">We will verify your documents within 24 hours.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
