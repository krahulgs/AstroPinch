import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChart } from '../context/ChartContext';
import { Star, MapPin, Orbit, Moon, Sun, Sparkles, User, Calendar, Clock, Loader2 } from 'lucide-react';
import CitySearch from '../components/ui/CitySearch';

const InputForm = () => {
    const navigate = useNavigate();
    const { saveUserData, loading, error: serverError } = useChart();

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

        // The time is already stored in 24h format in formData.time
        const success = await saveUserData(formData);
        if (success) {
            navigate('/birth-chart');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };




    const symbols = [
        { char: '♈', top: '10%', left: '5%', size: 'text-4xl' },
        { char: '♉', top: '20%', left: '85%', size: 'text-3xl' },
        { char: '♊', top: '45%', left: '2%', size: 'text-5xl' },
        { char: '♋', top: '75%', left: '8%', size: 'text-3xl' },
        { char: '♌', top: '85%', left: '90%', size: 'text-4xl' },
        { char: '♍', top: '15%', left: '40%', size: 'text-2xl' },
        { char: '♎', top: '5%', left: '70%', size: 'text-3xl' },
        { char: '♏', top: '60%', left: '95%', size: 'text-4xl' },
        { char: '♐', top: '35%', left: '88%', size: 'text-2xl' },
        { char: '♑', top: '92%', left: '15%', size: 'text-5xl' },
        { char: '♒', top: '25%', left: '12%', size: 'text-3xl' },
        { char: '♓', top: '65%', left: '5%', size: 'text-2xl' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50">
            {/* Astronomical Background Symbols */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                {symbols.map((s, i) => (
                    <span
                        key={i}
                        className={`absolute ${s.size} text-primary/10 font-serif animate-pulse-slow`}
                        style={{
                            top: s.top,
                            left: s.left,
                            animationDelay: `${i * 0.7}s`,
                            transform: `rotate(${i * 30}deg)`
                        }}
                    >
                        {s.char}
                    </span>
                ))}

                {/* Floating Lucide Icons */}
                <Orbit className="absolute top-[15%] left-[75%] w-12 h-12 text-blue-500/10 animate-spin-slow" />
                <Moon className="absolute top-[60%] left-[80%] w-16 h-16 text-indigo-500/10 animate-float" />
                <Sun className="absolute top-[30%] left-[10%] w-20 h-20 text-amber-500/10 animate-pulse" />
                <Star className="absolute top-[80%] left-[40%] w-8 h-8 text-primary/10 animate-glow" />
                <Sparkles className="absolute top-[50%] left-[90%] w-10 h-10 text-purple-500/10 animate-pulse-slow" />
            </div>

            <div className="max-w-2xl mx-auto pt-10 pb-20 px-4 relative z-10">
                <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden bg-white border border-primary/10 shadow-lg">
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
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-secondary text-sm font-medium ml-1">Date of Birth</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        max={new Date().toISOString().split("T")[0]}
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-secondary text-sm font-medium ml-1">Time of Birth</label>
                                <div className="relative group">
                                    <Clock className="absolute left-4 top-3.5 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-secondary text-sm font-medium ml-1">Place of Birth</label>
                            <CitySearch
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
                            className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] hover:shadow-primary/50 transition-all duration-300 mt-6 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? 'Aligning Stars...' : 'Reveal My Chart'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InputForm;
