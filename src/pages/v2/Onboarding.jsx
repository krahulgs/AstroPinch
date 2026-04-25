import React, { useState } from 'react';
import { Card, Button, Input } from '../../components/v2/UI';
import { Sparkles, ChevronRight, MapPin, Calendar, Clock } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="h-screen w-full bg-[var(--bg)] flex flex-col relative overflow-hidden max-w-[480px] mx-auto">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-[var(--primary)] opacity-5 blur-[100px] rounded-full"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[40%] bg-[var(--secondary)] opacity-5 blur-[100px] rounded-full"></div>
      </div>

      {step === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
           <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-2xl mb-8 relative">
              <Sparkles size={48} />
              <div className="absolute inset-0 bg-white opacity-20 blur-xl rounded-full animate-pulse"></div>
           </div>
           <h1 className="text-3xl text-center mb-3">AstroPinch</h1>
           <p className="text-[var(--text-sub)] text-center text-base font-medium mb-12">Your cosmic guide, always with you.</p>
           
           <Button onClick={() => setStep(2)} className="w-full h-14 !rounded-2xl">
              Get Started <ChevronRight size={20} className="ml-2" />
           </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col p-6 pt-12 animate-fade-in">
           <div className="mb-10">
              <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest block mb-2">Step 1 of 2</span>
              <h1 className="text-2xl mb-2">When were you born?</h1>
              <p className="text-[var(--text-sub)] text-sm">Your birth details help us create your unique celestial map.</p>
           </div>

           <div className="space-y-6 mb-12">
              <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-sub)]"><Calendar size={20} /></div>
                 <input 
                   type="text" 
                   placeholder="Birth Date (e.g. 25-04-1992)"
                   className="w-full h-16 pl-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm outline-none focus:border-[var(--primary)] transition-all text-base"
                 />
              </div>
              <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-sub)]"><Clock size={20} /></div>
                 <input 
                   type="text" 
                   placeholder="Birth Time (e.g. 10:30 AM)"
                   className="w-full h-16 pl-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm outline-none focus:border-[var(--primary)] transition-all text-base"
                 />
              </div>
              <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-sub)]"><MapPin size={20} /></div>
                 <input 
                   type="text" 
                   placeholder="Birth City (e.g. New Delhi)"
                   className="w-full h-16 pl-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm outline-none focus:border-[var(--primary)] transition-all text-base"
                 />
              </div>
           </div>

           <Button onClick={() => setStep(3)} className="w-full h-14 !rounded-2xl mt-auto">
              Calculate My Chart
           </Button>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
           <div className="w-20 h-20 rounded-full bg-[var(--teal)]/10 text-[var(--teal)] flex items-center justify-center mb-8">
              <Sparkles size={40} />
           </div>
           <h1 className="text-center mb-4">Your profile is ready</h1>
           
           <Card className="w-full bg-[var(--surface)] border-2 border-[var(--primary)]/20 mb-12">
              <div className="flex justify-around items-center py-4">
                 <div className="text-center">
                    <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase block mb-1">Rashi</span>
                    <span className="text-lg font-black text-[var(--primary)]">Mesh</span>
                 </div>
                 <div className="w-[1px] h-10 bg-[var(--border)]"></div>
                 <div className="text-center">
                    <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase block mb-1">Nakshatra</span>
                    <span className="text-lg font-black text-[var(--primary)]">Ashwini</span>
                 </div>
              </div>
           </Card>

           <Button onClick={onComplete} className="w-full h-14 !rounded-2xl">
              Explore AstroPinch
           </Button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
