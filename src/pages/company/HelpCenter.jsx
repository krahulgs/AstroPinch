import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, CreditCard, Shield } from 'lucide-react';
import SEO from '../../components/SEO';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100">
            <button
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`text-lg font-medium ${isOpen ? 'text-blue-600' : 'text-slate-900'}`}>{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <p className="text-slate-600 leading-relaxed">{answer}</p>
                </div>
            </div>
        </div>
    );
};

const HelpCenter = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
            <SEO
                title="Help Center & FAQs"
                description="Find answers to common questions about Vedic astrology, our calculation methods, data privacy, and report options."
                url="/help"
            />
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-6">How can we help you?</h1>
                <div className="max-w-xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                </div>
            </div>

            {/* Categories */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Getting Started</h3>
                    <p className="text-sm text-slate-500">Creating charts, understanding basics.</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:border-purple-200 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Billing & Plans</h3>
                    <p className="text-sm text-slate-500">Invoices, refunds, upgrading.</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:border-green-200 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Account & Privacy</h3>
                    <p className="text-sm text-slate-500">Security, data management.</p>
                </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>

                <div className="divide-y divide-slate-100">
                    <FAQItem
                        question="Is the prediction accurate?"
                        answer="Our predictions are based on precise mathematical calculations of planetary positions (Ephemeris) combined with classical Vedic interpretative rules. While we ensure high technical accuracy, astrology is guidance, not absolute destiny."
                    />
                    <FAQItem
                        question="Which Ayanamsa do you use?"
                        answer="By default, we use the Lahiri (Chitra Paksha) Ayanamsa, which is the most widely accepted system in Vedic Astrology. You can switch to KP or Raman Ayanamsa in the advanced settings."
                    />
                    <FAQItem
                        question="Is my birth data private?"
                        answer="Absolutely. We treat your birth data with strict confidentiality. It is used solely to generate your chart and is processed securely. We do not sell your personal data to third parties."
                    />
                    <FAQItem
                        question="What is the difference between General and Premium reports?"
                        answer="The General report covers basic planetary positions and specific traits. The Premium report includes detailed Dasha analysis, thorough divisional chart (Varga) readings, and personalized remedial measures tailored to your unique problem areas."
                    />
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
