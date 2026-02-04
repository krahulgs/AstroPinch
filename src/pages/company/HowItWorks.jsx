import { UserPlus, Cpu, FileText, Brain } from 'lucide-react';
import SEO from '../../components/SEO';

const HowItWorks = () => {
    const steps = [
        {
            icon: UserPlus,
            color: "text-blue-600 bg-blue-50",
            title: "1. Enter Your Birth Details",
            desc: "Provide your precise Date, Time, and Place of birth. This is crucial because even a few minutes can change your Ascendant and planetary positions."
        },
        {
            icon: Cpu,
            color: "text-purple-600 bg-purple-50",
            title: "2. Real-Time Calculation",
            desc: "Our advanced backend, powered by the Swiss Ephemeris & Vedic algorithms, constructs your detailed Lagna Chart, Navamsa, and planetary strengths instantly."
        },
        {
            icon: Brain,
            color: "text-amber-600 bg-amber-50",
            title: "3. AI Analysis & Synthesis",
            desc: "Our AI engine analyzes the conjunctions, aspects, and yogas in your chart, comparing them against thousands of astrological rules to derive meaning."
        },
        {
            icon: FileText,
            color: "text-emerald-600 bg-emerald-50",
            title: "4. Get Your Report",
            desc: "Receive a comprehensive, easy-to-read report covering your Personality, Career, Relationships, and Upcoming Dasha periods with actionable remedies."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
            <SEO
                title="How It Works"
                description="Learn about the technology and methodology behind AstroPinch. From planetary calculations with Swiss Ephemeris to AI-driven synthesis of Vedic logic."
                url="/how-it-works"
            />
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">How AstroPinch Works</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    From the moment you enter your birth data to the delivery of your life insights, here is the magic behind our platform.
                </p>
            </div>

            <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2 z-0"></div>

                <div className="space-y-12 relative z-10">
                    {steps.map((step, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

                            {/* Text Side */}
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-600">{step.desc}</p>
                            </div>

                            {/* Icon Center */}
                            <div className={`w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center shrink-0 ${step.color}`}>
                                <step.icon className="w-8 h-8" />
                            </div>

                            {/* Empty Side for balance */}
                            <div className="flex-1 hidden md:block"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-20 bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">Ready to discover your destiny?</h3>
                <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    Create Free Kundali Now
                </button>
            </div>
        </div>
    );
};


export default HowItWorks;
