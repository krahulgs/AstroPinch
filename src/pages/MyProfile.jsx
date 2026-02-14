import React, { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { User, Mail, Phone, Calendar, Camera, Edit2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../api/config';
import SEO from '../components/SEO';

const MyProfile = () => {
    const { user, token, fetchUser } = useProfile();
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

    const handlePhoneUpdate = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            setMessage({ type: 'error', text: 'Please enter a valid phone number (min 10 digits)' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ phone_number: phoneNumber })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Phone number updated successfully!' });
                setIsEditingPhone(false);
                await fetchUser();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.detail || 'Failed to update phone number' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file' });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
            return;
        }

        setUploadingPhoto(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/upload-photo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
                await fetchUser();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.detail || 'Failed to upload photo' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setUploadingPhoto(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getPhotoUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
            <SEO
                title="My Profile - AstroPinch"
                description="Manage your AstroPinch account profile, update personal information, and customize your settings."
                url="/my-profile"
            />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
                    <p className="text-slate-600">Manage your personal information and account settings</p>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border ${message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="font-medium">{message.text}</span>
                        <button
                            onClick={() => setMessage({ type: '', text: '' })}
                            className="ml-auto"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Cover Section */}
                    <div className="h-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                {/* Profile Photo */}
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-4xl font-bold text-purple-600 shadow-xl overflow-hidden">
                                    {user?.photo_url ? (
                                        <img
                                            src={getPhotoUrl(user.photo_url)}
                                            alt={user.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getInitials(user?.full_name)
                                    )}
                                </div>

                                {/* Upload Photo Button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingPhoto}
                                    className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-lg border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Upload Photo"
                                >
                                    {uploadingPhoto ? (
                                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Camera className="w-5 h-5" />
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-20 px-8 pb-8">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-slate-900">{user?.full_name || 'User'}</h2>
                            <p className="text-slate-500 text-sm mt-1">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Mail className="w-4 h-4 text-purple-600" />
                                    Email Address
                                </label>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="text-slate-900 font-medium">{user?.email || 'Not provided'}</p>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Phone className="w-4 h-4 text-purple-600" />
                                    Phone Number
                                </label>
                                {isEditingPhone ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                            placeholder="Enter phone number"
                                            className="flex-1 p-4 bg-white rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                            maxLength="15"
                                        />
                                        <button
                                            onClick={handlePhoneUpdate}
                                            disabled={loading}
                                            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Save className="w-5 h-5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingPhone(false);
                                                setPhoneNumber(user?.phone_number || '');
                                                setMessage({ type: '', text: '' });
                                            }}
                                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-slate-900 font-medium">
                                                {user?.phone_number || 'Not provided'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditingPhone(true)}
                                            className="px-4 py-4 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                                            title={user?.phone_number ? 'Update phone number' : 'Add phone number'}
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <User className="w-4 h-4 text-purple-600" />
                                    Full Name
                                </label>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="text-slate-900 font-medium">{user?.full_name || 'Not provided'}</p>
                                </div>
                            </div>

                            {/* Account Created */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                    Account Created
                                </label>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="text-slate-900 font-medium">
                                        {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Section */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <User className="w-5 h-5 text-purple-600" />
                                Account Information
                            </h3>
                            <div className="space-y-2 text-sm text-slate-700">
                                <p>• Your email address is used for login and important notifications</p>
                                <p>• Add a phone number to receive SMS updates and alerts</p>
                                <p>• Upload a profile photo to personalize your account</p>
                                <p>• Keep your information up to date for the best experience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
