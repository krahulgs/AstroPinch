import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Sparkles } from 'lucide-react';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [userRegion, setUserRegion] = useState({ code: 'global', name: 'Global', timezone: 'UTC' });
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Festival Database (2026-2027 Focus)
    const festivalDatabase = {
        'IN': [
            // --- 2026 Datasets ---
            { date: '2026-01-14', name: 'Makar Sankranti', type: 'Hindu' },
            { date: '2026-01-26', name: 'Republic Day', type: 'National' },
            { date: '2026-02-16', name: 'Maha Shivaratri', type: 'Hindu' },
            { date: '2026-03-04', name: 'Holi', type: 'Hindu' },
            { date: '2026-03-24', name: 'Ram Navami', type: 'Hindu' },
            { date: '2026-04-14', name: 'Ambedkar Jayanti', type: 'National' },
            { date: '2026-04-14', name: 'Baisakhi', type: 'Regional' },
            { date: '2026-08-15', name: 'Independence Day', type: 'National' },
            { date: '2026-08-27', name: 'Raksha Bandhan', type: 'Hindu' },
            { date: '2026-09-04', name: 'Janmashtami', type: 'Hindu' },
            { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National' },
            { date: '2026-10-20', name: 'Dussehra', type: 'Hindu' },
            { date: '2026-11-09', name: 'Diwali', type: 'Hindu' },
            { date: '2026-11-10', name: 'Govardhan Puja', type: 'Hindu' },
            { date: '2026-11-11', name: 'Bhai Dooj', type: 'Hindu' },
            { date: '2026-12-25', name: 'Christmas', type: 'Christian' },

            // 2026 Vratas
            { date: '2026-01-03', name: 'Paush Purnima', type: 'Vrat' },
            { date: '2026-01-15', name: 'Shattila Ekadashi', type: 'Vrat' },
            { date: '2026-01-30', name: 'Jaya Ekadashi', type: 'Vrat' },
            { date: '2026-02-13', name: 'Vijaya Ekadashi', type: 'Vrat' },
            { date: '2026-02-28', name: 'Amalaki Ekadashi', type: 'Vrat' },
            { date: '2026-03-14', name: 'Papmochani Ekadashi', type: 'Vrat' },
            { date: '2026-03-29', name: 'Kamada Ekadashi', type: 'Vrat' },
            { date: '2026-07-29', name: 'Guru Purnima', type: 'Vrat' },
            { date: '2026-10-29', name: 'Karwa Chauth', type: 'Vrat' },

            // --- 2027 Datasets ---
            { date: '2027-01-14', name: 'Makar Sankranti', type: 'Hindu' },
            { date: '2027-01-26', name: 'Republic Day', type: 'National' },
            { date: '2027-03-06', name: 'Maha Shivaratri', type: 'Hindu' },
            { date: '2027-03-22', name: 'Holi', type: 'Hindu' },
            { date: '2027-04-15', name: 'Ram Navami', type: 'Hindu' },
            { date: '2027-08-15', name: 'Independence Day', type: 'National' },
            { date: '2027-08-17', name: 'Raksha Bandhan', type: 'Hindu' },
            { date: '2027-08-25', name: 'Janmashtami', type: 'Hindu' },
            { date: '2027-10-02', name: 'Gandhi Jayanti', type: 'National' },
            { date: '2027-10-09', name: 'Dussehra', type: 'Hindu' },
            { date: '2027-10-29', name: 'Diwali', type: 'Hindu' },
            { date: '2027-12-25', name: 'Christmas', type: 'Christian' }
        ],
        'US': [
            // --- 2026 Datasets ---
            { date: '2026-01-01', name: 'New Year\'s Day', type: 'Federal' },
            { date: '2026-01-19', name: 'MLK Day', type: 'Federal' },
            { date: '2026-02-16', name: 'Presidents\' Day', type: 'Federal' },
            { date: '2026-05-25', name: 'Memorial Day', type: 'Federal' },
            { date: '2026-06-19', name: 'Juneteenth', type: 'Federal' },
            { date: '2026-07-04', name: 'Independence Day', type: 'Federal' },
            { date: '2026-09-07', name: 'Labor Day', type: 'Federal' },
            { date: '2026-10-12', name: 'Columbus Day', type: 'Federal' },
            { date: '2026-11-11', name: 'Veterans Day', type: 'Federal' },
            { date: '2026-11-26', name: 'Thanksgiving', type: 'Federal' },
            { date: '2026-12-25', name: 'Christmas', type: 'Christian' },

            // --- 2027 Datasets ---
            { date: '2027-01-01', name: 'New Year\'s Day', type: 'Federal' },
            { date: '2027-01-18', name: 'MLK Day', type: 'Federal' },
            { date: '2027-02-15', name: 'Presidents\' Day', type: 'Federal' },
            { date: '2027-05-31', name: 'Memorial Day', type: 'Federal' },
            { date: '2027-06-19', name: 'Juneteenth', type: 'Federal' },
            { date: '2027-07-04', name: 'Independence Day', type: 'Federal' },
            { date: '2027-09-06', name: 'Labor Day', type: 'Federal' },
            { date: '2027-11-11', name: 'Veterans Day', type: 'Federal' },
            { date: '2027-11-25', name: 'Thanksgiving', type: 'Federal' },
            { date: '2027-12-25', name: 'Christmas', type: 'Christian' }
        ],
        'global': [
            // --- 2026 ---
            { date: '2026-01-01', name: 'New Year\'s Day', type: 'Global' },
            { date: '2026-03-20', name: 'Spring Equinox', type: 'Astronomical' },
            { date: '2026-06-21', name: 'Summer Solstice', type: 'Astronomical' },
            { date: '2026-09-22', name: 'Autumn Equinox', type: 'Astronomical' },
            { date: '2026-12-21', name: 'Winter Solstice', type: 'Astronomical' },

            // --- 2027 ---
            { date: '2027-01-01', name: 'New Year\'s Day', type: 'Global' },
            { date: '2027-03-20', name: 'Spring Equinox', type: 'Astronomical' },
            { date: '2027-06-21', name: 'Summer Solstice', type: 'Astronomical' },
            { date: '2027-09-23', name: 'Autumn Equinox', type: 'Astronomical' },
            { date: '2027-12-21', name: 'Winter Solstice', type: 'Astronomical' }
        ]
    };

    useEffect(() => {
        // Detect System Zone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        let regionCode = 'global';
        let regionName = 'Global';

        if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('India')) {
            regionCode = 'IN';
            regionName = 'India';
        } else if (tz.includes('America') || tz.includes('USA') || tz.includes('New_York') || tz.includes('Los_Angeles')) {
            regionCode = 'US';
            regionName = 'United States';
        }

        setUserRegion({ code: regionCode, name: regionName, timezone: tz });
    }, []);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const changeMonth = (increment) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setCurrentDate(newDate);
    };

    const getFestivalsForDate = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Combine Global + Regional
        const regional = festivalDatabase[userRegion.code] || [];
        const global = festivalDatabase['global'] || [];
        const allFestivals = [...regional, ...global];

        // Remove duplicates if any (prioritize regional)
        return allFestivals.filter(f => f.date === dateStr);
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const getMuhuratData = (date) => {
        const dayIndex = date.getDay(); // 0 = Sun, 1 = Mon...

        // Approximate timing relative to 6:00 AM Sunrise
        // Real implementation would calculate based on actual sunrise/sunset
        const timings = {
            0: { rahu: '16:30 - 18:00', yama: '12:00 - 13:30', abhijit: '11:57 - 12:48' }, // Sun
            1: { rahu: '07:30 - 09:00', yama: '10:30 - 12:00', abhijit: '11:57 - 12:48' }, // Mon
            2: { rahu: '15:00 - 16:30', yama: '09:00 - 10:30', abhijit: '11:57 - 12:48' }, // Tue
            3: { rahu: '12:00 - 13:30', yama: '07:30 - 09:00', abhijit: '11:57 - 12:48' }, // Wed
            4: { rahu: '13:30 - 15:00', yama: '06:00 - 07:30', abhijit: '11:57 - 12:48' }, // Thu
            5: { rahu: '10:30 - 12:00', yama: '15:00 - 16:30', abhijit: '11:57 - 12:48' }, // Fri
            6: { rahu: '09:00 - 10:30', yama: '13:30 - 15:00', abhijit: '11:57 - 12:48' }  // Sat
        };

        return timings[dayIndex];
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    // Simple Tithi Calculation (Approximation based on Moon Phase)
    const getTithi = (date) => {
        const knownNewMoon = new Date('2000-01-06T12:24:00'); // Reference New Moon
        const daysSince = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
        const lunarCycle = 29.530588;
        const phase = daysSince % lunarCycle;
        const tithi = Math.floor((phase / lunarCycle) * 30) + 1;

        let tithiName = '';
        let paksha = '';

        if (tithi <= 15) {
            paksha = 'Shukla Paksha';
            tithiName = tithi === 15 ? 'Purnima' : `Shukla ${tithi}`;
        } else {
            paksha = 'Krishna Paksha';
            const kTithi = tithi - 15;
            tithiName = kTithi === 15 ? 'Amavasya' : `Krishna ${kTithi}`;
        }

        return { name: tithiName, paksha };
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">
                        Cosmic Calendar
                    </h1>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span className="text-secondary text-sm">
                                Region: <span className="font-bold text-primary">{userRegion.name}</span>
                                <span className="text-slate-500 ml-2 text-xs">({userRegion.timezone})</span>
                            </span>
                        </div>

                        {userRegion.code === 'IN' && (
                            <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-primary hover:bg-gray-50'}`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-primary hover:bg-gray-50'}`}
                                >
                                    Panchang
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area (Grid or List) */}
                    <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl bg-white border border-gray-100 shadow-xl">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-8">
                            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-primary">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-primary">
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-primary">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        {viewMode === 'grid' ? (
                            <>
                                {/* Weekday Headers */}
                                <div className="grid grid-cols-7 mb-4">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
                                        const hindiDays = ['Ravivar', 'Somvar', 'Mangalwar', 'Budhwar', 'Guruwar', 'Shukrawar', 'Shaniwar'];
                                        return (
                                            <div key={day} className="text-center py-2">
                                                <div className="text-xs font-bold text-purple-600 uppercase tracking-widest">{day}</div>
                                                {userRegion.code === 'IN' && (
                                                    <div className="text-[10px] text-purple-600/60 font-medium">{hindiDays[idx]}</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-7 gap-2">
                                    {/* Empty cells for padding */}
                                    {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
                                        <div key={`empty-${i}`} className="aspect-square"></div>
                                    ))}

                                    {/* Days */}
                                    {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                                        const day = i + 1;
                                        const festivals = getFestivalsForDate(day);
                                        const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
                                        const today = isToday(day);

                                        return (
                                            <div
                                                key={day}
                                                onClick={() => handleDateClick(day)}
                                                className={`aspect-square rounded-xl relative group transition-all duration-300 border cursor-pointer overflow-hidden flex flex-col p-1 gap-0.5
                                                    ${isSelected ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-900/20 scale-95' :
                                                        today ? 'bg-primary/5 border-primary/20' : 'bg-white hover:bg-gray-50 border-gray-100'}
                                                `}
                                            >
                                                <div className={`text-sm font-semibold ml-1 ${isSelected ? 'text-white' : today ? 'text-primary' : 'text-secondary'}`}>
                                                    {day}
                                                </div>

                                                {/* Festival Names Display */}
                                                <div className="flex flex-col gap-0.5 mt-0.5 overflow-hidden">
                                                    {festivals.slice(0, 2).map((f, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`text-[8px] sm:text-[9px] px-1 py-0.5 rounded truncate leading-tight font-medium
                                                                ${f.type === 'National' || f.type === 'Federal' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                                    f.type === 'Vrat' ? 'bg-pink-100 text-pink-700 border border-pink-200' :
                                                                        'bg-amber-100 text-amber-700 border border-amber-200'}
                                                            `}
                                                            title={f.name}
                                                        >
                                                            {f.name}
                                                        </div>
                                                    ))}
                                                    {festivals.length > 2 && (
                                                        <div className="text-[8px] text-slate-400 px-1">+ {festivals.length - 2} more</div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            /* Panchang List View */
                            <div className="space-y-3">
                                {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                                    const day = i + 1;
                                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                    const dayOfWeek = date.getDay();
                                    const hindiDays = ['Ravivar', 'Somvar', 'Mangalwar', 'Budhwar', 'Guruwar', 'Shukrawar', 'Shaniwar'];
                                    const tithi = getTithi(date);
                                    const festivals = getFestivalsForDate(day);
                                    const today = isToday(day);
                                    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => handleDateClick(day)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                                                ${isSelected ? 'bg-amber-50 border-amber-500/50' : today ? 'bg-primary/5 border-primary/20' : 'bg-white border-gray-100 hover:bg-gray-50'}
                                            `}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="text-center w-12">
                                                    <div className="text-xs text-secondary uppercase font-bold">{date.toLocaleString('default', { month: 'short' })}</div>
                                                    <div className="text-2xl font-black text-primary">{day}</div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-primary font-bold text-lg">{hindiDays[dayOfWeek]}</span>
                                                        <span className="text-secondary text-sm">({date.toLocaleDateString('en-US', { weekday: 'long' })})</span>
                                                    </div>
                                                    <div className="text-amber-600 text-sm font-medium">
                                                        {tithi.name} <span className="text-slate-400">•</span> {tithi.paksha}
                                                    </div>
                                                </div>
                                            </div>

                                            {festivals.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                                                    {festivals.map((f, idx) => (
                                                        <span key={idx} className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                                                            ${f.type === 'Vrat' ? 'bg-pink-100 text-pink-700 border-pink-200' : 'bg-amber-100 text-amber-700 border-amber-200'}
                                                        `}>
                                                            {f.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-slate-500 font-medium uppercase tracking-widest">Normal Day</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Events & Muhurat */}
                    <div className="space-y-6">
                        {/* Daily Muhurat Card */}
                        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-white border border-gray-100 shadow-xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <CalendarIcon className="w-24 h-24 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-1">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h3>
                            <p className="text-xs text-purple-600 uppercase tracking-wider mb-6">Daily Time Blocks</p>

                            <div className="space-y-4">
                                {(() => {
                                    const timings = getMuhuratData(selectedDate);
                                    return (
                                        <>
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm text-green-600 font-bold">Abhijit Muhurat</span>
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">Good</span>
                                                </div>
                                                <div className="text-xl font-bold text-primary tracking-wide">{timings.abhijit}</div>
                                                <div className="text-[10px] text-secondary mt-1">Best time for new beginnings</div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm text-red-600 font-bold">Rahu Kaal</span>
                                                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase">Avoid</span>
                                                </div>
                                                <div className="text-xl font-bold text-primary tracking-wide">{timings.rahu}</div>
                                                <div className="text-[10px] text-secondary mt-1">Inauspicious for starting new work</div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm text-orange-600 font-bold">Yamaganda</span>
                                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase">Caution</span>
                                                </div>
                                                <div className="text-xl font-bold text-primary tracking-wide">{timings.yama}</div>
                                                <div className="text-[10px] text-secondary mt-1">Period of potential loss</div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Upcoming Events List */}
                        <div className="glass-panel p-6 rounded-3xl bg-white border border-gray-100 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <h3 className="text-xl font-bold text-primary">Upcoming Events</h3>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {(() => {
                                    const events = [];
                                    const daysInMonth = getDaysInMonth(currentDate); // Show for selected month
                                    for (let d = 1; d <= daysInMonth; d++) {
                                        const fests = getFestivalsForDate(d);
                                        if (fests.length > 0) {
                                            fests.forEach(f => events.push({ ...f, day: d }));
                                        }
                                    }

                                    if (events.length === 0) return <div className="text-secondary text-sm text-center py-4">No events this month.</div>;

                                    return events.map((event, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-amber-200 transition-colors">
                                            <div className="flex-shrink-0 w-10 text-center bg-white rounded-lg py-1 border border-gray-200">
                                                <div className="text-[10px] text-secondary uppercase font-bold">{currentDate.toLocaleString('default', { month: 'short' })}</div>
                                                <div className="text-sm font-bold text-primary">{event.day}</div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-primary">{event.name}</h4>
                                                <span className={`inline-block mt-0.5 px-1.5 py-0.5 text-[8px] rounded-full uppercase tracking-wider border 
                                                    ${event.type === 'Vrat' ? 'bg-pink-100 text-pink-700 border-pink-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                                    {event.type}
                                                </span>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
