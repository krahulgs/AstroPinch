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
    const timeRef = useRef(null);
    const cityRef = useRef(null);

    const [progress, setProgress] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        place: '',
        lat: '',
        lng: '',
        timezone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation for future date
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            alert('Date of Birth cannot be in the future');
            return;
        }

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

        const report = await saveUserData(formData);

        clearInterval(interval);

        if (report) {
            setProgress(100);
            setTimeout(() => {
                navigate('/report/consolidated', { state: { userData: formData, preFetchedReport: report } });
            }, 500);
        } else {
            setProgress(0);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            // Remove numeric values and special characters, allow only letters and spaces
            const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
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
                                    value={formData.name}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            dayRef.current?.focus();
                                        }
                                    }}
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
                                            required
                                            value={formData.date ? formData.date.split('-')[2] : ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                                if (val === '00') return; // Prevent 00
                                                const parts = (formData.date || '1995-01-01').split('-');
                                                setFormData({ ...formData, date: `${parts[0]}-${parts[1]}-${val}` });
                                                if (val.length === 2) monthRef.current?.focus();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !e.currentTarget.value) {
                                                    // Already handled by component order if needed, but DD is first
                                                }
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
                                            required
                                            value={formData.date ? formData.date.split('-')[1] : ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                                if (val === '00') return; // Prevent 00
                                                const parts = (formData.date || '1995-01-01').split('-');
                                                setFormData({ ...formData, date: `${parts[0]}-${val}-${parts[2]}` });
                                                if (val.length === 2) yearRef.current?.focus();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !e.currentTarget.value) {
                                                    dayRef.current?.focus();
                                                }
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
                                            required
                                            value={formData.date ? formData.date.split('-')[0] : ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                const parts = (formData.date || '1995-01-01').split('-');
                                                setFormData({ ...formData, date: `${val}-${parts[1]}-${parts[2]}` });
                                                if (val.length === 4) timeRef.current?.focus();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !e.currentTarget.value) {
                                                    monthRef.current?.focus();
                                                }
                                            }}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-secondary text-sm font-medium ml-1">Time of Birth (24 Hrs.)</label>
                                <div className="relative group">
                                    <Clock className="absolute left-4 top-3.5 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                                    <input
                                        ref={timeRef}
                                        type="time"
                                        name="time"
                                        required
                                        value={formData.time}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // Optional: Move to city search after time selection? 
                                            // Time input behavior differs, but if they pick a time it usually triggers.
                                            if (e.target.value) {
                                                // Small delay to let browser close picker
                                                setTimeout(() => cityRef.current?.focus(), 100);
                                            }
                                        }}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                    />
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
