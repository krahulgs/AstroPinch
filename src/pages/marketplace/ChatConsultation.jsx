import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Send, Phone, Video, X, Clock, Wallet, 
  MessageSquare, User, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { API_BASE_URL } from '../../api/config';

const ChatConsultation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userData } = useProfile();
  
  const astrologerId = searchParams.get('astrologerId');
  const [astrologer, setAstrologer] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);
  const [billingInfo, setBillingInfo] = useState(null);

  const timerRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (astrologerId) {
      fetchAstrologer();
    }
  }, [astrologerId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAstrologer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/marketplace/astrologers/${astrologerId}`);
      if (response.ok) {
        const data = await response.json();
        setAstrologer(data.profile);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/marketplace/consultation/start?user_id=${userData.id}&astrologer_id=${astrologerId}&type=CHAT`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setConsultation(data);
        setSessionActive(true);
        startTimer();
        
        // Initial system message
        setMessages([
          { role: 'system', text: `Consultation started with ${astrologer.full_name}. Billing starts at ₹${astrologer.price_per_min}/min.` },
          { role: 'astrologer', text: `Namaste! I am ${astrologer.full_name}. How can I guide you today?` }
        ]);
      } else {
        const err = await response.json();
        alert(err.detail || "Could not start session. Please check your wallet balance.");
      }
    } catch (error) {
      console.error("Start session error:", error);
    }
  };

  const endSession = async () => {
    if (!consultation) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/marketplace/consultation/${consultation.id}/end`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setBillingInfo(data);
        setSessionActive(false);
        stopTimer();
      }
    } catch (error) {
      console.error("End session error:", error);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([...messages, { role: 'user', text: newMessage }]);
    setNewMessage('');

    // Simulated AI response for demo
    setTimeout(() => {
      const responses = [
        "I see strong planetary positions in your 10th house.",
        "Your current dasha suggests a period of growth and transformation.",
        "Based on your charts, this is a favorable time for career changes.",
        "Focus on spiritual grounding today. Saturn is testing your patience.",
        "Could you please share your exact question regarding this transit?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'astrologer', text: randomResponse }]);
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 pt-24 pb-12 h-[calc(100vh-2rem)] flex flex-col">
      {/* Session Header */}
      <div className="bg-white rounded-t-[2.5rem] border border-slate-100 p-6 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <img src={astrologer?.photo_url} alt="" className="w-12 h-12 rounded-2xl object-cover" />
          <div>
            <h3 className="font-black text-slate-900">{astrologer?.full_name}</h3>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Active Session
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" /> Duration
            </div>
            <div className="font-black text-slate-900 tabular-nums">{formatTime(timeElapsed)}</div>
          </div>
          {sessionActive && (
            <button 
              onClick={endSession}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
            >
              End Chat
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-50 border-x border-slate-100 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {!sessionActive && !billingInfo && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Ready to start?</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Consultation will be billed at <span className="font-bold text-slate-900">₹{astrologer?.price_per_min}/min</span>. 
              {userData?.has_history ? '' : ' Your first 5 minutes are FREE!'}
            </p>
            <button 
              onClick={startSession}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all"
            >
              Start Chat Now
            </button>
          </div>
        )}

        {billingInfo && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Session Completed</h2>
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-8">
              <div className="flex justify-between mb-4">
                <span className="text-slate-400 font-bold text-sm">Duration</span>
                <span className="font-black text-slate-900">{billingInfo.duration} mins</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-slate-400 font-bold text-sm">Total Cost</span>
                <span className="font-black text-slate-900">₹{billingInfo.cost}</span>
              </div>
              <div className="h-px bg-slate-50 mb-4" />
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold text-sm">New Balance</span>
                <span className="font-black text-indigo-600">₹{billingInfo.new_balance}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/astrologers')}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm tracking-widest"
            >
              Back to Marketplace
            </button>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${msg.role === 'system' ? 'justify-center' : ''}`}>
            {msg.role === 'system' ? (
              <div className="px-4 py-1 bg-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {msg.text}
              </div>
            ) : (
              <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-slate-900 border border-slate-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-b-[2.5rem] border border-slate-100 p-4 shrink-0 shadow-sm">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input 
            type="text" 
            placeholder={sessionActive ? "Type your question..." : "Start session to chat"}
            disabled={!sessionActive}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all disabled:opacity-50"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!sessionActive || !newMessage.trim()}
            className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatConsultation;
