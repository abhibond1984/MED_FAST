import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, RefreshCw, Lightbulb } from 'lucide-react';
import { getShopInsights } from '../services/geminiService';

const ShopInsightsWidget: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
        const text = await getShopInsights();
        // Robust parsing for bullet points or new lines
        const lines = text.split('\n')
            .map(line => line.replace(/^[\*\-\•]\s*/, '').trim()) // Remove bullet chars
            .filter(line => line.length > 5); // Filter out empty or too short lines
        
        setInsights(lines.slice(0, 3));
    } catch (e) {
        setInsights(["Market data currently unavailable."]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl mb-8 relative overflow-hidden group border border-white/10">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/3 -translate-y-1/3">
         <div className="w-48 h-48 bg-pink-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
                <h3 className="font-bold text-lg leading-tight">Smart Assistant</h3>
                <p className="text-[10px] text-indigo-200 font-medium tracking-wide uppercase">Powered by Gemini AI</p>
            </div>
          </div>
          <button 
            onClick={fetchInsights} 
            disabled={loading}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${loading ? 'animate-spin' : 'hover:rotate-180 duration-500'}`}
            title="Refresh Insights"
          >
            <RefreshCw className="w-4 h-4 text-indigo-200" />
          </button>
        </div>
        
        {loading ? (
           <div className="space-y-3 py-2">
              <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <div className="h-2 bg-indigo-400/30 rounded w-3/4"></div>
              </div>
              <div className="flex items-center gap-3 animate-pulse delay-75">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <div className="h-2 bg-indigo-400/30 rounded w-5/6"></div>
              </div>
              <div className="flex items-center gap-3 animate-pulse delay-150">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <div className="h-2 bg-indigo-400/30 rounded w-1/2"></div>
              </div>
           </div>
        ) : (
          <div className="space-y-3">
             {insights.length > 0 ? insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-indigo-50 leading-relaxed animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <Lightbulb className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                </div>
             )) : (
                <p className="text-sm text-indigo-200">No insights available right now.</p>
             )}
          </div>
        )}
      </div>
      <TrendingUp className="absolute right-[-10px] bottom-[-10px] w-36 h-36 text-white opacity-5 group-hover:opacity-10 transition-all duration-700 transform group-hover:scale-110 group-hover:-translate-x-2 group-hover:-translate-y-2" />
    </div>
  );
};

export default ShopInsightsWidget;