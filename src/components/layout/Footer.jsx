import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';
import AstroLogo from '../AstroLogo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8 text-sm">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

                {/* Top Section: Brand & Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

                    {/* Brand - Span 3 cols */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center gap-3 mb-4">
                            <AstroLogo className="w-8 h-8" />
                            <h2 className="text-xl font-bold text-slate-900">AstroPinch</h2>
                        </div>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            AstroPinch is a trusted online astrology website offering accurate Vedic astrology, Kundali analysis, horoscope predictions, numerology, and dosha remedies using advanced AI and traditional astrological principles. Get personalized astrology reports for career, marriage, finance, health, and life guidance—simple, clear, and reliable.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-blue-700 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Popular Services - Span 2 cols */}
                    <div className="lg:col-span-2">
                        <h3 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-xs">Popular Services</h3>
                        <ul className="space-y-3">
                            <li><Link to="/kundali" className="text-slate-600 hover:text-blue-600 transition-colors">Free Kundali Online</Link></li>
                            <li><Link to="/birth-chart" className="text-slate-600 hover:text-blue-600 transition-colors">Birth Chart & Positions</Link></li>
                            <li><Link to="/horoscope" className="text-slate-600 hover:text-blue-600 transition-colors">Daily/Weekly Horoscope</Link></li>
                            <li><Link to="/predictions" className="text-slate-600 hover:text-blue-600 transition-colors">Career & Business</Link></li>
                            <li><Link to="/predictions" className="text-slate-600 hover:text-blue-600 transition-colors">Marriage Matching</Link></li>
                            <li><Link to="/predictions" className="text-slate-600 hover:text-blue-600 transition-colors">Manglik Dosha Analysis</Link></li>
                            <li><Link to="/numerology" className="text-slate-600 hover:text-blue-600 transition-colors">Numerology Analysis</Link></li>
                            <li><Link to="/calendar" className="text-slate-600 hover:text-blue-600 transition-colors">Muhurat & Panchang</Link></li>
                            <li><Link to="/report/consolidated" className="text-slate-600 hover:text-blue-600 transition-colors">Premium Reports</Link></li>
                        </ul>
                    </div>

                    {/* Systems & Learn - Span 2 cols */}
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <h3 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-xs">Astrology Systems</h3>
                            <ul className="space-y-2">
                                <li><Link to="/birth-chart" className="text-slate-600 hover:text-blue-600 transition-colors">Vedic Astrology</Link></li>
                                <li><Link to="/birth-chart" className="text-slate-600 hover:text-blue-600 transition-colors">KP Astrology</Link></li>
                                <li><Link to="/numerology" className="text-slate-600 hover:text-blue-600 transition-colors">Numerology</Link></li>
                                <li><Link to="/calendar" className="text-slate-600 hover:text-blue-600 transition-colors">Panchang & Muhurat</Link></li>
                                <li><Link to="/report/consolidated" className="text-slate-600 hover:text-blue-600 transition-colors">Western Astrology</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-xs">Learn & Explore</h3>
                            <ul className="space-y-2">
                                <li><Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">Astrology Basics</Link></li>
                                <li><Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">Planetary Effects</Link></li>
                                <li><Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">Houses, Rashis & Nakshatras</Link></li>
                                <li><Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">Yogas & Doshas</Link></li>
                                <li><Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">Blog & Research</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Why Choose - Span 2 cols */}
                    <div className="lg:col-span-2">
                        <h3 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-xs">Why Choose AstroPinch</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start text-slate-600 gap-3">
                                <div className="mt-1 min-w-4 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[10px] font-bold">✓</div>
                                <span>Accurate AI-Based Predictions</span>
                            </li>
                            <li className="flex items-start text-slate-600 gap-3">
                                <div className="mt-1 min-w-4 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[10px] font-bold">✓</div>
                                <span>Easy-to-Understand Language</span>
                            </li>
                            <li className="flex items-start text-slate-600 gap-3">
                                <div className="mt-1 min-w-4 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[10px] font-bold">✓</div>
                                <span>Verified Astrological Logic</span>
                            </li>
                            <li className="flex items-start text-slate-600 gap-3">
                                <div className="mt-1 min-w-4 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[10px] font-bold">✓</div>
                                <span>Secure Online Payments</span>
                            </li>
                            <li className="flex items-start text-slate-600 gap-3">
                                <div className="mt-1 min-w-4 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[10px] font-bold">✓</div>
                                <span>Trusted by Users Worldwide</span>
                            </li>
                        </ul>
                    </div>

                    {/* Company & Legal - Span 3 cols (Balance) */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-xs">Company</h3>
                                <ul className="space-y-2">
                                    <li><Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">About Us</Link></li>
                                    <li><Link to="/how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">How It Works</Link></li>
                                    <li><Link to="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact Us</Link></li>
                                    <li><Link to="/help" className="text-slate-600 hover:text-blue-600 transition-colors">Help Center</Link></li>
                                    <li><Link to="/partnership" className="text-slate-600 hover:text-blue-600 transition-colors">Partnership</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-xs">Legal</h3>
                                <ul className="space-y-2">
                                    <li><Link to="/privacy-policy" className="text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                                    <li><Link to="/terms" className="text-slate-600 hover:text-blue-600 transition-colors">Terms</Link></li>
                                    <li><Link to="/disclaimer" className="text-slate-600 hover:text-blue-600 transition-colors">Disclaimer</Link></li>
                                    <li><Link to="/refund-policy" className="text-slate-600 hover:text-blue-600 transition-colors">Refund Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Zodiac Signs Strip */}
                <div className="border-t border-slate-100 py-8 mb-8">
                    <h3 className="text-center font-semibold text-slate-900 mb-6 uppercase tracking-wider text-xs">Astrology by Zodiac Signs</h3>
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-center">
                        {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((sign) => (
                            <Link key={sign} to={`/horoscope/${sign.toLowerCase()}`} className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-100 hover:border-blue-100 transition-all">
                                {sign}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-slate-100 pt-8 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-amber-50 rounded-xl p-6 border border-amber-100/60 shadow-sm">
                            <h4 className="flex items-center text-amber-800 font-bold mb-3 text-sm">
                                <span className="mr-2 text-lg">⚠️</span> Astrology Disclaimer
                            </h4>
                            <p className="text-amber-800/70 text-xs leading-relaxed">
                                AstroPinch provides astrological predictions and insights based on traditional astrology and AI calculations. Results may vary from person to person. Astrology services are for guidance purposes only and should not be considered medical, legal, or financial advice.
                            </p>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h4 className="flex items-center text-slate-900 font-semibold mb-3">
                                <span className="mr-2">🌍</span> Global Presence
                            </h4>
                            <p className="text-slate-600 text-sm mb-6 max-w-md">
                                Serving users across India, USA, UK, UAE, Canada, Australia & Worldwide with premium localized reports.
                            </p>
                            <div className="flex items-center text-slate-600 text-sm">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-blue-600">
                                    <Mail size={16} />
                                </div>
                                <a href="mailto:support@astropinch.com" className="font-medium hover:text-blue-600 transition-colors">support@astropinch.com</a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 pt-8 border-t border-slate-100">
                        <div className="mb-2 md:mb-0 text-center md:text-left">
                            &copy; {currentYear} AstroPinch.com – Best Online Astrology & Horoscope Website. All Rights Reserved.
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
