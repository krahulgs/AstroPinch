import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Minus, Maximize2, Bot, Info, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../api/config';

const ChatWidget = ({ reportData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            text: "Welcome to your celestial guidance. I've analyzed your cosmic blueprint and I'm ready to answer any questions about your destiny, career, or relationships."
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messageCount, setMessageCount] = useState(() => {
        const savedCount = localStorage.getItem('astra_chat_count');
        const lastReset = localStorage.getItem('astra_chat_last_reset');
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;

        if (lastReset !== currentMonth) {
            localStorage.setItem('astra_chat_last_reset', currentMonth);
            localStorage.setItem('astra_chat_count', '0');
            return 0;
        }
        return savedCount ? parseInt(savedCount, 10) : 0;
    });
    const messagesEndRef = useRef(null);

    const CHAT_LIMIT = 10;
    const isLimitReached = messageCount >= CHAT_LIMIT;

    const suggestedQuestions = [
        "What does my career look like this year?",
        "Tell me about my relationship compatibility.",
        "What are my strengths based on my chart?",
        "Any major financial transits upcoming?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
        }
    }, [messages, isOpen, isMinimized, isLoading]);

    const handleSend = async (customInput = null) => {
        const messageText = customInput || input;
        if (!messageText.trim() || !reportData || isLimitReached) return;

        const userMessage = { id: Date.now(), role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const newCount = messageCount + 1;
        setMessageCount(newCount);
        localStorage.setItem('astra_chat_count', newCount.toString());

        try {
            const getPlanetSign = (planets, planetName) => {
                if (!Array.isArray(planets)) return 'Unknown';
                const p = planets.find(pl => pl.name === planetName);
                return p ? p.sign : 'Unknown';
            };

            const getDashaString = (dashaData) => {
                if (dashaData && typeof dashaData === 'object' && !Array.isArray(dashaData)) {
                    return {
                        active_mahadasha: dashaData.active_mahadasha || 'Unknown',
                        active_antardasha: dashaData.active_antardasha || 'Unknown'
                    };
                }
                if (Array.isArray(dashaData) && dashaData.length >= 1) {
                    const maha = dashaData[0]?.planet || 'Unknown';
                    const antar = dashaData[1]?.planet || 'Unknown';
                    return { active_mahadasha: maha, active_antardasha: antar };
                }
                return { active_mahadasha: 'Unknown', active_antardasha: 'Unknown' };
            };

            const context = {
                name: reportData.profile?.name,
                place: reportData.profile?.place,
                date_time: `${reportData.profile?.dob} ${reportData.profile?.tob}`,
                vedic: {
                    ascendant: reportData.vedic_astrology?.panchang?.ascendant?.name,
                    moon_sign: getPlanetSign(reportData.vedic_astrology?.planets, 'Moon'),
                    sun_sign: getPlanetSign(reportData.vedic_astrology?.planets, 'Sun'),
                    nakshatra: reportData.vedic_astrology?.panchang?.nakshatra?.name,
                    dasha: getDashaString(reportData.vedic_astrology?.dasha),
                    planets: reportData.vedic_astrology?.planets?.map(p => `${p.name} in ${p.sign} (${p.house})`).join(', '),
                    doshas: reportData.vedic_astrology?.kundali_analysis?.doshas || {}
                },
                western: {
                    sun_sign: reportData.western_astrology?.sun_sign,
                    ascendant: reportData.western_astrology?.ascendant,
                    moon_sign: reportData.western_astrology?.moon_sign
                },
                numerology: {
                    life_path: reportData.numerology?.life_path_number || reportData.numerology?.life_path
                }
            };

            const response = await fetch(`${API_BASE_URL}/api/chat/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.text,
                    context: context,
                    history: messages.slice(-5)
                })
            });

            if (!response.ok) throw new Error("Failed to get response");
            const data = await response.json();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                text: data.response
            }]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                text: "The cosmic signals are slightly distorted. Please try your question again in a moment."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    if (isOpen && isMinimized) {
        return (
            <div className="fixed bottom-0 right-4 md:right-12 z-[9999]">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="group relative flex items-center gap-3 bg-white p-2 pr-5 rounded-t-2xl shadow-2xl border-t border-x border-purple-100 transition-all hover:translate-y-[-4px] active:translate-y-0 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-200">
                        <Sparkles className="w-6 h-6 text-white" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div className="relative flex flex-col items-start">
                        <span className="text-xs font-black text-purple-900 tracking-tight uppercase leading-none">Astra AI</span>
                        <span className="text-[10px] text-purple-500 font-bold uppercase tracking-widest mt-1">Tap to Resume</span>
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 md:right-12 z-[9999] flex flex-col items-end pointer-events-none">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 p-5 rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.5)] transition-all hover:scale-110 active:scale-95 group relative mb-4"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <Sparkles className="w-8 h-8 text-white animate-glow" />
                    <div className="absolute -top-3 -right-3 bg-white text-purple-600 text-[10px] font-black px-2 py-1 rounded-lg border border-purple-100 shadow-xl shadow-purple-200/50 scale-0 group-hover:scale-100 transition-transform origin-bottom-left">
                        FREE HELP
                    </div>
                </button>
            )}

            {isOpen && (
                <div className="pointer-events-auto bg-white rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-purple-50 w-[calc(100vw-2rem)] md:w-[420px] h-[70vh] max-h-[680px] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-500 origin-bottom-right">
                    {/* Header: Premium Glassmorphic Design */}
                    <div className="relative bg-indigo-950 p-6 flex justify-between items-center overflow-hidden shrink-0">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center border border-white/20 shadow-xl overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                                    <Sparkles className="w-7 h-7 text-white relative z-10 group-hover:rotate-12 transition-transform" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-indigo-950"></div>
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg tracking-tight leading-none mb-1.5 flex items-center gap-2">
                                    Astra AI Guide
                                    <span className="bg-white/10 text-purple-200 text-[9px] font-black px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">PRO</span>
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                                        Active Prediction Engine
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 flex gap-2">
                            <button
                                onClick={() => setIsMinimized(true)}
                                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                            >
                                <Minus className="w-5 h-5 text-white/70" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-rose-500/20 rounded-xl border border-white/10 group transition-colors"
                            >
                                <X className="w-5 h-5 text-white/70 group-hover:text-rose-400" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area: Polished Scrolled Surface */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8faff] relative">
                        {/* Subtle Background Pattern */}
                        <div className="absolute inset-0 opacity-[0.4] pointer-events-none"
                            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}>
                        </div>

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}
                            >
                                <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                    <div className={`
                                        p-4 md:p-5 rounded-[2rem] text-sm leading-[1.6] shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative
                                        ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-tr-md shadow-indigo-600/10'
                                            : 'bg-white text-slate-700 border border-indigo-100/50 rounded-tl-md'
                                        }
                                    `}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-2 opacity-60">
                                        {msg.role === 'user' ? 'You' : 'Powered by AstroPinch'}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Suggested Questions Grid */}
                        {messages.length === 1 && !isLoading && (
                            <div className="pt-4 grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 px-1">Suggested Inquiries</p>
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(q)}
                                        className="text-left p-3 rounded-2xl bg-indigo-50 border border-indigo-100/60 text-indigo-700 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-5 rounded-[1.5rem] rounded-tl-md border border-indigo-100/50 shadow-sm flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Analyzing your stars...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area: Modern Layout */}
                    <div className="p-6 bg-white border-t border-indigo-50 shrink-0">
                        {isLimitReached ? (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-3xl text-center space-y-3 shadow-sm animate-in zoom-in-95">
                                <div className="flex justify-center">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-amber-900 leading-none mb-1">Celestial Quota Full</p>
                                    <p className="text-[11px] text-amber-700 font-medium">You've reached your monthly 10 queries. Upgrade to Pro for unlimited guidance.</p>
                                </div>
                                <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-amber-500/20">
                                    Upgrade to Pro
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your cosmic query..."
                                        className="w-full pl-6 pr-14 py-4.5 rounded-[1.8rem] bg-indigo-50/30 border border-indigo-100/80 focus:outline-none focus:border-indigo-400 focus:bg-white focus:shadow-[0_0_0_5px_rgba(79,70,229,0.05)] transition-all text-sm text-slate-800 font-medium placeholder:text-slate-400"
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={isLoading || !input.trim()}
                                        className="absolute right-2 top-1.5 bottom-1.5 w-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-indigo-600/20 active:scale-95"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center px-2">
                                    <div className="flex items-center gap-1.5 opacity-50">
                                        <Bot className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Secured AI Node</span>
                                    </div>
                                    <div className={`flex items-center gap-2 py-1 px-3 rounded-full border ${isLimitReached ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-indigo-50/50 border-indigo-100 text-indigo-600'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${isLimitReached ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                                        <span className="text-[9px] font-black uppercase tracking-widest">
                                            {messageCount}/{CHAT_LIMIT} Free Queries
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
