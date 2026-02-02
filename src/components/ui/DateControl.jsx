import React from 'react';
import { Star } from 'lucide-react';

const DateControl = ({ date, onChange, label = "Date of Birth" }) => {
    // Helper: Parse the date string into a Date object. default to 1995-01-01 if empty/invalid
    const parseDate = (d) => (d ? new Date(d) : new Date(1995, 0, 1));

    const getDay = (d) => parseDate(d).getDate().toString().padStart(2, '0');
    const getMonthName = (d) => parseDate(d).toLocaleString('default', { month: 'short' });
    const getYear = (d) => parseDate(d).getFullYear();
    const getMonthNum = (d) => parseDate(d).getMonth() + 1;

    // Adjust date by increment/decrement
    const adjustDate = (part, amount) => {
        const currentData = parseDate(date);

        if (part === 'day') {
            currentData.setDate(currentData.getDate() + amount);
        } else if (part === 'month') {
            currentData.setMonth(currentData.getMonth() + amount);
        } else if (part === 'year') {
            currentData.setFullYear(currentData.getFullYear() + amount);
        }

        // Prevent future dates
        const today = new Date();
        if (currentData > today) return;

        onChange(currentData.toISOString().split('T')[0]);
    };

    // Handle direct input change
    const handleDatePartChange = (part, value) => {
        const currentData = parseDate(date);
        const val = parseInt(value) || 0;

        if (part === 'day') currentData.setDate(val);
        else if (part === 'month') currentData.setMonth(val - 1);
        else if (part === 'year') currentData.setFullYear(val);

        const today = new Date();
        if (currentData > today) return;
        onChange(currentData.toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-2">
            <label className="text-amber-900/70 text-sm font-bold ml-1 uppercase tracking-wider">{label}</label>
            <div className="p-4 bg-amber-50/40 rounded-[2rem] border border-amber-200/50 shadow-sm relative group transition-all hover:bg-white hover:border-amber-300">
                <div className="flex items-center justify-center gap-4 py-2">
                    {/* Day Card */}
                    <div className="flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => adjustDate('day', 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-amber-100 rounded-full text-amber-600 transition-colors mb-1"
                        >
                            <Star className="w-3 h-3" />
                        </button>
                        <div className="bg-white px-2 py-3 rounded-2xl border border-amber-100 shadow-sm min-w-[64px] text-center focus-within:ring-2 focus-within:ring-amber-500/20">
                            <input
                                type="number"
                                value={getDay(date)}
                                onChange={(e) => handleDatePartChange('day', e.target.value)}
                                className="w-full text-3xl font-black text-amber-700 tracking-tighter tabular-nums bg-transparent border-none text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-amber-600/40">Day</div>
                        <button
                            type="button"
                            onClick={() => adjustDate('day', -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-amber-100 rounded-full text-amber-600 transition-colors mt-1"
                        >
                            <Star className="w-3 h-3 rotate-180" />
                        </button>
                    </div>

                    {/* Month Card */}
                    <div className="flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => adjustDate('month', 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-amber-100 rounded-full text-amber-600 transition-colors mb-1"
                        >
                            <Star className="w-3 h-3" />
                        </button>
                        <div className="bg-white px-2 py-3 rounded-2xl border border-amber-100 shadow-sm min-w-[80px] text-center focus-within:ring-2 focus-within:ring-amber-500/20 relative">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-amber-700 uppercase opacity-0">{getMonthName(date)}</span>
                            </div>
                            <input
                                type="number"
                                value={getMonthNum(date)}
                                onChange={(e) => handleDatePartChange('month', e.target.value)}
                                className="w-full text-3xl font-black text-amber-700 tracking-tighter tabular-nums bg-transparent border-none text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="1" max="12"
                            />
                            <div className="text-[8px] font-bold text-amber-400 absolute -top-1 left-1/2 -translate-x-1/2 bg-white px-1">{getMonthName(date)}</div>
                        </div>
                        <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-amber-600/40">Mon</div>
                        <button
                            type="button"
                            onClick={() => adjustDate('month', -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-amber-100 rounded-full text-amber-600 transition-colors mt-1"
                        >
                            <Star className="w-3 h-3 rotate-180" />
                        </button>
                    </div>

                    {/* Year Card */}
                    <div className="flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => adjustDate('year', 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-amber-100 rounded-full text-amber-600 transition-colors mb-1"
                        >
                            <Star className="w-3 h-3" />
                        </button>
                        <div className="bg-white px-2 py-3 rounded-2xl border border-amber-100 shadow-sm min-w-[88px] text-center focus-within:ring-2 focus-within:ring-amber-500/20">
                            <input
                                type="number"
                                value={getYear(date)}
                                onChange={(e) => handleDatePartChange('year', e.target.value)}
                                className="w-full text-3xl font-black text-amber-700 tracking-tighter tabular-nums bg-transparent border-none text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-amber-600/40">Year</div>
                        <button
                            type="button"
                            onClick={() => adjustDate('year', -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-amber-100 rounded-full text-amber-600 transition-colors mt-1"
                        >
                            <Star className="w-3 h-3 rotate-180" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateControl;
