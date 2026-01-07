
import React from 'react';
import { TrendingUp, Package, AlertTriangle, IndianRupee, Activity, ArrowUpRight, ArrowDownRight, X, BarChart2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const ShopDashboard: React.FC<Props> = ({ onClose }) => {
  // Mock Data for Dashboard
  const salesData = [
    { label: 'Today', amount: 12500, growth: 12 },
    { label: 'This Month', amount: 450000, growth: 8 },
    { label: 'This Year', amount: 5400000, growth: 15 },
  ];

  const stockAlerts = [
    { name: 'Dolo 650', stock: 5, status: 'Critical' },
    { name: 'Azithral 500', stock: 12, status: 'Low' },
  ];

  const fastMoving = [
    { name: 'Pan-D', sold: 120, trend: 'up' },
    { name: 'Vicks VapoRub', sold: 85, trend: 'up' },
    { name: 'Digene Gel', sold: 60, trend: 'down' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-50 w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="bg-white p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
           <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
                 <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-800">Business Analytics</h2>
                 <p className="text-sm text-slate-500">Sales Overview & Performance Insights</p>
              </div>
           </div>
           <button 
             onClick={onClose}
             className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors text-slate-600"
           >
             <X className="w-6 h-6" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salesData.map((data, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${data.growth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {data.growth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {data.growth}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{data.label} Sales</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">₹{data.amount.toLocaleString()}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Graphical Sales Insight */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" /> Sales Trend
                  </h3>
                  <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-600 outline-none hover:bg-slate-100 cursor-pointer">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
              </div>
              
              {/* CSS Bar Chart Simulation */}
              <div className="flex items-end justify-between h-64 gap-4">
                  {[40, 65, 30, 85, 50, 95, 75].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                        <div 
                          className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-xl transition-all duration-500 relative group-hover:scale-y-105 origin-bottom shadow-lg shadow-indigo-200"
                          style={{ height: `${h}%`, opacity: 0.8 + (h/500) }}
                        >
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10">
                              ₹{(h * 150).toLocaleString()}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                        </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right Column: Alerts & Fast Moving */}
            <div className="space-y-6">
              {/* Stock Alerts */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-500" /> Low Stock Alerts
                  </h3>
                  <div className="space-y-3">
                    {stockAlerts.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                          <div>
                              <p className="text-sm font-bold text-slate-800">{item.name}</p>
                              <p className="text-xs text-orange-600 font-bold">Only {item.stock} left</p>
                          </div>
                          <button className="text-xs bg-white border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                              Restock
                          </button>
                        </div>
                    ))}
                  </div>
              </div>

              {/* Fast Moving */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-emerald-500" /> Fast Moving Items
                  </h3>
                  <div className="space-y-4">
                    {fastMoving.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                              <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${idx===0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>#{idx + 1}</span>
                              <span className="text-sm font-bold text-slate-700">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold">
                              <span className="text-slate-900">{item.sold} sold</span>
                              {item.trend === 'up' 
                                ? <ArrowUpRight className="w-3 h-3 text-green-500" />
                                : <ArrowDownRight className="w-3 h-3 text-red-500" />
                              }
                          </div>
                        </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
