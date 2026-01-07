
import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, Medicine, CartItem, OrderStatus, Doctor, AppFeatures, Order } from './types';
import { MEDICINES, DOCTORS, DOCTOR_SPECIALTIES, MOTIVATIONAL_QUOTES, CUSTOMER_LOCATION, SHOP_LOCATION, DEFAULT_FEATURES } from './constants';
import { initializeGemini } from './services/geminiService';
import Login from './components/Login';
import MedicineCard from './components/MedicineCard';
import MedicineDetailsModal from './components/MedicineDetailsModal';
import DoctorCard from './components/DoctorCard';
import DoctorBookingModal from './components/DoctorBookingModal';
import PharmaBot from './components/PharmaBot';
import MapTracker from './components/MapTracker';
import PrescriptionUpload from './components/PrescriptionUpload';
import StoreList from './components/StoreList';
import Profile from './components/Profile';
import PaymentGateway from './components/PaymentGateway';
import AdminDashboard from './components/AdminDashboard';
import ShopDashboard from './components/ShopDashboard';
import InventoryManager from './components/InventoryManager';
import Toast from './components/Toast';
import BottomNav from './components/BottomNav';
import BrandLogo from './components/BrandLogo';
import { 
  ShoppingCart, 
  Search, 
  MapPin, 
  X, 
  Sun, 
  Moon, 
  LogOut,
  Pill,
  Stethoscope,
  ChevronRight,
  ArrowLeft,
  Bike,
  Zap,
  Lock,
  Clock,
  BarChart2,
  CheckCircle,
  Package,
  AlertTriangle,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

// Initialize AI Service
initializeGemini();

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // App Configuration
  const [appConfig, setAppConfig] = useState<AppFeatures>(DEFAULT_FEATURES);

  // Customer State
  const [customerViewMode, setCustomerViewMode] = useState<'home' | 'search' | 'cart' | 'profile'>('home');
  const [appMode, setAppMode] = useState<'pharmacy' | 'doctor'>('pharmacy');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('Locating...');
  
  // Medicine Details State
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  // Doctor Booking State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  // Shop/Inventory State
  const [inventory, setInventory] = useState<Medicine[]>(MEDICINES);
  const [showShopStats, setShowShopStats] = useState(false);
  
  // Mock Active Orders for Shop
  const [shopOrders, setShopOrders] = useState<Order[]>([]);

  // Common UI State
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [activeOrder, setActiveOrder] = useState<{id: string, status: OrderStatus} | null>(null);
  
  // Effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Simulate fetching location on mount
  useEffect(() => {
    if (user && user.role === UserRole.CUSTOMER) {
      setTimeout(() => {
        setUserLocation('Bandra West, Mumbai');
      }, 1500);
    }
  }, [user]);

  // Simulate Incoming Order for Shop Owner (Demo Purpose)
  useEffect(() => {
    if (user && user.role === UserRole.SHOP_OWNER && shopOrders.length === 0) {
      const timer = setTimeout(() => {
        setShopOrders([{
           id: `ORD-NEW-${Date.now()}`,
           customerId: 'USER-DEMO',
           customerName: 'Rahul Mehra',
           items: [{ ...inventory[0], quantity: 2 }],
           totalAmount: inventory[0].price * 2,
           status: OrderStatus.PREPARING,
           createdAt: Date.now(),
           shopLocation: SHOP_LOCATION,
           customerLocation: CUSTOMER_LOCATION
        }]);
        showToast("New Order Received!", "success");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, shopOrders, inventory]);

  // Handlers
  const handleLogin = (loggedInUser: UserProfile) => {
    if (loggedInUser.status === 'BLOCKED') {
      showToast("Access Denied: Your account has been blocked by the Administrator.", 'error');
      return;
    }
    if (loggedInUser.status === 'PENDING') {
       setUser(loggedInUser); 
       return;
    }
    setUser(loggedInUser);
    showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setCustomerViewMode('home');
    setShowProfile(false);
    setSelectedMedicine(null);
    setShopOrders([]);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const addToCart = (medicine: Medicine) => {
    if (!appConfig.enablePharmacy) {
        showToast("Pharmacy services are currently paused.", 'error');
        return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item => item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
    showToast(`${medicine.name} added to cart`);
  };

  const handleCheckout = (method: string) => {
    setIsCheckout(false);
    setActiveOrder({ id: `ORD-${Date.now()}`, status: OrderStatus.PREPARING });
    setCart([]);
    setCustomerViewMode('home');
    showToast(`Order placed successfully via ${method}!`, 'success');
  };

  // Helper for Similar Medicines
  const getSimilarMedicines = (med: Medicine) => {
    return inventory.filter(m => m.category === med.category && m.id !== med.id);
  };

  // Shop Owner: Handle Order Status Update & Stock Deduction
  const handleOrderUpdate = (orderId: string, newStatus: OrderStatus) => {
    // 1. Update Order Status
    const updatedOrders = shopOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setShopOrders(updatedOrders);

    // 2. If Delivered, Deduct Stock
    if (newStatus === OrderStatus.DELIVERED) {
       const orderToProcess = shopOrders.find(o => o.id === orderId);
       if (orderToProcess) {
          const newInventory = [...inventory];
          let deductionDetails = "";
          
          orderToProcess.items.forEach(cartItem => {
             const stockItemIndex = newInventory.findIndex(i => i.id === cartItem.id);
             if (stockItemIndex > -1) {
                const currentStock = newInventory[stockItemIndex].stockQuantity || 0;
                const newStock = Math.max(0, currentStock - cartItem.quantity);
                
                newInventory[stockItemIndex] = {
                   ...newInventory[stockItemIndex],
                   stockQuantity: newStock,
                   inStock: newStock > 0
                };
                deductionDetails += `${cartItem.name}: ${currentStock} -> ${newStock}. `;
             }
          });
          setInventory(newInventory);
          showToast(`Order Delivered. Stock Updated.`, 'success');
       }
    } else {
       showToast(`Order status updated to ${newStatus}`);
    }
  };

  // Render Functions
  if (!user) {
    return (
        <>
            <Login onLogin={handleLogin} />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
  }

  if (user.status === 'PENDING') {
      return (
          <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Clock className="w-12 h-12 text-orange-600" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">Approval Pending</h1>
              <p className="text-slate-500 max-w-md mb-8">
                  Your account is currently under review by our administration team. 
                  You will be able to access the platform once approved.
              </p>
              <button onClick={handleLogout} className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-300">
                  Logout & Check Later
              </button>
          </div>
      );
  }

  if (user.role === UserRole.ADMIN) {
    return <AdminDashboard user={user} features={appConfig} onUpdateFeatures={setAppConfig} onLogout={handleLogout} />;
  }

  // SHOP OWNER VIEW
  if (user.role === UserRole.SHOP_OWNER) {
    const lowStockItems = inventory.filter(i => (i.stockQuantity || 0) < 10).length;
    const totalItems = inventory.length;
    const outOfStockItems = inventory.filter(i => !i.inStock).length;

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 sticky top-4 z-30">
          <div className="flex items-center gap-3">
             <BrandLogo size="md" />
             <div>
                <h1 className="text-xl font-black text-slate-900 leading-none">Store Manager</h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{user.storeName}</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
                onClick={() => setShowShopStats(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
                <LayoutDashboard className="w-4 h-4" /> <span className="hidden md:inline">Sales Dashboard</span>
            </button>
            <button onClick={handleLogout} className="bg-slate-100 p-2.5 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors">
                <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {showShopStats && <ShopDashboard onClose={() => setShowShopStats(false)} />}
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
               <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600"><Package className="w-5 h-5"/></div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Items</p>
                  <p className="text-lg font-black text-slate-900">{totalItems}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
               <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600"><AlertTriangle className="w-5 h-5"/></div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Low Stock</p>
                  <p className="text-lg font-black text-orange-600">{lowStockItems}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
               <div className="bg-red-100 p-2.5 rounded-xl text-red-600"><X className="w-5 h-5"/></div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Out of Stock</p>
                  <p className="text-lg font-black text-red-600">{outOfStockItems}</p>
               </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
               <div className="bg-purple-100 p-2.5 rounded-xl text-purple-600"><TrendingUp className="w-5 h-5"/></div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Today's Orders</p>
                  <p className="text-lg font-black text-purple-600">{shopOrders.length}</p>
               </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Inventory (Primary Focus - Top Left in Desktop) */}
           <div className="lg:col-span-2 order-2 lg:order-1 h-full">
              <InventoryManager medicines={inventory} onUpdate={setInventory} />
           </div>

           {/* Orders Panel (Right Sidebar) */}
           <div className="order-1 lg:order-2">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-24">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Bike className="w-5 h-5 text-blue-600" /> Active Orders
                    </h3>
                    {shopOrders.length > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg animate-pulse">{shopOrders.length} Pending</span>
                    )}
                 </div>
                 
                 {shopOrders.length > 0 ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {shopOrders.map(order => (
                            <div key={order.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 animate-slide-up hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">#{order.id.slice(-6)} • {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700 border-green-200' : 
                                        order.status === OrderStatus.ON_THE_WAY ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                        'bg-blue-100 text-blue-700 border-blue-200'
                                    }`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mb-4 bg-white p-3 rounded-lg border border-slate-100">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-xs text-slate-600">
                                            <span><span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}</span>
                                            <span className="font-mono">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-black text-slate-800">
                                        <span>Total Bill</span>
                                        <span>₹{order.totalAmount}</span>
                                    </div>
                                </div>

                                {/* Order Actions */}
                                <div className="grid grid-cols-2 gap-2">
                                    {order.status === OrderStatus.PREPARING && (
                                        <button 
                                          onClick={() => handleOrderUpdate(order.id, OrderStatus.READY_FOR_PICKUP)}
                                          className="col-span-2 bg-blue-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                        >
                                            Mark Ready for Pickup
                                        </button>
                                    )}
                                    {order.status === OrderStatus.READY_FOR_PICKUP && (
                                        <button 
                                          onClick={() => handleOrderUpdate(order.id, OrderStatus.ON_THE_WAY)}
                                          className="col-span-2 bg-orange-500 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <Bike className="w-3 h-3" /> Handover to Rider
                                        </button>
                                    )}
                                    {order.status === OrderStatus.ON_THE_WAY && (
                                        <button 
                                          onClick={() => handleOrderUpdate(order.id, OrderStatus.DELIVERED)}
                                          className="col-span-2 bg-green-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <CheckCircle className="w-3 h-3" /> Confirm Delivery
                                        </button>
                                    )}
                                    {order.status === OrderStatus.DELIVERED && (
                                        <div className="col-span-2 text-center text-[10px] font-bold text-green-600 bg-green-50 py-2 rounded-lg border border-green-100 flex items-center justify-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Inventory Updated
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                            <ShoppingCart className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">No active orders</p>
                        <p className="text-xs text-slate-400">Wait for customers to place orders</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // RIDER VIEW
  if (user.role === UserRole.RIDER) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col relative">
         <div className="absolute inset-0 z-0">
            <MapTracker 
              shopLocation={SHOP_LOCATION} 
              customerLocation={CUSTOMER_LOCATION} 
              riderLocation={{ x: 50, y: 50 }} 
              status={OrderStatus.ON_THE_WAY} 
            />
         </div>
         <div className="relative z-10 mt-auto bg-white rounded-t-3xl shadow-2xl p-6 pb-safe">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold">Delivery Dashboard</h2>
               <button onClick={handleLogout} className="text-sm font-bold text-red-600">Logout</button>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
               <p className="text-xs font-bold text-slate-500 uppercase">Current Status</p>
               <p className="text-lg font-black text-slate-800 flex items-center gap-2">
                 <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span> Online & Available
               </p>
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors">
               Wait for Orders
            </button>
         </div>
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // Customer View Logic
  const filteredMedicines = inventory.filter(m => 
    (selectedCategory === 'All' || m.category === selectedCategory) &&
    (m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     m.uses?.some(u => u.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const currentCity = userLocation.split(',').pop()?.trim() || ''; 
  const filteredDoctors = DOCTORS.filter(d => {
    // 1. Must be Approved
    if (d.status !== 'APPROVED') return false;
    
    const matchesCategory = selectedCategory === 'All' || d.specialty === selectedCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = userLocation === 'Locating...' ? true : d.location.includes(currentCity);
    return matchesCategory && matchesSearch && matchesLocation;
  });

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* Customer Header */}
      <header className={`sticky top-0 z-40 transition-all ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-xl border-b px-4 py-3 shadow-sm`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={() => setCustomerViewMode('home')}>
             <BrandLogo size="md" animated />
             <div className="flex flex-col hidden sm:flex">
                <h1 className={`text-2xl md:text-3xl font-black italic tracking-tighter leading-none ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'}`}>
                  MED<span className="text-cyan-500">.</span>FAST
                </h1>
                <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 -mt-1 ml-0.5">
                   <Bike className="w-3 h-3 animate-pulse" />
                   <span>30 MIN DELIVERY</span>
                </div>
             </div>
          </div>
          
          {/* Right Side Actions Grouped */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             
             {/* Cart Button (Desktop) */}
             <button 
                onClick={() => setCustomerViewMode('cart')}
                className="hidden md:flex items-center gap-2 bg-blue-50 dark:bg-slate-800 p-2 pr-4 rounded-xl hover:bg-blue-100 transition-colors"
             >
                <div className="bg-white dark:bg-slate-700 p-1.5 rounded-lg shadow-sm relative">
                   <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                   {cart.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Cart</span>
             </button>

             <button 
               onClick={() => setDarkMode(!darkMode)}
               className={`p-2.5 rounded-full transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`}
             >
               {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
             
             <button 
               onClick={() => setShowProfile(true)}
               className="relative group ml-1"
             >
               <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
               <img src={user.avatar} alt="Profile" className="relative w-10 h-10 rounded-full border-2 border-white object-cover" />
             </button>

             {/* Location Button */}
             <div className={`hidden md:flex flex-col items-end justify-center px-3 py-1.5 rounded-lg border ml-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">Delivering to</span>
                <div className="flex items-center gap-1">
                   <MapPin className="w-3 h-3 text-red-500" />
                   <span className={`text-xs font-bold truncate max-w-[100px] ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                     {userLocation}
                   </span>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 pb-24 md:pb-8">
         
         {customerViewMode === 'home' && (
           <div className="flex flex-col gap-4">
             
             {/* 1. Greeting Banner (Compact) */}
             {appConfig.enableAds && (
                <div className="w-full p-4 md:p-5 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 shadow-xl shadow-purple-200/50 dark:shadow-none text-white relative overflow-hidden flex items-center justify-between">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-32 h-32 text-white rotate-12" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:gap-4 w-full">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black mb-1">
                        Hey, {user.name.split(' ')[0]}! 👋
                        </h2>
                        <p className="text-purple-100 font-medium text-xs md:text-sm max-w-lg leading-tight opacity-90">
                        {MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]}
                        </p>
                    </div>
                    </div>
                </div>
             )}

             {/* 2. Service Switcher */}
             {appConfig.enableDoctors ? (
                <div className={`w-full p-1 rounded-2xl flex shadow-sm border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <button 
                    onClick={() => { setAppMode('pharmacy'); setSelectedCategory('All'); setSearchQuery(''); }}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                        appMode === 'pharmacy' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                        : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                    >
                    <Pill className="w-5 h-5" /> Pharmacy
                    </button>
                    <button 
                    onClick={() => { setAppMode('doctor'); setSelectedCategory('All'); setSearchQuery(''); }}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                        appMode === 'doctor' 
                        ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg' 
                        : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                    >
                    <Stethoscope className="w-5 h-5" /> Find Doctors
                    </button>
                </div>
             ) : (
                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center text-blue-600 font-bold text-sm">
                    Currently Viewing: Pharmacy
                 </div>
             )}

             {/* 3. Search Bar */}
             <div className={`w-full flex items-center gap-3 px-5 rounded-2xl border-2 transition-all ${darkMode ? 'bg-slate-900 border-slate-700 focus-within:border-cyan-500' : 'bg-white border-slate-100 focus-within:border-blue-500'}`}>
                 <Search className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                 <input 
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder={appMode === 'pharmacy' ? "Search for medicines, symptoms..." : "Search doctors by name or specialty..."}
                   className={`w-full bg-transparent border-none focus:outline-none text-sm font-semibold h-14 ${darkMode ? 'text-white' : 'text-slate-900'}`}
                 />
                 {searchQuery && <X onClick={() => setSearchQuery('')} className="w-4 h-4 cursor-pointer text-slate-400" />}
             </div>

             {/* Categories */}
             <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                {(appMode === 'pharmacy' ? ['All', ...Array.from(new Set(inventory.map(m => m.category)))] : DOCTOR_SPECIALTIES).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : `${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-500 border border-slate-100'}`
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>

             {/* Content Grid */}
             {appMode === 'pharmacy' ? (
                <div className="flex flex-col gap-4">
                  {/* Prescription Upload Bar */}
                  {!searchQuery && selectedCategory === 'All' && appConfig.enablePharmacy && (
                    <div className="animate-fade-in">
                       <PrescriptionUpload 
                         onUpload={(url) => showToast('Prescription uploaded! Analyzing...', 'success')} 
                         onAddToCart={addToCart}
                       />
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredMedicines.map(medicine => (
                       <MedicineCard 
                         key={medicine.id} 
                         medicine={medicine} 
                         onAdd={addToCart} 
                         onClick={setSelectedMedicine}
                       />
                    ))}
                  </div>
                  
                  {filteredMedicines.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                      <div className="text-4xl mb-2">🔭</div>
                      <p className="text-slate-400 font-bold">No results found.</p>
                    </div>
                  )}
                  
                  {!appConfig.enablePharmacy && (
                    <div className="py-20 text-center bg-slate-50 rounded-3xl border border-slate-200">
                        <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-slate-700">Store Closed</h3>
                        <p className="text-slate-400">Ordering is currently disabled by admin.</p>
                    </div>
                  )}
                </div>
             ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                     <MapPin className="w-4 h-4 text-slate-400" />
                     <p className="text-xs font-bold text-slate-500 uppercase">Showing Specialists in {currentCity || userLocation}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => (
                        <DoctorCard 
                          key={doctor.id} 
                          doctor={doctor} 
                          onBook={(d) => setBookingDoctor(d)} 
                        />
                     )) : (
                        <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-2xl">
                           <p className="text-slate-400 font-bold">No doctors found in this area/specialty.</p>
                        </div>
                     )}
                  </div>
                </>
             )}
           </div>
         )}

         {/* Cart View */}
         {customerViewMode === 'cart' && (
            <div className="max-w-2xl mx-auto animate-slide-up bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <button onClick={() => setCustomerViewMode('home')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 dark:text-white" />
                  </button>
                  <h2 className="text-xl font-black dark:text-white">Checkout <span className="text-blue-500">({cart.reduce((a, b) => a + b.quantity, 0)} Items)</span></h2>
               </div>

               {cart.length > 0 ? (
                 <>
                   <div className="space-y-3 mb-6">
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                           <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-slate-200" />
                           <div className="flex-1">
                              <h4 className="font-bold text-slate-800 dark:text-white">{item.name}</h4>
                              <p className="text-xs text-slate-400 mb-2">{item.packSize}</p>
                              <div className="flex justify-between items-center">
                                 <div className="font-bold text-slate-900 dark:text-white">₹{item.price * item.quantity}</div>
                                 <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <button 
                                      className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                                      onClick={() => {
                                        const newCart = cart.map(i => i.id === item.id ? {...i, quantity: i.quantity - 1} : i).filter(i => i.quantity > 0);
                                        setCart(newCart);
                                      }}
                                    >-</button>
                                    <span className="text-xs font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                                    <button 
                                      className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                                      onClick={() => addToCart(item)}
                                    >+</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm text-slate-500">
                         <span>Subtotal</span>
                         <span>₹{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-500">
                         <span>Delivery Fee</span>
                         <span className="text-green-600 font-bold">FREE</span>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between items-center">
                         <span className="font-bold text-lg dark:text-white">Total</span>
                         <span className="font-black text-2xl text-blue-600">₹{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
                   </div>
                   
                   <div className="mb-6">
                     <StoreList selectedStoreId={selectedStore} onSelect={setSelectedStore} />
                   </div>

                   <button 
                     onClick={() => setIsCheckout(true)}
                     className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                   >
                      Pay Securely <ChevronRight className="w-5 h-5" />
                   </button>
                 </>
               ) : (
                 <div className="text-center py-10">
                    <p className="text-slate-400 font-medium mb-6">Your cart is empty.</p>
                    <button onClick={() => setCustomerViewMode('home')} className="px-6 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold">
                        Start Shopping
                    </button>
                 </div>
               )}
            </div>
         )}
      </main>

      {/* Floating Elements */}
      <BottomNav activeTab={customerViewMode} onTabChange={(t: any) => setCustomerViewMode(t)} cartCount={cart.length} />
      
      {appConfig.enableChatbot && <PharmaBot cartItems={cart} />}

      {/* Modals & Overlays */}
      {selectedMedicine && (
        <MedicineDetailsModal
          medicine={selectedMedicine}
          onClose={() => setSelectedMedicine(null)}
          onAddToCart={addToCart}
          similarMedicines={getSimilarMedicines(selectedMedicine)}
          onSelectSimilar={setSelectedMedicine}
        />
      )}

      {showProfile && (
        <Profile 
          user={user} 
          onLogout={handleLogout} 
          onClose={() => setShowProfile(false)} 
          onReorder={(items) => {
            setCart(items);
            setCustomerViewMode('cart');
          }}
        />
      )}
      
      {/* Doctor Booking Modal */}
      {bookingDoctor && (
        <DoctorBookingModal 
          doctor={bookingDoctor} 
          user={user} // Pass User Context
          onClose={() => setBookingDoctor(null)} 
          onConfirm={() => showToast('Appointment Booked Successfully!', 'success')} 
        />
      )}

      {isCheckout && (
        <PaymentGateway 
          amount={cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
          onCancel={() => setIsCheckout(false)}
          onPaymentComplete={handleCheckout}
        />
      )}

      {activeOrder && (
         <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col">
            <div className="flex-1 relative">
               <MapTracker 
                 shopLocation={SHOP_LOCATION} 
                 customerLocation={CUSTOMER_LOCATION} 
                 riderLocation={{ x: 50, y: 50 }} 
                 status={activeOrder.status}
               />
               <div className="absolute top-4 left-4">
                  <button onClick={() => setActiveOrder(null)} className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
               </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
               <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-8"></div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Order {activeOrder.status.replace('_', ' ')}</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Your health essentials are zooming to you! 🏍️💨</p>
               
               <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl mb-6">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black text-xl border-4 border-white dark:border-slate-700 shadow-sm">
                     VS
                  </div>
                  <div>
                     <p className="font-bold text-lg text-slate-900 dark:text-white">Vikram Singh</p>
                     <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Delivery Partner • 4.8 ★</p>
                  </div>
                  <button className="ml-auto bg-green-500 text-white p-4 rounded-full shadow-lg shadow-green-200 hover:scale-110 transition-transform hover:rotate-12">
                     <Bike className="w-6 h-6" />
                  </button>
               </div>
            </div>
         </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
