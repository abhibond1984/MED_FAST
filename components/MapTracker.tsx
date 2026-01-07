import React from 'react';
import { Coordinates, OrderStatus } from '../types';
import { MapPin, Navigation, Store } from 'lucide-react';

interface MapTrackerProps {
  shopLocation: Coordinates;
  customerLocation: Coordinates;
  riderLocation?: Coordinates;
  status: OrderStatus;
}

const MapTracker: React.FC<MapTrackerProps> = ({
  shopLocation,
  customerLocation,
  riderLocation,
  status
}) => {
  // SVG Viewbox 0 0 100 100
  // Coordinates are percentages 0-100

  return (
    <div className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200">
      {/* Background Grid - City Blocks simulation */}
      <svg className="absolute inset-0 w-full h-full text-slate-300" viewBox="0 0 100 100">
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Connection Line (Route) */}
        {(status === OrderStatus.ON_THE_WAY || status === OrderStatus.READY_FOR_PICKUP || status === OrderStatus.DELIVERED) && (
          <line 
            x1={shopLocation.x} 
            y1={shopLocation.y} 
            x2={customerLocation.x} 
            y2={customerLocation.y} 
            stroke="#94a3b8" 
            strokeWidth="1" 
            strokeDasharray="4"
          />
        )}
      </svg>

      {/* Shop Marker */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
        style={{ left: `${shopLocation.x}%`, top: `${shopLocation.y}%` }}
      >
        <div className="bg-blue-600 p-2 rounded-full shadow-lg z-10">
          <Store className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-bold text-blue-800 bg-white/80 px-1 rounded mt-1">Pharmacy</span>
      </div>

      {/* Customer Marker */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
        style={{ left: `${customerLocation.x}%`, top: `${customerLocation.y}%` }}
      >
        <div className="bg-green-600 p-2 rounded-full shadow-lg z-10">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-bold text-green-800 bg-white/80 px-1 rounded mt-1">You</span>
      </div>

      {/* Rider Marker - Dynamic */}
      {riderLocation && (status === OrderStatus.ON_THE_WAY || status === OrderStatus.READY_FOR_PICKUP) && (
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear z-20"
          style={{ left: `${riderLocation.x}%`, top: `${riderLocation.y}%` }}
        >
          <div className="bg-orange-500 p-1.5 rounded-full shadow-xl ring-4 ring-orange-200">
            <Navigation className="w-4 h-4 text-white transform rotate-45" />
          </div>
          <div className="text-[10px] font-bold text-orange-800 bg-white/90 px-1 rounded mt-1 whitespace-nowrap">
            Rider (3 min away)
          </div>
        </div>
      )}
      
      {/* Status Overlay */}
      <div className="absolute top-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow-sm text-xs font-medium text-slate-600">
        Status: <span className="font-bold text-slate-900">{status.replace(/_/g, ' ')}</span>
      </div>
    </div>
  );
};

export default MapTracker;
