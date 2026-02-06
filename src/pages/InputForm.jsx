import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChart } from '../context/ChartContext';
import { User, Calendar, Clock, Loader2 } from 'lucide-react';
import CitySearch from '../components/ui/CitySearch';
import SEO from '../components/SEO';

const InputForm = () => {
    const navigate = useNavigate();
    const { saveUserData, loading, error: serverError } = useChart();

    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);
    const hourRef = useRef(null);
    const minuteRef = useRef(null);
    const cityRef = useRef(null);

    const [dateParts, setDateParts] = useState({
        day: '',
        month: '',
        year: ''
    });
    const [timeParts, setTimeParts] = useState({
        hour: '',
        minute: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        place: '',
        lat: '',
        lng: '',
        timezone: ''
    });

    // Assuming setProgress is defined elsewhere or needs to be added.
    // For the purpose of this edit, I'll assume it's available or a placeholder.
    const [progress, setProgress] = useState(0); // Added for context, assuming it's part of the original code or implied.

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Assemble date and time
        const dateStr = `${dateParts.year}-${dateParts.month.padStart(2, '0')}-${dateParts.day.padStart(2, '0')}`;
        const timeStr = `${timeParts.hour.padStart(2, '0')}:${timeParts.minute.padStart(2, '0')}`;

        // Final validation for future date
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            alert('Date of Birth cannot be in the future');
            return;
        }

        const finalData = {
            ...formData,
            date: dateStr,
            time: timeStr
        };

        // Simulate progress while fetching
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                const increment = Math.floor(Math.random() * 5) + 2;
                return Math.min(prev + increment, 95);
            });
        }, 300);

        try {
            const success = await saveUserData(finalData);
            if (success) {
                setProgress(100);
                setTimeout(() => {
                    navigate('/consolidated-report');
                }, 500);
            }
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            clearInterval(interval);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            // Limit length to 60 characters
            let filteredValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 60);
            // Apply Title Case (capitalize first letter of each word)
            filteredValue = filteredValue.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
            setFormData({ ...formData, [name]: filteredValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-transparent">
            <SEO
                title="Create Your Free Kundali"
                description="Enter your birth details to generate your free Vedic birth chart (Kundali) and get personalized life predictions."
                url="/chart"
            />
            <div className="max-w-2xl mx-auto pt-10 pb-20 px-4 relative z-10">
                <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden border border-primary/10 shadow-lg">
                    {/* Glow Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 blur-3xl rounded-full -ml-20 -mb-20"></div>

                    <h2 className="text-3xl font-bold mb-8 text-center text-primary">
                        Enter Birth Details
                    </h2>

                    {serverError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm text-center">
                            Failed to connect to the server. Please ensure the backend is running.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-secondary text-sm font-medium ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    maxLength="60"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                    placeholder="Enter Your Full Name."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-secondary text-sm font-medium ml-1">Date of Birth</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <input
                                            ref={dayRef}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="2"
                                            placeholder="DD"
                                            autoComplete="off"
                                            required
                                            value={dateParts.day}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                                if (val === '00') return;
                                                setDateParts({ ...dateParts, day: val });
                                            }}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="relative flex-1 group">
                                        <input
                                            ref={monthRef}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="2"
                                            placeholder="MM"
                                            autoComplete="off"
                                            required
                                            value={dateParts.month}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                                if (val === '00') return;
                                                setDateParts({ ...dateParts, month: val });
                                            }}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="relative flex-[1.5] group">
                                        <input
                                            ref={yearRef}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="4"
                                            placeholder="YYYY"
                                            autoComplete="off"
                                            required
                                            value={dateParts.year}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                setDateParts({ ...dateParts, year: val });
                                            }}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-secondary text-sm font-medium ml-1">Time of Birth (24 Hrs.)</label>
                                <div className="flex gap-2 relative">
                                    <Clock className="absolute left-4 top-3.5 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors pointer-events-none z-10" />
                                    <div className="relative flex-1 group ml-10">
                                        <input
                                            ref={hourRef}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="2"
                                            placeholder="HH"
                                            autoComplete="off"
                                            required
                                            value={timeParts.hour}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                                if (parseInt(val) > 23) return;
                                                setTimeParts({ ...timeParts, hour: val });
                                            }}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="relative flex-1 group">
                                        <input
                                            ref={minuteRef}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="2"
                                            placeholder="MM"
                                            autoComplete="off"
                                            required
                                            value={timeParts.minute}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                                if (parseInt(val) > 59) return;
                                                setTimeParts({ ...timeParts, minute: val });
                                            }}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-secondary text-sm font-medium ml-1">Place of Birth</label>
                            <CitySearch
                                inputRef={cityRef}
                                onSelect={(city) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        place: `${city.name}, ${city.country}`,
                                        lat: city.latitude,
                                        lng: city.longitude,
                                        timezone: city.timezone
                                    }));
                                }}
                                defaultValue={formData.place}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative bg-gradient-to-r from-primary to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] hover:shadow-primary/50 transition-all duration-300 mt-6 disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                        >
                            {/* Progress Fill */}
                            {loading && (
                                <div
                                    className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            )}

                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? `Aligning Stars... ${progress}%` : 'Reveal My Chart'}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InputForm;
