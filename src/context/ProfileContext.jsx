import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../api/config';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [activeProfile, setActiveProfile] = useState(null);
    const [appMode, setAppMode] = useState('VEDIC'); // 'VEDIC' or 'WESTERN'
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setProfiles([]);
        setActiveProfile(null);
    }, []);

    const fetchWithAuth = useCallback(async (url, options = {}) => {
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            logout();
            return null;
        }
        return response;
    }, [token, logout]);

    const fetchUser = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/me`);
            if (res && res.ok) {
                const userData = await res.json();
                setUser(userData);
                // Fetch profiles in background without blocking
                fetchProfiles();
            } else {
                logout();
            }
        } catch (err) {
            console.error("Failed to fetch user", err);
            logout();
        } finally {
            setLoading(false);
        }
    }, [token, fetchWithAuth, logout]);

    const fetchProfiles = async () => {
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}/api/profiles/`);
            if (res && res.ok) {
                const data = await res.json();
                setProfiles(data);
                // Set default active if none
                if (data.length > 0 && !activeProfile) {
                    setActiveProfile(data[0]);
                }
            }
        } catch (err) {
            console.error("Failed to fetch profiles", err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email, password) => {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);

        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            setToken(data.access_token);

            // Trigger background fetch without blocking
            setTimeout(() => {
                fetchUser();
            }, 0);

            return true;
        }

        const errData = await res.json();
        throw new Error(errData.detail || "Login failed");
    };

    const register = async (userData) => {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            setToken(data.access_token);

            // Trigger background fetch without blocking
            setTimeout(() => {
                fetchUser();
            }, 0);

            return true;
        }
        return false;
    };

    const addProfile = async (profileData) => {
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}/api/profiles/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });
            if (res && res.ok) {
                const newProfile = await res.json();
                setProfiles(prev => [...prev, newProfile]);
                setActiveProfile(newProfile);
                return newProfile;
            }
        } catch (err) {
            console.error("Failed to add profile", err);
            throw err;
        }
    };

    const updateProfile = async (profileId, profileData) => {
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}/api/profiles/${profileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });
            if (res && res.ok) {
                const updatedProfile = await res.json();
                setProfiles(prev => prev.map(p => p.id === profileId ? updatedProfile : p));
                if (activeProfile?.id === profileId) {
                    setActiveProfile(updatedProfile);
                }
                return updatedProfile;
            }
        } catch (err) {
            console.error("Failed to update profile", err);
            throw err;
        }
    };

    const switchProfile = (profileId) => {
        const p = profiles.find(p => p.id === profileId);
        if (p) setActiveProfile(p);
    };

    const deleteProfile = async (profileId) => {
        try {
            await fetchWithAuth(`${API_BASE_URL}/api/profiles/${profileId}`, { method: 'DELETE' });
            const updated = profiles.filter(p => p.id !== profileId);
            setProfiles(updated);
            if (activeProfile?.id === profileId) {
                setActiveProfile(updated[0] || null);
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const toggleAppMode = () => {
        setAppMode(prev => prev === 'VEDIC' ? 'WESTERN' : 'VEDIC');
    };

    return (
        <ProfileContext.Provider value={{
            user, profiles, activeProfile, appMode, loading, token,
            login, register, logout, addProfile, updateProfile, switchProfile, deleteProfile, fetchProfiles, toggleAppMode, fetchUser
        }}>
            {children}
        </ProfileContext.Provider>
    );
};
