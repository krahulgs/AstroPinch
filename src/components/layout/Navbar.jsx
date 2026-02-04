import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Moon, BookOpen, Hash, Calendar, User, LogIn, LogOut, ChevronLeft, Menu, X } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import AstroLogo from '../../components/AstroLogo';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, login, logout, token } = useProfile();
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const isHomePage = location.pathname === '/';
    const showBack = !['/', '/profiles', '/login', '/register'].includes(location.pathname);

    const navItems = [
        { name: 'nav.horoscopes', path: '/horoscope', icon: Star },
        { name: 'nav.numerology', path: '/numerology', icon: Hash },
        { name: 'nav.calendar', path: '/calendar', icon: Calendar },
        { name: 'nav.profiles', path: '/profiles', icon: User },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#0a0a20]/70 backdrop-blur-xl border-b border-white/10`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-4">
                        {/* Back Button */}
                        {showBack && (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-full bg-primary/5 hover:bg-primary/10 text-secondary hover:text-primary transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 md:gap-3 group" onClick={() => setIsMenuOpen(false)}>
                            <AstroLogo className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg shadow-purple-500/20" />
                            <div className="flex flex-col">
                                <span className={`text-lg md:text-2xl font-bold tracking-tight ${isHomePage && !isMenuOpen ? 'text-white' : 'text-white'}`}>
                                    AstroPinch
                                </span>
                                <span className={`text-[8px] md:text-[10px] uppercase tracking-wider font-medium ${isHomePage && !isMenuOpen ? 'text-white/70' : 'text-slate-400'}`}>
                                    Astrology & Horoscopes
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive(item.path)
                                    ? (isHomePage ? 'bg-white/20 text-white' : 'bg-white/10 text-white border border-white/20')
                                    : (isHomePage ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5')
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className="font-medium text-sm">{t(item.name)}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-2 md:gap-4">

                        <div className="hidden sm:flex items-center gap-2 md:gap-4">
                            {token ? (
                                <div className={`flex items-center gap-2 md:gap-3 pl-4 border-l ${isHomePage && !isMenuOpen ? 'border-white/20' : 'border-white/10'}`}>
                                    <Link
                                        to="/profiles"
                                        className={`p-2 rounded-xl transition-all border ${isHomePage && !isMenuOpen
                                            ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                                            : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20'}`}
                                        title="My Profiles"
                                    >
                                        <User className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className={`p-2 rounded-xl transition-all group ${isHomePage && !isMenuOpen
                                            ? 'bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-300'
                                            : 'bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300'}`}
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-bold text-xs md:text-sm transition-all border ${isHomePage && !isMenuOpen
                                        ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                                >
                                    <LogIn className="w-4 h-4" />
                                    {t('nav.login')}
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={toggleMenu}
                            className={`lg:hidden p-2 rounded-xl transition-all ${isHomePage && !isMenuOpen ? 'text-white' : 'text-white'}`}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden animate-in fade-in slide-in-from-top-4 duration-300 bg-[#0a0a0b] border-t border-white/10 pb-8 px-2 mt-2">
                        <div className="flex flex-col gap-1 pt-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                        ? 'bg-white/10 text-white border border-white/10'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-semibold">{t(item.name)}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3 px-4">
                            {token ? (
                                <>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold">
                                            {user?.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{user?.full_name}</p>
                                            <p className="text-xs text-slate-400 font-medium">Cosmic Voyager</p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/profiles"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 text-slate-400 hover:text-white font-medium py-2 transition-colors"
                                    >
                                        <User className="w-5 h-5" />
                                        <span>My Profiles</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 text-red-400 hover:text-red-300 font-medium py-2 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>{t('nav.login')}</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )
                }
            </div >
        </nav >
    );
};

export default Navbar;
