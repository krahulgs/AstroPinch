import React, { useEffect } from 'react';
import { Star, Clock } from 'lucide-react';

const TimeControl = ({ time, amPm, onTimeChange, onAmPmChange, label = "Time of Birth" }) => {
    // Helper to get H and M from time string "HH:MM"
    const parseTime = (t) => {
        const [h, m] = (t || '12:00').split(':').map(Number);
        return { h, m };
    };

    const adjustTime = (type, amount) => {
        const { h, m } = parseTime(time);

        if (type === 'hour') {
            let h12 = h % 12 || 12;
            let newH12 = ((h12 - 1 + amount + 12) % 12) + 1;
            // Convert back to 24h for storage
            let newH24 = amPm === 'PM' ? (newH12 === 12 ? 12 : newH12 + 12) : (newH12 === 12 ? 0 : newH12);
            onTimeChange(`${newH24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        } else {
            let newM = (m + amount + 60) % 60;
            onTimeChange(`${h.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`);
        }
    };

    const handleTimePartChange = (part, value) => {
        const { h, m } = parseTime(time);
        const val = parseInt(value) || 0;

        if (part === 'hour') {
            // value entered is likely 1-12
            let h12 = val % 12 || 12; // clamp simple logic, logic could be more complex depending on UX preference
            let newH24 = amPm === 'PM' ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
            onTimeChange(`${newH24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        } else {
            let newM = Math.min(59, Math.max(0, val));
            onTimeChange(`${h.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-secondary text-sm font-medium ml-1">{label}</label>
            <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-200/50 shadow-inner relative group transition-all hover:bg-white hover:border-primary/30">
                <div className="flex items-center justify-around">
                    {/* Hours */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            type="button"
                            onClick={() => adjustTime('hour', 1)}
                            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                        >
                            <Star className="w-4 h-4 rotate-0" />
                        </button>
                        <div className="relative">
                            <div className="bg-white/50 px-2 py-1 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent focus-within:border-primary/20">
                                <input
                                    type="number"
                                    value={(parseInt(parseTime(time).h) % 12 || 12).toString().padStart(2, '0')}
                                    onChange={(e) => handleTimePartChange('hour', e.target.value)}
                                    className="w-16 text-4xl font-black text-primary tracking-tighter tabular-nums bg-transparent border-none text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min="1" max="12"
                                />
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-widest text-secondary/50">Hrs</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => adjustTime('hour', -1)}
                            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                        >
                            <Star className="w-4 h-4 rotate-180" />
                        </button>
                    </div>

                    <div className="text-4xl font-black text-slate-300 mb-6">:</div>

                    {/* Minutes */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            type="button"
                            onClick={() => adjustTime('minute', 1)}
                            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                        >
                            <Star className="w-4 h-4" />
                        </button>
                        <div className="relative">
                            <div className="bg-white/50 px-2 py-1 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent focus-within:border-primary/20">
                                <input
                                    type="number"
                                    value={parseTime(time).m.toString().padStart(2, '0')}
                                    onChange={(e) => handleTimePartChange('minute', e.target.value)}
                                    className="w-16 text-4xl font-black text-primary tracking-tighter tabular-nums bg-transparent border-none text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min="0" max="59"
                                />
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-widest text-secondary/50">Min</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => adjustTime('minute', -1)}
                            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                        >
                            <Star className="w-4 h-4 rotate-180" />
                        </button>
                    </div>

                    {/* AM/PM Toggle */}
                    <div className="flex flex-col gap-2 ml-4">
                        <button
                            type="button"
                            onClick={() => onAmPmChange('AM')}
                            className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${amPm === 'AM' ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'text-secondary hover:bg-white border border-transparent hover:border-slate-200'}`}
                        >
                            AM
                        </button>
                        <button
                            type="button"
                            onClick={() => onAmPmChange('PM')}
                            className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${amPm === 'PM' ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'text-secondary hover:bg-white border border-transparent hover:border-slate-200'}`}
                        >
                            PM
                        </button>
                    </div>
                </div>

                {/* Subtle Helper Text */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center gap-6">
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1 uppercase tracking-wider">
                        <Clock className="w-3 h-3" /> Precision matters for accurate chart
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TimeControl;
