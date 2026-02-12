import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChart } from '../context/ChartContext';
import { User, Calendar, Clock, Loader2 } from 'lucide-react';
import CitySearch from '../components/ui/CitySearch';
import SEO from '../components/SEO';

const InputForm = () => {
    const navigate = useNavigate();
    const { saveUserData, loading, error: serverError } = useChart();

    const [progress, setProgress] = useState(0);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        day: '',
        month: '',
        year: '',
        time: '',
        place: '',
        lat: '',
        lng: '',
        timezone: ''
    });

    const validateForm = () => {
        const errors = {};
        const allowedProfessions = ["student", "private job", "government job", "business", "self employed", "unemployed", "retired", "other"];
        const allowedMaritalStatus = ["single", "married", "divorced", "widowed", "separated"];

        // 1. Full Name
        const name = formData.name.trim().replace(/\s+/g, ' '); // Normalize spaces
        if (!name) {
            setFormErrors({ name: 'Full name is required' });
            return false;
        }
        if (name.length < 2 || name.length > 80) {
            setFormErrors({ name: 'Name must be 2-80 characters' });
            return false;
        }
        if (!/^[a-zA-Z\. ]+$/.test(name)) {
            setFormErrors({ name: 'Name must contain letters, spaces, and dots only' });
            return false;
        }

        // 2. Date of Birth
        const d = parseInt(formData.day);
        const m = parseInt(formData.month);
        const y = parseInt(formData.year);
        const currentYear = new Date().getFullYear();

        if (!formData.day || !formData.month || !formData.year) {
            setFormErrors({ date: 'Date of birth is completely required' });
            return false;
        }

        // Year check
        if (y < 1900 || y > currentYear) {
            setFormErrors({ date: 'Year must be between 1900 and ' + currentYear });
            return false;
        }

        // Complex date check
        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(selectedDate.getTime()) || selectedDate.getDate() !== d) {
            setFormErrors({ date: 'Invalid calendar date' });
            return false;
        }
        if (selectedDate > today) {
            setFormErrors({ date: 'Date cannot be in the future' });
            return false;
        }

        // Age check (>120 years)
        const age = today.getFullYear() - y;
        if (age > 120) {
            setFormErrors({ date: 'Age cannot exceed 120 years' });
            return false;
        }

        // 3. Time of Birth
        if (!formData.time) {
            setFormErrors({ time: 'Time of birth is required' });
            return false;
        }
        // Format is handled by input type="time", but extra check:
        const [hh, mm] = formData.time.split(':').map(Number);
        if (isNaN(hh) || isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
            setFormErrors({ time: 'Invalid time format' });
            return false;
        }

        // 4. Profession
        if (!formData.profession || !allowedProfessions.includes(formData.profession.toLowerCase())) {
            setFormErrors({ profession: 'Please select a valid profession' });
            return false;
        }

        // 5. Marital Status
        if (!formData.marital_status || !allowedMaritalStatus.includes(formData.marital_status.toLowerCase())) {
            setFormErrors({ marital_status: 'Please select a valid marital status' });
            return false;
        }

        // 6. Place of Birth
        // Note: CitySearch writes to formData.place. We validate that string.
        const place = (formData.place || "").trim();
        if (!place || !formData.lat) { // Ensure lat/lng selected too
            setFormErrors({ place: 'Please select a city from the list' });
            return false;
        }
        if (place.length < 2) {
            setFormErrors({ place: 'Place name too short' });
            return false;
        }
        // Regex: Letters, spaces, commas, hyphen only.
        if (!/^[a-zA-Z\s,\-]+$/.test(place)) {
            setFormErrors({ place: 'Place contains invalid characters (no numbers allowed)' });
            return false;
        }

        // Pass validation and Normalize Data
        // Capitalize Name
        const activeName = name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        // Update state with normalized values before submit
        setFormData(prev => ({
            ...prev,
            name: activeName,
            place: place // Title case handled by CitySearch usually, but we keep raw text safe
        }));

        setFormErrors({});
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const dateStr = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;

        const dataToSave = {
            ...formData,
            date: dateStr
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

        const report = await saveUserData(dataToSave);

        clearInterval(interval);

        if (report) {
            setProgress(100);
            setTimeout(() => {
                navigate('/report/consolidated', { state: { userData: dataToSave, preFetchedReport: report } });
            }, 500);
        } else {
            setProgress(0);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
        if (name === 'day' || name === 'month' || name === 'year') setFormErrors(prev => ({ ...prev, date: '' }));

        if (name === 'name') {
            const filteredValue = value.replace(/[^a-zA-Z\s\.]/g, ''); // Allow dots too based on validation rule
            setFormData({ ...formData, [name]: filteredValue });
        } else if (name === 'day' || name === 'month') {
            if (value.length <= 2) {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === 'year') {
            if (value.length <= 4) {
                setFormData({ ...formData, [name]: value });
            }
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
            <div className="max-w-2xl mx-auto pt-4 md:pt-10 pb-20 px-3 md:px-4 relative z-10">
                <div className="glass-panel p-6 md:p-12 rounded-3xl relative border border-primary/10 shadow-lg">
                    {/* Glow Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 blur-3xl rounded-full -ml-20 -mb-20"></div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-primary">
                        Enter Birth Details
                    </h2>

                    {serverError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm text-center">
                            Failed to connect to the server. Please ensure the backend is running.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
                        <div className="space-y-2">
                            <label className="text-secondary text-sm font-medium ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    autoFocus
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-50 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all text-primary placeholder:text-gray-400
                                        ${formErrors.name ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary'}
                                    `}
                                    placeholder="Enter Your Full Name"
                                />
                            </div>
                            {formErrors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">{formErrors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-secondary text-sm font-medium ml-1">Date of Birth</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <input
                                            type="number"
                                            name="day"
                                            placeholder="DD"
                                            value={formData.day}
                                            onChange={handleChange}
                                            className={`w-full bg-gray-50 border rounded-xl py-3 text-center focus:outline-none transition-all text-primary placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                                ${formErrors.date ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary'}
                                            `}
                                        />
                                    </div>
                                    <div className="relative flex-1 group">
                                        <input
                                            type="number"
                                            name="month"
                                            placeholder="MM"
                                            value={formData.month}
                                            onChange={handleChange}
                                            className={`w-full bg-gray-50 border rounded-xl py-3 text-center focus:outline-none transition-all text-primary placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                                ${formErrors.date ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary'}
                                            `}
                                        />
                                    </div>
                                    <div className="relative flex-[1.5] group">
                                        <input
                                            type="number"
                                            name="year"
                                            placeholder="YYYY"
                                            value={formData.year}
                                            onChange={handleChange}
                                            className={`w-full bg-gray-50 border rounded-xl py-3 text-center focus:outline-none transition-all text-primary placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                                ${formErrors.date ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary'}
                                            `}
                                        />
                                    </div>
                                </div>
                                {formErrors.date && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">{formErrors.date}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-secondary text-sm font-medium ml-1">Time of Birth (24 Hrs.)</label>
                                <div className="relative group">
                                    <Clock className="absolute left-4 top-3.5 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className={`w-full bg-gray-50 border rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all text-primary placeholder:text-gray-400
                                            ${formErrors.time ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary'}
                                        `}
                                    />
                                </div>
                                {formErrors.time && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">{formErrors.time}</p>}
                            </div>
                        </div>

                        {/* Profession and Marital Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-secondary text-sm font-medium ml-1">Profession</label>
                                <div className="relative group">
                                    <select
                                        name="profession"
                                        value={formData.profession || ""}
                                        onChange={handleChange}
                                        className={`w-full bg-gray-50 border rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary appearance-none
                                            ${formErrors.profession ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100 bg-red-50' : 'border-gray-200'}
                                        `}
                                    >
                                        <option value="" disabled>Select Profession</option>
                                        <option value="student">Student</option>
                                        <option value="private job">Private Job</option>
                                        <option value="government job">Government Job</option>
                                        <option value="business">Business</option>
                                        <option value="self employed">Self Employed</option>
                                        <option value="unemployed">Unemployed</option>
                                        <option value="retired">Retired</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <div className="absolute right-4 top-3.5 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                {formErrors.profession && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">{formErrors.profession}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-secondary text-sm font-medium ml-1">Marital Status</label>
                                <div className="relative group">
                                    <select
                                        name="marital_status"
                                        value={formData.marital_status || ""}
                                        onChange={handleChange}
                                        className={`w-full bg-gray-50 border rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-primary appearance-none
                                            ${formErrors.marital_status ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100 bg-red-50' : 'border-gray-200'}
                                        `}
                                    >
                                        <option value="" disabled>Select Status</option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="divorced">Divorced</option>
                                        <option value="widowed">Widowed</option>
                                        <option value="separated">Separated</option>
                                    </select>
                                    <div className="absolute right-4 top-3.5 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                {formErrors.marital_status && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">{formErrors.marital_status}</p>}
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
                                    if (formErrors.place) setFormErrors(prev => ({ ...prev, place: '' }));
                                }}
                                defaultValue={formData.place}
                                error={!!formErrors.place}
                            />
                            {formErrors.place && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">{formErrors.place}</p>}
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
