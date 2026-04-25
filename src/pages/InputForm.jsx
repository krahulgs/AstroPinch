import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChart } from '../context/ChartContext';
import { User, Calendar, Clock, Loader2, Sparkles, MapPin, Briefcase, Heart } from 'lucide-react';
import CitySearch from '../components/ui/CitySearch';
import SEO from '../components/SEO';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Button, Input, SectionHeader } from '../components/v2/UI';
import Layout from '../components/v2/Layout';

const InputForm = () => {
    const navigate = useNavigate();
    const { saveUserData, loading, error: serverError } = useChart();
    const { theme } = useTheme();

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
        timezone: '',
        profession: '',
        marital_status: ''
    });

    // Refs for auto-focus navigation
    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);

    const validateForm = () => {
        const errors = {};
        const allowedProfessions = ["student", "private job", "government job", "business", "self employed", "unemployed", "retired", "other"];
        const allowedMaritalStatus = ["single", "married", "divorced", "widowed", "separated"];

        // 1. Full Name
        const name = formData.name.trim().replace(/\s+/g, ' ');
        if (!name) { errors.name = 'Full name is required'; }
        else if (name.length < 2 || name.length > 40) { errors.name = 'Name must be 2-40 characters'; }
        else if (!/^[a-zA-Z\. ]+$/.test(name)) { errors.name = 'Letters, spaces, and dots only'; }

        // 2. Date of Birth
        const d = parseInt(formData.day);
        const m = parseInt(formData.month);
        const y = parseInt(formData.year);
        const currentYear = new Date().getFullYear();

        if (!formData.day || !formData.month || !formData.year) {
            errors.date = 'Date of birth is required';
        } else {
            if (y < 1900 || y > currentYear) {
                errors.date = 'Year must be between 1900 and ' + currentYear;
            } else {
                const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const selectedDate = new Date(dateStr);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (isNaN(selectedDate.getTime()) || selectedDate.getDate() !== d) {
                    errors.date = 'Invalid calendar date';
                } else if (selectedDate > today) {
                    errors.date = 'Date cannot be in the future';
                } else if (today.getFullYear() - y > 120) {
                    errors.date = 'Age cannot exceed 120 years';
                }
            }
        }

        // 3. Time of Birth
        if (!formData.time) { errors.time = 'Time of birth is required'; }

        // 4. Profession
        if (!formData.profession || !allowedProfessions.includes(formData.profession.toLowerCase())) {
            errors.profession = 'Please select a profession';
        }

        // 5. Marital Status
        if (!formData.marital_status || !allowedMaritalStatus.includes(formData.marital_status.toLowerCase())) {
            errors.marital_status = 'Please select status';
        }

        // 6. Place of Birth
        if (!formData.place || !formData.lat) {
            errors.place = 'Please select a city';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return false;
        }

        setFormErrors({});
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const dateStr = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
        const dataToSave = { ...formData, date: dateStr };

        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) { clearInterval(interval); return 95; }
                return Math.min(prev + (Math.floor(Math.random() * 5) + 2), 95);
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
            const titleCaseValue = value.replace(/[^a-zA-Z\s\.]/g, '').slice(0, 40).toLowerCase().split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            setFormData({ ...formData, [name]: titleCaseValue });
        } else if (name === 'day' && value.length === 2 && monthRef.current) {
            setFormData({ ...formData, [name]: value });
            monthRef.current.focus();
        } else if (name === 'month' && value.length === 2 && yearRef.current) {
            setFormData({ ...formData, [name]: value });
            yearRef.current.focus();
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <Layout activeTab="profile">
            <SEO
                title="Reveal Your Destiny | AstroPinch"
                description="Enter your birth details to generate your sacred Vedic birth chart."
                url="/chart"
            />
            
            <div className="px-4 pt-12 pb-24">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-2xl mb-6 relative animate-fade-in">
                        <Sparkles size={40} />
                        <div className="absolute inset-0 bg-white opacity-20 blur-xl rounded-full animate-pulse"></div>
                    </div>
                    <h1 className="text-3xl mb-2 tracking-tight">
                        Reveal Your <span className="text-[var(--primary)] italic">Destiny</span>
                    </h1>
                    <p className="text-[var(--text-sub)] text-sm font-medium">Enter your details to generate your sacred chart</p>
                </div>

                {serverError && (
                    <Card className="bg-rose-50 border-rose-100 text-rose-600 mb-6 text-sm text-center">
                        Unable to connect. Please check your internet or backend status.
                    </Card>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <SectionHeader title="Personal Details" hindiTitle="व्यक्तिगत विवरण" />
                        <div className="space-y-5">
                            <Input 
                                label="Full Name" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Rahul Sharma"
                                error={formErrors.name}
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[var(--text-sub)] uppercase tracking-wider ml-1">Date of Birth</label>
                                <div className="flex gap-2">
                                    <input
                                        ref={dayRef}
                                        type="number"
                                        name="day"
                                        placeholder="DD"
                                        value={formData.day}
                                        onChange={handleChange}
                                        className="astro-input text-center flex-1"
                                    />
                                    <input
                                        ref={monthRef}
                                        type="number"
                                        name="month"
                                        placeholder="MM"
                                        value={formData.month}
                                        onChange={handleChange}
                                        className="astro-input text-center flex-1"
                                    />
                                    <input
                                        ref={yearRef}
                                        type="number"
                                        name="year"
                                        placeholder="YYYY"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="astro-input text-center flex-[1.5]"
                                    />
                                </div>
                                {formErrors.date && <span className="text-xs text-coral font-medium ml-1">{formErrors.date}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    label="Time of Birth" 
                                    type="time" 
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    error={formErrors.time}
                                />
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-[var(--text-sub)] uppercase tracking-wider ml-1">Profession</label>
                                    <select 
                                        name="profession"
                                        value={formData.profession}
                                        onChange={handleChange}
                                        className="astro-input appearance-none bg-[var(--surface)]"
                                    >
                                        <option value="">Select</option>
                                        <option value="student">Student</option>
                                        <option value="private job">Private Job</option>
                                        <option value="government job">Government Job</option>
                                        <option value="business">Business</option>
                                        <option value="self employed">Self Employed</option>
                                        <option value="unemployed">Unemployed</option>
                                        <option value="retired">Retired</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {formErrors.profession && <span className="text-xs text-coral font-medium ml-1">{formErrors.profession}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[var(--text-sub)] uppercase tracking-wider ml-1">Marital Status</label>
                                <select 
                                    name="marital_status"
                                    value={formData.marital_status}
                                    onChange={handleChange}
                                    className="astro-input appearance-none bg-[var(--surface)]"
                                >
                                    <option value="">Select Status</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="widowed">Widowed</option>
                                    <option value="separated">Separated</option>
                                </select>
                                {formErrors.marital_status && <span className="text-xs text-coral font-medium ml-1">{formErrors.marital_status}</span>}
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <SectionHeader title="Place of Birth" hindiTitle="जन्म स्थान" />
                        <div className="v2-city-search relative">
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
                        </div>
                        {formErrors.place && <span className="text-xs text-coral font-medium ml-1 block mt-2">{formErrors.place}</span>}
                    </Card>

                    <div className="pt-4">
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full h-14 !rounded-2xl relative overflow-hidden"
                        >
                            {loading && (
                                <div 
                                    className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {`Generating... ${progress}%`}
                                    </>
                                ) : (
                                    <>
                                        Reveal My Chart <ChevronRight size={20} />
                                    </>
                                )}
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default InputForm;
