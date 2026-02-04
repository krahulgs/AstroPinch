import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChart } from '../context/ChartContext';
import { User, Calendar, Clock, Loader2 } from 'lucide-react';
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
            navigate('/report/consolidated');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-transparent">
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
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary placeholder:text-gray-400"
                                    placeholder="Rahul Kumar"
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
