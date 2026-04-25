import React, { useState } from 'react';
import Layout from '../../components/v2/Layout';
import { Card, SectionHeader, Button } from '../../components/v2/UI';
import { Sparkles, Mic, Send, Info, ChevronLeft } from 'lucide-react';

const ChatBubble = ({ type, text, source }) => (
  <div className={`flex flex-col gap-1.5 max-w-[85%] ${type === 'user' ? 'self-end' : 'self-start'}`}>
    <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm
      ${type === 'user' ? 'bg-[var(--primary)] text-white rounded-tr-none' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-main)] rounded-tl-none'}`}>
      {text}
    </div>
    {source && (
      <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-widest flex items-center gap-1 ml-1 opacity-70">
        <Sparkles size={10} className="text-[var(--secondary)]" /> {source}
      </span>
    )}
  </div>
);

const AIScreen = () => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Namaste, Rahul. I am your cosmic assistant. How can I guide you today?', source: 'AstroPinch AI v4.2' },
    { type: 'user', text: 'Will I get a job this year?' },
    { type: 'ai', text: 'Based on your 10th house Lord being Jupiter and its current transit through Taurus, the period after May 2024 is highly auspicious for career growth.', source: 'Based on Jupiter in Taurus' }
  ]);

  return (
    <Layout activeTab="consult">
      <div className="flex flex-col h-screen max-h-screen bg-[var(--bg)] relative overflow-hidden">
        {/* Cosmic Header */}
        <div className="px-4 py-4 flex items-center gap-4 bg-[var(--surface)] border-b border-[var(--border)] astro-glass z-10">
           <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-sub)]">
              <ChevronLeft size={20} />
           </button>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-lg">
                 <Sparkles size={20} />
              </div>
              <div>
                 <h3 className="text-sm">AstroPinch AI</h3>
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse"></div>
                    <span className="text-[10px] font-bold text-[var(--teal)] uppercase tracking-widest">Always Active</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar pb-32">
          {messages.map((m, i) => (
            <ChatBubble key={i} type={m.type} text={m.text} source={m.source} />
          ))}
        </div>

        {/* Input & Suggested Questions */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent">
          {/* Suggested Questions */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
             {['Job prospects?', 'When will I marry?', 'Health reading?'].map(q => (
               <button key={q} className="px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-widest whitespace-nowrap shadow-sm active:scale-95 transition-all">
                  {q}
               </button>
             ))}
          </div>

          {/* Input Bar */}
          <div className="relative flex items-center gap-2">
             <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Ask your cosmic guide..."
                  className="w-full h-14 pl-4 pr-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-lg outline-none focus:border-[var(--primary)] transition-all text-[15px]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                   <Send size={16} />
                </button>
             </div>
             <button className="w-14 h-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shadow-lg">
                <Mic size={24} />
             </button>
          </div>

          {/* Usage Indicator */}
          <div className="flex justify-center mt-4">
             <div className="px-3 py-1 rounded-full bg-slate-900/5 flex items-center gap-1.5">
                <Info size={12} className="text-[var(--text-sub)]" />
                <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-widest">3 of 5 free questions used today</span>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIScreen;
