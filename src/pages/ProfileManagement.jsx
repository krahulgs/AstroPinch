import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useChart } from '../context/ChartContext';
import { useNavigate } from 'react-router-dom';
import OnboardingForm from '../components/OnboardingForm';
import { Plus, User, Trash2, FileText, Hash, Loader, Sparkles, Pencil, Lock } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

const ProfileManagement = () => {
    const { profiles, activeProfile, switchProfile, deleteProfile, user, logout, fetchProfiles } = useProfile();
    const { saveUserData } = useChart();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [loadingProfileId, setLoadingProfileId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Profile limit removed
    const used = profiles.length;

    const handleAddNew = () => {
        setEditingProfile(null);
        setShowForm(!showForm);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchProfiles();
        setRefreshing(false);
    };

    const handleViewReport = async (profile, path) => {
        setLoadingProfileId(profile.id);
        const userData = {
            name: profile.name,
            date: profile.birth_date, // YYYY-MM-DD
            time: profile.birth_time,
            place: profile.location_name,
            lat: profile.latitude,
            lng: profile.longitude,
            timezone: profile.timezone_id,
            profession: profile.profession,
            marital_status: profile.marital_status
        };

        const success = await saveUserData(userData);
        setLoadingProfileId(null);

        if (success) {
            // For Consolidated Report, we pass state as fallback, but Context is also set
            navigate(path, { state: { userData } });
        } else {
            alert("Failed to load profile data.");
        }
    };

    return (
        <div className="min-h-screen px-6 pb-12">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold text-primary mb-2">Profiles</h1>
                        <p className="text-secondary">Manage charts for yourself, family, and friends.</p>
                        <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
                            <span>
                                {used} Profile{used !== 1 ? 's' : ''} Created
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className={`p-2 rounded-xl bg-white border border-gray-200 text-secondary hover:text-primary hover:bg-gray-50 transition-all ${refreshing ? 'animate-spin' : ''}`}
                            title="Refresh Profiles"
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleAddNew}
                            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2
                                ${showForm ? 'bg-gray-100 text-primary hover:bg-gray-200' : 'bg-purple-600 hover:bg-purple-500'} text-white
                            `}
                        >
                            {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add New</>}
                        </button>
                    </div>
                </div>

                <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />

                {showForm ? (
                    <OnboardingForm onSuccess={() => { setShowForm(false); setEditingProfile(null); }} initialData={editingProfile} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profiles.map(profile => (
                            <div
                                key={profile.id}
                                onClick={() => handleViewReport(profile, '/report/consolidated')}
                                className={`p-6 rounded-2xl border transition-all relative group flex flex-col h-full cursor-pointer
                                    ${activeProfile?.id === profile.id
                                        ? 'bg-purple-50 border-purple-600 shadow-md shadow-purple-900/10'
                                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-lg'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-primary border border-gray-200">
                                        {profile.name[0]}
                                    </div>
                                    {activeProfile?.id === profile.id && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] uppercase font-bold rounded-full border border-green-200">
                                            Active
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-primary mb-1">{profile.name}</h3>
                                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2 opacity-80">
                                    {profile.relation}
                                </div>
                                <div className="text-sm text-secondary space-y-1 mb-6 flex-grow">
                                    <p className="font-medium text-slate-700">{profile.location_name}</p>
                                    <p className="text-xs font-mono text-slate-500">
                                        {profile.latitude?.toFixed(4)}, {profile.longitude?.toFixed(4)}
                                    </p>
                                    <p>{profile.birth_date} at {(() => {
                                        const [h, m] = profile.birth_time.split(':').map(Number);
                                        const h12 = h % 12 || 12;
                                        const ampm = h >= 12 ? 'PM' : 'AM';
                                        return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
                                    })()}</p>
                                </div>

                                <div className="space-y-3 mt-auto">
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleViewReport(profile, '/report/consolidated'); }}
                                            disabled={loadingProfileId === profile.id}
                                            className="flex-1 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-blue-200 transition-colors"
                                        >
                                            {loadingProfileId === profile.id ? <Loader className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                                            Report
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleViewReport(profile, '/numerology'); }}
                                            disabled={loadingProfileId === profile.id}
                                            className="flex-1 py-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-pink-200 transition-colors"
                                        >
                                            {loadingProfileId === profile.id ? <Loader className="w-3 h-3 animate-spin" /> : <Hash className="w-3 h-3" />}
                                            Numbers
                                        </button>
                                    </div>

                                    {/* Daily Insights Link */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate('/daily-guidance', { state: { profile } }); }}
                                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-50 to-purple-50 hover:from-amber-100 hover:to-purple-100 border border-gray-200 flex items-center justify-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-widest transition-all group-hover:border-amber-300"
                                    >
                                        <Sparkles className="w-3 h-3 text-amber-600" /> Daily Guidance & Alerts
                                    </button>

                                    <div className="flex gap-2 border-t border-gray-100 pt-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); switchProfile(profile.id); }}
                                            disabled={activeProfile?.id === profile.id}
                                            className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-primary transition-colors disabled:opacity-50"
                                        >
                                            {activeProfile?.id === profile.id ? 'Selected' : 'Select'}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingProfile(profile);
                                                setShowForm(true);
                                            }}
                                            className="p-2 rounded-lg hover:bg-gray-100 text-secondary hover:text-primary transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Delete this profile?')) deleteProfile(profile.id);
                                            }}
                                            className="p-2 rounded-lg hover:bg-red-50 text-secondary hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {profiles.length === 0 && (
                            <div className="col-span-full py-12 text-center border border-dashed border-gray-300 rounded-3xl bg-gray-50">
                                <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-primary font-bold">No profiles yet</h3>
                                <p className="text-secondary text-sm mt-1">Create your first profile to get started</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileManagement;
