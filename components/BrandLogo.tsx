
import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const BrandLogo: React.FC<Props> = ({ size = 'md', animated = false }) => {
  // Size mapping
  const sizes = {
    sm: { container: 'w-10 h-10 rounded-lg', pill: 'w-3 h-5', steth: 'w-8 h-8' },
    md: { container: 'w-12 h-12 rounded-xl', pill: 'w-4 h-7', steth: 'w-10 h-10' },
    lg: { container: 'w-20 h-20 rounded-2xl', pill: 'w-7 h-11', steth: 'w-16 h-16' },
    xl: { container: 'w-32 h-32 rounded-3xl', pill: 'w-12 h-20', steth: 'w-24 h-24' },
  };

  const s = sizes[size];

  return (
    <div className={`relative ${s.container} flex items-center justify-center group select-none`}>
      {/* Glassy Background with Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] ${s.container} transform transition-transform duration-500 ${animated ? 'group-hover:rotate-6 group-hover:scale-105' : ''}`}>
        {/* Inner shine */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-[inherit]"></div>
      </div>

      {/* Stethoscope SVG Layer (Behind/Around Pill) */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`absolute text-slate-600 dark:text-slate-300 opacity-80 ${s.steth} ${animated ? 'group-hover:stroke-blue-500 transition-colors duration-300' : ''}`}
      >
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>

      {/* Dual Color Pill Icon */}
      <div className={`relative ${s.pill} transform -rotate-45 shadow-lg z-10 ${animated ? 'animate-bounce-slow' : ''}`}>
        {/* Top Half - Cyan/Blue */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-cyan-300 to-blue-500 rounded-t-full"></div>
        {/* Bottom Half - Purple/Pink */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-pink-500 to-purple-600 rounded-b-full"></div>
        
        {/* Dividing Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/10"></div>
        
        {/* Gloss Effect */}
        <div className="absolute top-[10%] right-[15%] w-[30%] h-[30%] bg-white/40 rounded-full blur-[0.5px]"></div>
      </div>
    </div>
  );
};

export default BrandLogo;
