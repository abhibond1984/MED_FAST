
import React, { useState, useEffect } from 'react';
import { Doctor, UserProfile } from '../types';
import { X, Calendar, MapPin, User, ChevronRight, CheckCircle2, ShieldCheck, UserPlus, Phone, Edit2, Users, Star, Quote, Award, Stethoscope, Clock } from 'lucide-react';

interface Props {
  doctor: Doctor;
  user: UserProfile;
  onClose: () => void;
  onConfirm: () => void;
}

const DoctorBookingModal: React.FC<Props> = ({ doctor, user, onClose, onConfirm }) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0 = Profile View
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Patient Details State
  const [selectedProfileId, setSelectedProfileId] = useState<string>(user.id);
  const [patientName, setPatientName] = useState(user.name);
  const [contactPhone, setContactPhone] = useState(user.phone || '');
  
  // New Patient State
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [newPatientRelation, setNewPatientRelation] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');

  const [symptoms, setSymptoms] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock Dates
  const dates = ['Today', 'Tomorrow', 'Fri, 24 Aug', 'Sat, 25 Aug', 'Sun, 26 Aug', 'Mon, 27 Aug'];
  
  // Mock Time Slots
  const morningSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const eveningSlots = ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];

  // Handle Profile Switching
  const handleProfileSelect = (id: string) => {
    setSelectedProfileId(id);
    
    if (id === 'NEW_PATIENT') {
      setIsNewPatient(true);
      setPatientName('');
      setContactPhone(user.phone || ''); // Default to main user's phone for contact
      setNewPatientRelation('');
      setNewPatientAge('');
    } else {
      setIsNewPatient(false);
      if (id === user.id) {
        setPatientName(user.name);
        setContactPhone(user.phone || '');
      } else {
        const member = user.familyMembers?.find(m => m.id === id);
        if (member) {
          setPatientName(member.name);
          // Family members might not have phone, default to user's
          setContactPhone(user.phone || ''); 
        }
      }
    }
  };

  const handleNext = () => {
    if (step === 0) setStep(1);
    if (step === 1 && selectedTime) setStep(2);
    if (step === 2) {
      if (!patientName || !contactPhone) return; // Basic Validation
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
      }, 2000); 
    }
  };

  const renderHeader = () => (
    <div className="bg-slate-900 p-6 text-white shrink-0 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
         <div className="w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 hover:bg-white/10 p-2 rounded-full transition-colors z-20">
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex gap-4 relative z-10">
        <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-xl" />
        <div>
          <h2 className="text-xl font-bold">{doctor.name}</h2>
          <p className="text-blue-400 font-medium text-sm flex items-center gap-1">
             <Stethoscope className="w-3 h-3" /> {doctor.specialty}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
             <MapPin className="w-3 h-3" /> {doctor.hospitalName}, {doctor.location}
          </div>
          <div className="flex items-center gap-2 mt-2">
             <span className="bg-yellow-500/20 text-yellow-300 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-yellow-500/30">
                <Star className="w-3 h-3 fill-yellow-500" /> {doctor.rating}
             </span>
             {doctor.experience > 0 && (
                <span className="text-[10px] text-slate-400 font-medium">
                   {doctor.experience}+ Years Exp.
                </span>
             )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        
        {step !== 3 && renderHeader()}

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
          
          {/* STEP 0: Doctor Profile & Reviews */}
          {step === 0 && (
            <div className="space-y-6 animate-fade-in">
               
               {/* Stats Row */}
               <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 p-3 rounded-2xl text-center border border-blue-100">
                     <p className="text-blue-600 font-black text-lg">{doctor.patientsServed ? `${(doctor.patientsServed/1000).toFixed(1)}k+` : '1k+'}</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase">Patients</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-2xl text-center border border-emerald-100">
                     <p className="text-emerald-600 font-black text-lg">{doctor.experience}+</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase">Years</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-2xl text-center border border-purple-100">
                     <p className="text-purple-600 font-black text-lg">{doctor.rating}</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase">Rating</p>
                  </div>
               </div>

               {/* About Section */}
               <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                     <User className="w-4 h-4 text-blue-500" /> About Doctor
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                     {doctor.about || `${doctor.name} is a highly skilled specialist with years of experience in ${doctor.specialty}. Dedicated to providing the best patient care.`}
                  </p>
               </div>

               {/* Testimonials Slider */}
               <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                     <Quote className="w-4 h-4 text-orange-500" /> Patient Stories
                  </h3>
                  
                  {/* Colorful Slider Container */}
                  <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50">
                     {doctor.reviews && doctor.reviews.length > 0 ? doctor.reviews.map((review) => (
                        <div key={review.id} className="snap-center min-w-[240px] bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-orange-100 to-transparent rounded-bl-full opacity-50"></div>
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-bold text-slate-800">{review.userName}</span>
                              <div className="flex text-yellow-400 text-[10px]">
                                 {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                 ))}
                              </div>
                           </div>
                           <p className="text-xs text-slate-500 italic mb-2 line-clamp-2">"{review.comment}"</p>
                           <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
                        </div>
                     )) : (
                        <div className="w-full text-center py-4 bg-slate-50 rounded-xl text-xs text-slate-400 italic">No reviews yet.</div>
                     )}
                  </div>
               </div>
            </div>
          )}

          {/* STEP 1: Slots */}
          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
               <div className="flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 text-lg">Select Slot</h3>
                 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Step 1/2</span>
               </div>

               {/* Date Selector Slider */}
               <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Day</p>
                  <div className="flex gap-3 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-50">
                     {dates.map(date => (
                       <button
                         key={date}
                         onClick={() => setSelectedDate(date)}
                         className={`flex-shrink-0 snap-start px-5 py-3 rounded-xl text-sm font-bold border-2 transition-all transform hover:scale-105 active:scale-95 ${
                           selectedDate === date 
                             ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 scale-105' 
                             : 'border-slate-100 text-slate-600 bg-white hover:border-blue-200'
                         }`}
                       >
                         {date}
                       </button>
                     ))}
                  </div>
               </div>

               {/* Time Selector */}
               <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full bg-orange-400"></span> Morning
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                       {morningSlots.map(time => (
                         <button
                           key={time}
                           onClick={() => setSelectedTime(time)}
                           className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                             selectedTime === time 
                               ? 'bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-blue-500/20 shadow-sm' 
                               : 'bg-slate-50 text-slate-700 border-transparent hover:bg-slate-100'
                           }`}
                         >
                           {time}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Evening
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                       {eveningSlots.map(time => (
                         <button
                           key={time}
                           onClick={() => setSelectedTime(time)}
                           className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                             selectedTime === time 
                               ? 'bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-blue-500/20 shadow-sm' 
                               : 'bg-slate-50 text-slate-700 border-transparent hover:bg-slate-100'
                           }`}
                         >
                           {time}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* STEP 2: Patient Details */}
          {step === 2 && (
             <div className="space-y-6 animate-slide-up">
               <div className="flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 text-lg">Patient Details</h3>
                 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Step 2/2</span>
               </div>
               
               {/* Appointment Summary Card */}
               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl flex items-center justify-between border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                        <Calendar className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Appointment On</p>
                        <p className="text-sm font-black text-slate-800">{selectedDate} at {selectedTime}</p>
                     </div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded border border-blue-100 hover:bg-blue-50">Change</button>
               </div>

               {/* Patient Selection Hub - Colorful Slider */}
               <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Who is this for?</label>
                  <div className="flex gap-3 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
                    {/* Self */}
                    <button
                      onClick={() => handleProfileSelect(user.id)}
                      className={`flex-shrink-0 snap-start flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                        selectedProfileId === user.id 
                          ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold shadow-md' 
                          : 'border-slate-100 text-slate-600 font-medium hover:border-slate-300 bg-white'
                      }`}
                    >
                      <User className="w-4 h-4" /> Myself
                    </button>
                    
                    {/* Family Members */}
                    {user.familyMembers?.map(member => (
                       <button
                         key={member.id}
                         onClick={() => handleProfileSelect(member.id)}
                         className={`flex-shrink-0 snap-start flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                           selectedProfileId === member.id 
                             ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold shadow-md' 
                             : 'border-slate-100 text-slate-600 font-medium hover:border-slate-300 bg-white'
                         }`}
                       >
                         <Users className="w-4 h-4" /> {member.name.split(' ')[0]} ({member.relation})
                       </button>
                    ))}

                    {/* Add New */}
                    <button
                      onClick={() => handleProfileSelect('NEW_PATIENT')}
                      className={`flex-shrink-0 snap-start flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed transition-all whitespace-nowrap ${
                        selectedProfileId === 'NEW_PATIENT'
                          ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold shadow-md' 
                          : 'border-slate-300 text-slate-500 font-medium hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 bg-white'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" /> Someone Else
                    </button>
                  </div>
               </div>

               {/* Dynamic Patient Info Form */}
               <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-fade-in">
                  
                  {isNewPatient ? (
                     <div className="grid grid-cols-2 gap-4 animate-slide-down">
                       <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Full Name</label>
                          <input 
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="Patient's Name"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Age</label>
                          <input 
                            type="number"
                            value={newPatientAge}
                            onChange={(e) => setNewPatientAge(e.target.value)}
                            placeholder="Years"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Relation</label>
                          <input 
                            type="text"
                            value={newPatientRelation}
                            onChange={(e) => setNewPatientRelation(e.target.value)}
                            placeholder="e.g. Friend"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                       </div>
                     </div>
                  ) : (
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Patient Name</label>
                      <div className="w-full bg-slate-200/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 flex items-center gap-2 cursor-not-allowed">
                         <User className="w-4 h-4 text-slate-400" /> {patientName}
                      </div>
                    </div>
                  )}

                  {/* Editable Contact Number */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block flex justify-between">
                       <span>Contact Number</span>
                       <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 rounded flex items-center gap-1"><Edit2 className="w-3 h-3"/> Editable</span>
                    </label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="tel"
                         value={contactPhone}
                         onChange={(e) => setContactPhone(e.target.value)}
                         placeholder="+91 00000 00000"
                         className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Symptoms / Reason</label>
                    <textarea 
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g. Fever since 2 days, body ache..."
                      rows={2}
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
               </div>

               <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-sm text-slate-500 font-medium">Consultation Fee</span>
                     <span className="text-sm font-bold text-slate-800">₹{doctor.consultationFee}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-sm text-slate-500 font-medium">Booking Fee</span>
                     <span className="text-sm font-bold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-200">
                     <span className="text-sm font-medium">Total Payable</span>
                     <span className="text-xl font-black">₹{doctor.consultationFee}</span>
                  </div>
               </div>
             </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
             <div className="flex flex-col items-center justify-center text-center py-8 animate-scale-up">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                   <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
                <p className="text-slate-500 mb-8 max-w-xs">Your appointment with <span className="font-bold text-slate-800">{doctor.name}</span> is scheduled successfully.</p>
                
                <div className="bg-slate-50 p-6 rounded-2xl w-full border border-slate-200 mb-8 shadow-sm">
                   <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Date & Time</span>
                      <span className="text-sm font-bold text-slate-800">{selectedDate} • {selectedTime}</span>
                   </div>
                   <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Patient</span>
                      <span className="text-sm font-bold text-slate-800">{patientName}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase">Contact</span>
                      <span className="text-sm font-bold text-slate-800">{contactPhone}</span>
                   </div>
                   <div className="border-t border-slate-200 my-2"></div>
                   <div className="flex justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase">Booking ID</span>
                      <span className="text-sm font-mono text-slate-800">#DOC-{Math.floor(Math.random()*10000)}</span>
                   </div>
                </div>

                <button 
                  onClick={() => { onConfirm(); onClose(); }}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-colors"
                >
                  Back to Home
                </button>
             </div>
          )}

        </div>

        {/* Footer Actions */}
        {step !== 3 && (
           <div className="p-4 border-t border-slate-100 bg-white shadow-[0_-5px_10px_rgba(0,0,0,0.02)] z-10">
             {step === 0 ? (
                <button 
                  onClick={handleNext}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" /> Book Appointment
                </button>
             ) : step === 1 ? (
                <button 
                  disabled={!selectedTime}
                  onClick={handleNext}
                  className="w-full bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  Enter Patient Details <ChevronRight className="w-5 h-5" />
                </button>
             ) : (
                <button 
                  disabled={isProcessing || !patientName || !contactPhone}
                  onClick={handleNext}
                  className="w-full bg-slate-900 disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" /> Confirm & Pay ₹{doctor.consultationFee}
                    </>
                  )}
                </button>
             )}
           </div>
        )}
      </div>
    </div>
  );
};

export default DoctorBookingModal;
