import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User } from 'lucide-react';
import { API_BASE_URL } from '../api/config';

const ChatWidget = ({ reportData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            text: "Hello! I'm Astra, your personal astrology guide. I have analyzed your entire profile. Ask me anything about your career, relationships, or future transits!"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || !reportData) return;

        const userMessage = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Helper to get planet sign
            const getPlanetSign = (planets, planetName) => {
                if (!Array.isArray(planets)) return 'Unknown';
                const p = planets.find(pl => pl.name === planetName);
                return p ? p.sign : 'Unknown';
            };

            // Helper to format Dasha
            const getDashaString = (dashaData) => {
                // Check if it's the object structure from VedicAstroEngine
                if (dashaData && typeof dashaData === 'object' && !Array.isArray(dashaData)) {
                    return {
                        active_mahadasha: dashaData.active_mahadasha || 'Unknown',
                        active_antardasha: dashaData.active_antardasha || 'Unknown'
                    };
                }
                // Fallback for array structure (legacy)
                if (Array.isArray(dashaData) && dashaData.length >= 1) {
                    const maha = dashaData[0]?.planet || 'Unknown';
                    const antar = dashaData[1]?.planet || 'Unknown';
                    return { active_mahadasha: maha, active_antardasha: antar };
                }
                return { active_mahadasha: 'Unknown', active_antardasha: 'Unknown' };
            };

            // Construct context from reportData
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
                    history: messages.slice(-5) // Send last 5 messages for context
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
                text: "I'm having a little trouble connecting to the cosmic data right now. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // Minimized View
    if (isOpen && isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="bg-white p-4 rounded-full shadow-2xl border border-purple-100 relative group transition-all hover:scale-110"
                >
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Chat with Astra
                    </span>
                </button>
            </div>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] flex flex-col items-end">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-full shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-105 group relative"
                >
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-1.5 rounded-xl shadow-lg font-bold text-sm opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none hidden md:block">
                        Ask Astra AI
                    </span>
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 w-[calc(100vw-2rem)] md:w-[400px] h-[70vh] md:h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Astra AI Guide</h3>
                                <p className="text-[10px] text-purple-100 opacity-80 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                    Online • Profile Loaded
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #6b7280 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                        </div>

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`
                                    max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                                    ${msg.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-tr-sm'
                                        : 'bg-white text-slate-700 border border-gray-100 rounded-tl-sm'
                                    }
                                `}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about your stars..."
                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all text-sm text-slate-700 font-medium placeholder:text-slate-400"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-200"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-2">
                            AI responses are based on your astrological profile.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
