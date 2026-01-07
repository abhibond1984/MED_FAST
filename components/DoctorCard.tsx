
import React from 'react';
import { Doctor } from '../types';
import { Star, MapPin, Clock, Calendar, Video } from 'lucide-react';

interface Props {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<Props> = ({ doctor, onBook }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all animate-slide-up flex gap-4">
      {/* Doctor Image */}
      <div className="shrink-0 relative">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-24 h-24 rounded-xl object-cover bg-slate-100 dark:bg-slate-700"
        />
        <div className="absolute -bottom-2 -right-2 bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-lg text-[10px] font-bold flex items-center shadow-sm border border-yellow-200">
           <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-0.5" /> {doctor.rating}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
           <div>
             <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{doctor.name}</h3>
             <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{doctor.specialty}</p>
           </div>
           {doctor.available && (
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Available
              </span>
           )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{doctor.qualification} • {doctor.experience} Years Exp.</p>
        
        <div className="flex items-center gap-1 mt-2 text-xs text-slate-600 dark:text-slate-300">
           <MapPin className="w-3 h-3" />
           <span>{doctor.hospitalName}, {doctor.location}</span>
        </div>

        <div className="flex items-center justify-between mt-4">
           <div className="text-sm font-black text-slate-900 dark:text-white">
             ₹{doctor.consultationFee} <span className="text-[10px] font-normal text-slate-400">/ Visit</span>
           </div>
           
           <div className="flex gap-2">
             <button className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 transition-colors">
                <Video className="w-4 h-4" />
             </button>
             <button 
               onClick={() => onBook(doctor)}
               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
             >
               Book Now
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
