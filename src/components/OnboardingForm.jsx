import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Clock, User, Search, Loader, Star } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

const OnboardingForm = ({ onSuccess, initialData = null }) => {
    const { addProfile, updateProfile } = useProfile();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        gender: initialData?.gender || 'male',
        birth_date: initialData?.birth_date || '',
        birth_time: initialData?.birth_time || '',
        location_name: initialData?.location_name || '',
        latitude: initialData?.latitude || 0,
        longitude: initialData?.longitude || 0,
        relation: initialData?.relation || 'Self',
        profession: initialData?.profession || '',
        marital_status: initialData?.marital_status || 'Single'
    });

    const [locationQuery, setLocationQuery] = useState(initialData?.location_name || '');
    const [locationResults, setLocationResults] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (initialData) {
            const time = initialData.birth_time || '';
            let amPm = 'AM';
            if (time) {
                const [h] = time.split(':').map(Number);
                amPm = h >= 12 ? 'PM' : 'AM';
            }

            setFormData({
                name: initialData.name || '',
                gender: initialData.gender || 'male',
                birth_date: initialData.birth_date || '',
                birth_time: initialData.birth_time || '',
                location_name: initialData.location_name || '',
                latitude: initialData.latitude || 0,
                longitude: initialData.longitude || 0,
                relation: initialData.relation || 'Self',
                profession: initialData.profession || '',
                marital_status: initialData.marital_status || 'Single'
            });
            setLocationQuery(initialData.location_name || '');
        } else {
            // Reset if adding new
            setFormData({
                name: '', gender: 'male', birth_date: '', birth_time: '',
                location_name: '', latitude: 0, longitude: 0,
                relation: 'Self', profession: '', marital_status: 'Single'
            });
            setLocationQuery('');
        }
    }, [initialData]);



    const handleSearchLocation = async () => {
        if (!locationQuery) return;
        setSearching(true);
        try {
            // Use OpenStreetMap Nominatim API (Free, No Key)
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`);
            if (response.ok) {
                const data = await response.json();

                const results = data.map(item => ({
                    name: item.display_name,
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lon)
                }));

                if (results.length === 0) {
                    // Fallback if nothing found
                    setLocationResults([{ name: `No results for "${locationQuery}"`, lat: 0, lng: 0, disabled: true }]);
                } else {
                    setLocationResults(results);
                }
            } else {
                setLocationResults([]);
            }
        } catch (error) {
            console.error("Location search failed", error);
            setLocationResults([]);
        } finally {
            setSearching(false);
        }
    };

    const selectLocation = (loc) => {
        if (loc.disabled) return;
        setFormData({ ...formData, location_name: loc.name, latitude: loc.lat, longitude: loc.lng });
        setLocationResults([]);
        setStep(3); // Move to review/submit
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Filter out am_pm as it's not in the backend schema
            const { am_pm, ...payload } = formData;

            if (initialData) {
                await updateProfile(initialData.id, payload);
            } else {
                await addProfile(payload);
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            alert("Error saving profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">{initialData ? 'Update Profile' : 'Create Profile'}</h2>

            {/* Step 1: Basics */}
            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div>
                        <label className="block text-xs text-purple-600 uppercase font-bold mb-2">Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-secondary" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => {
                                    const filteredValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                    setFormData({ ...formData, name: filteredValue });
                                }}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 text-primary focus:border-purple-600 focus:outline-none transition-colors"
                                placeholder="Enter Your Full Name."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-purple-600 uppercase font-bold mb-2">Birth Date</label>
                        <div className="flex gap-2">
                            <input
                                ref={dayRef}
                                type="number"
                                placeholder="DD"
                                min="1"
                                max="31"
                                required
                                value={formData.birth_date ? formData.birth_date.split('-')[2] : ''}
                                onChange={e => {
                                    const val = e.target.value.slice(0, 2);
                                    const parts = (formData.birth_date || '1995-01-01').split('-');
                                    setFormData({ ...formData, birth_date: `${parts[0]}-${parts[1]}-${val.padStart(2, '0')}` });
                                    if (val.length === 2) monthRef.current?.focus();
                                }}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center text-primary focus:border-purple-600 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <input
                                ref={monthRef}
                                type="number"
                                placeholder="MM"
                                min="1"
                                max="12"
                                required
                                value={formData.birth_date ? formData.birth_date.split('-')[1] : ''}
                                onChange={e => {
                                    const val = e.target.value.slice(0, 2);
                                    const parts = (formData.birth_date || '1995-01-01').split('-');
                                    setFormData({ ...formData, birth_date: `${parts[0]}-${val.padStart(2, '0')}-${parts[2]}` });
                                    if (val.length === 2) yearRef.current?.focus();
                                }}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center text-primary focus:border-purple-600 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <input
                                ref={yearRef}
                                type="number"
                                placeholder="YYYY"
                                min="1900"
                                max={new Date().getFullYear()}
                                required
                                value={formData.birth_date ? formData.birth_date.split('-')[0] : ''}
                                onChange={e => {
                                    const val = e.target.value.slice(0, 4);
                                    const parts = (formData.birth_date || '1995-01-01').split('-');
                                    setFormData({ ...formData, birth_date: `${val}-${parts[1]}-${parts[2]}` });
                                }}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-center text-primary focus:border-purple-600 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-[1.5]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-purple-600 uppercase font-bold mb-2">Birth Time (24 Hrs.)</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 w-5 h-5 text-secondary" />
                            <input
                                type="time"
                                value={formData.birth_time}
                                onChange={e => setFormData({ ...formData, birth_time: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 text-primary focus:border-purple-600 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-purple-600 uppercase font-bold mb-2">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-primary focus:border-purple-600 focus:outline-none transition-colors text-sm appearance-none"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-purple-600 uppercase font-bold mb-2">Relation</label>
                            <select
                                value={formData.relation}
                                onChange={e => setFormData({ ...formData, relation: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-primary focus:border-purple-600 focus:outline-none transition-colors text-sm appearance-none"
                            >
                                <option value="Self">Self</option>
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Friend">Friend</option>
                                <option value="Partner">Partner</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-purple-600 uppercase font-bold mb-2">Profession</label>
                            <select
                                value={formData.profession}
                                onChange={e => setFormData({ ...formData, profession: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-primary focus:border-purple-600 focus:outline-none transition-colors text-sm appearance-none"
                            >
                                <option value="">Select Profession</option>
                                <option value="Student">Student</option>
                                <option value="Business">Business</option>
                                <option value="Private Job">Private Job</option>
                                <option value="Govt Job">Govt Job</option>
                                <option value="Job Seeker">Job seeker</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-purple-600 uppercase font-bold mb-2">Marital Status</label>
                            <select
                                value={formData.marital_status}
                                onChange={e => setFormData({ ...formData, marital_status: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-primary focus:border-purple-600 focus:outline-none transition-colors text-sm appearance-none"
                            >
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="In Relationship">In Relationship</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Complicated">It's Complicated</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        disabled={!formData.name || !formData.birth_date || !formData.birth_time}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                    >
                        Next: Location
                    </button>
                </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div>
                        <label className="block text-xs text-purple-600 uppercase font-bold mb-2">Birth Place</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-secondary" />
                                <input
                                    type="text"
                                    value={locationQuery}
                                    onChange={e => setLocationQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearchLocation()}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 text-primary focus:border-purple-600 focus:outline-none transition-colors"
                                    placeholder="Search City..."
                                />
                            </div>
                            <button
                                onClick={handleSearchLocation}
                                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                <Search className="w-5 h-5 text-primary" />
                            </button>
                        </div>
                    </div>

                    {searching && <div className="text-center text-sm text-slate-400 py-4"><Loader className="w-5 h-5 animate-spin inline mr-2" />Searching...</div>}

                    {/* Always show "Continue with current" if location is set */}
                    {formData.location_name && (
                        <div className="mb-4 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-purple-600 uppercase font-bold">Current Selection</span>
                                <span className="text-xs text-purple-400 font-mono">{formData.latitude?.toFixed(2)}, {formData.longitude?.toFixed(2)}</span>
                            </div>
                            <p className="text-primary font-bold mb-3">{formData.location_name}</p>
                            <button
                                onClick={() => setStep(3)}
                                className="w-full py-2 bg-white hover:bg-purple-50 text-purple-600 rounded-lg font-bold text-sm transition-colors border border-purple-200"
                            >
                                Keep & Continue
                            </button>
                        </div>
                    )}

                    <div className="space-y-2">
                        {locationResults.map((loc, idx) => (
                            <button
                                key={idx}
                                onClick={() => selectLocation(loc)}
                                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between group transition-colors"
                            >
                                <span className="text-secondary group-hover:text-primary">{loc.name}</span>
                                <span className="text-xs text-slate-400 font-mono">
                                    {loc.lat.toFixed(2)}, {loc.lng.toFixed(2)}
                                </span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setStep(1)}
                        className="w-full py-3 mt-4 text-slate-400 hover:text-white transition-colors"
                    >
                        Back
                    </button>
                </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-secondary">Name</span>
                            <span className="text-primary font-bold">{formData.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-secondary">Date/Time</span>
                            <span className="text-primary font-bold">
                                {formData.birth_date} • {(() => {
                                    if (!formData.birth_time) return '';
                                    const [h, m] = formData.birth_time.split(':').map(Number);
                                    const h12 = h % 12 || 12;
                                    const ampm = h >= 12 ? 'PM' : 'AM';
                                    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
                                })()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary">Place</span>
                            <span className="text-primary font-bold text-right">
                                {formData.location_name}
                                <div className="text-xs text-slate-400 font-mono mt-1">
                                    {formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)}
                                </div>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl font-bold text-white shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : (initialData ? 'Update Profile' : 'Create Profile')}
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            className="text-sm text-slate-500 hover:text-white transition-colors"
                        >
                            Edit Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnboardingForm;
