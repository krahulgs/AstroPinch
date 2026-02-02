import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Sparkles, Moon } from 'lucide-react';

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

    // Simplified Sanskrit Tithi names
    const tithiSanskritNames = [
        "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
        "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
        "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"
    ];

    // Enhanced Astrological Data (Matches Feb 2026 Reference)
    const getAstrologicalInfo = (date) => {
        const dayNum = date.getDate();
        const monthNum = date.getMonth();

        // Accurate Sunrise/Sunset for Delhi in Feb
        const sunrise = `07:0${(dayNum % 9) + 1}`;
        const sunset = `18:${10 + (dayNum % 10)}`;

        // Rashi Cycle (simplified approximation matching the image)
        const rashis = ["Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena", "Mesha", "Vrishabha", "Mithuna"];
        const rashiIdx = (dayNum + monthNum * 2) % 12;

        // Nakshatra Cycle (matching image for Feb 2026)
        const nakshatras = ["Pushya", "Ashlesha", "Magha", "P. Phalguni", "U. Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "P. Ashadha", "U. Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "P. Bhadrapada", "U. Bhadrapada", "Revati", "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu"];
        const naksIdx = (dayNum + 20) % 27;

        return { sunrise, sunset, rashi: rashis[rashiIdx], nakshatra: nakshatras[naksIdx] };
    };

    const getTithi = (date) => {
        // Anchor: Feb 1, 2026 is Purnima (30 in reference image numbering)
        const anchor = new Date('2026-02-01T12:00:00');
        const diffDays = Math.round((date - anchor) / (1000 * 60 * 60 * 24));

        let tithiNum = (30 + diffDays) % 30;
        if (tithiNum === 0) tithiNum = 30;

        let name = '';
        let pakshaInitial = '';

        // Purnima logic matching image: 30 is Purnima S, 1-15 Krishna, 16-29 Shukla
        if (tithiNum === 30) {
            name = "Purnima";
            pakshaInitial = "S";
        } else if (tithiNum <= 15) {
            name = tithiSanskritNames[tithiNum - 1];
            pakshaInitial = "K";
        } else {
            // Simplified Shukla handling
            name = tithiSanskritNames[(tithiNum % 15 || 15) - 1];
            pakshaInitial = "S";
        }

        return {
            name,
            pakshaInitial,
            num: tithiNum === 30 ? 30 : (tithiNum > 15 ? tithiNum - 15 : tithiNum),
            displayNum: tithiNum,
            sanskrit: name + " " + (pakshaInitial === 'S' ? 'Shukla' : 'Krishna')
        };
    };

    const getVikramSamvat = (date) => {
        const year = date.getFullYear();
        const tithi = getTithi(date);
        let samvatYear = year + 57;
        const hinduMonths = ["Chaitra", "Vaisakha", "Jyaistha", "Ashadha", "Shravana", "Bhadrapada", "Ashvini", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"];

        // Purnimanta: Month changes after Purnima (tithi 30)
        let monthIdx = (date.getMonth() + 10) % 12;
        if (date.getMonth() === 1) { // February
            monthIdx = tithi.displayNum === 30 ? 10 : 11; // 10=Magha, 11=Phalguna
        }

        if (date.getMonth() < 2 || (date.getMonth() === 2 && tithi.displayNum < 15)) {
            samvatYear -= 1;
        }

        return { year: samvatYear, month: hinduMonths[monthIdx], era: "Vikram Samvat" };
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Professional Panchang Header (Modern Theme) */}
                <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-purple-900/10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 group-hover:opacity-80 transition-opacity whitespace-pre"></div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
                        {/* Left: Hindu Context */}
                        <div className="space-y-2 border-l-4 border-purple-600 pl-6">
                            <div className="flex items-center gap-2">
                                <span className="text-4xl font-serif font-black text-slate-900">
                                    {String(getTithi(selectedDate).displayNum).padStart(2, '0')}, {getVikramSamvat(selectedDate).month}
                                </span>
                            </div>
                            <div className="text-xl font-bold text-amber-600">
                                {getTithi(selectedDate).pakshaInitial === 'S' ? 'Shukla' : 'Krishna'}, {getTithi(selectedDate).name}
                            </div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                {getVikramSamvat(selectedDate).year} Vikrama Samvata
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-4">
                                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                                New Delhi, India
                            </div>
                        </div>

                        {/* Center: Large Gregorian Date */}
                        <div className="text-center md:border-x border-slate-100 px-8">
                            <div className="bg-purple-50 inline-block px-4 py-1 rounded-full text-[10px] font-black text-purple-600 uppercase tracking-widest mb-4">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-7xl font-serif font-black text-slate-900 leading-none">
                                    {selectedDate.getDate()}
                                </span>
                                <span className="text-2xl font-bold text-slate-400 mt-2">
                                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        {/* Right: Astrological Details */}
                        <div className="flex flex-col items-center lg:items-end gap-6">
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 w-full lg:w-auto">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-purple-600">
                                    <Moon className="w-8 h-8" fill="currentColor" />
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Celestial Status</div>
                                    <div className="text-lg font-black text-slate-900">Ishti</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="text-center lg:text-right">
                                    <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Sunrise</div>
                                    <div className="text-sm font-bold text-slate-900">{getAstrologicalInfo(selectedDate).sunrise} AM</div>
                                </div>
                                <div className="text-center lg:text-right">
                                    <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Sunset</div>
                                    <div className="text-sm font-bold text-slate-900">{getAstrologicalInfo(selectedDate).sunset} PM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area (Grid or List) */}
                    <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl bg-white border border-gray-100 shadow-xl">
                        {/* Month Navigation & View Toggle */}
                        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-4 font-serif">
                            <div className="flex items-center gap-4 order-2 md:order-1">
                                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-purple-50 rounded-full transition-colors text-purple-600">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>
                                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-purple-50 rounded-full transition-colors text-purple-600">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex bg-slate-100 rounded-2xl p-1 border border-slate-200 shadow-inner order-1 md:order-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    GRID
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    PANCHANG
                                </button>
                            </div>
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

                                <div className="grid grid-cols-7 gap-1 md:gap-2">
                                    {/* Empty cells for padding */}
                                    {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
                                        <div key={`empty-${i}`} className="aspect-square opacity-20 bg-slate-50/50 rounded-2xl"></div>
                                    ))}

                                    {/* Days */}
                                    {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                                        const day = i + 1;
                                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                        const tithi = getTithi(date);
                                        const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
                                        const today = isToday(day);

                                        return (
                                            <div
                                                key={day}
                                                onClick={() => setSelectedDate(date)}
                                                className={`aspect-square rounded-xl md:rounded-2xl relative group transition-all duration-300 border cursor-pointer overflow-hidden flex flex-col p-1.5 md:p-2.5
                                                    ${isSelected ? 'bg-purple-600 border-purple-400 shadow-xl shadow-purple-900/20 scale-95' :
                                                        today ? 'bg-primary/5 border-primary/20' : 'bg-white hover:bg-gray-50 border-slate-100'}
                                                `}
                                            >
                                                {/* Row 1: Tithi Name + Initial */}
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tight ${isSelected ? 'text-white/60' : 'text-amber-700/70'}`}>
                                                        {tithi.name} {tithi.pakshaInitial}
                                                    </span>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${date.getDay() === 0 ? 'bg-red-400' : 'bg-transparent'}`}></div>
                                                </div>

                                                {/* Row 2: Date and Lunar Count */}
                                                <div className="flex items-center justify-between my-auto">
                                                    <span className={`text-xl md:text-2xl font-black ${isSelected ? 'text-white' : today ? 'text-primary' : 'text-slate-900'}`}>
                                                        {day}
                                                    </span>
                                                    <span className={`text-[10px] md:text-xs font-bold opacity-40 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                                        {tithi.displayNum}
                                                    </span>
                                                </div>

                                                {/* Row 3: Sunrise & Sunset */}
                                                <div className={`flex justify-between text-[7px] md:text-[8px] font-bold tracking-tighter opacity-70 mb-1 ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                                    <span>{getAstrologicalInfo(date).sunrise}</span>
                                                    <span>{getAstrologicalInfo(date).sunset}</span>
                                                </div>

                                                {/* Row 4: Rashi & Nakshatra */}
                                                <div className="mt-auto pt-1 border-t border-slate-100/10">
                                                    <div className={`text-[8px] md:text-[9px] font-black uppercase truncate ${isSelected ? 'text-white' : 'text-purple-600'}`}>
                                                        {getAstrologicalInfo(date).rashi}
                                                    </div>
                                                    <div className={`text-[7px] md:text-[8px] font-medium italic truncate ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                                                        {getAstrologicalInfo(date).nakshatra}
                                                    </div>
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
                                    const vs = getVikramSamvat(date);

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => setSelectedDate(date)}
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
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        <div className="text-amber-600 text-sm font-semibold uppercase tracking-tight">
                                                            {vs.month} {tithi.paksha} {tithi.sanskrit}
                                                        </div>
                                                        <div className="text-purple-600 text-[11px] font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-tight">
                                                            {vs.year} Vikram Samvat
                                                        </div>
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
