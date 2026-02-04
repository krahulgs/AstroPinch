import React from 'react';
import { AlertCircle, Info, ShieldAlert } from 'lucide-react';

const Disclaimer = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-4">
                    <AlertCircle size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Disclaimer</h1>
                <p className="text-slate-500">Last Updated: February 4, 2026</p>
            </div>

            <div className="prose prose-slate max-w-none">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800 flex gap-4">
                        <ShieldAlert className="w-6 h-6 shrink-0" />
                        <p className="text-sm font-medium leading-relaxed">
                            AstroPinch provides astrological insights for guidance and entertainment purposes only. Astrology is not an exact science, and predictions are based on interpretations of planetary positions.
                        </p>
                    </div>

                    <section>
                        <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                            <Info className="w-5 h-5 mr-3 text-red-500" />
                            1. Not Professional Advice
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            The information provided by AstroPinch (including but not limited to reports, predictions, and consultations) does not constitute:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li><strong>Medical Advice:</strong> Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</li>
                            <li><strong>Legal Advice:</strong> Consult with a licensed attorney for legal matters.</li>
                            <li><strong>Financial Advice:</strong> Consult with a certified financial planner for investment or financial decisions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">2. Accuracy of Information</h2>
                        <p className="text-slate-600 leading-relaxed">
                            While we strive for high accuracy using advanced algorithms and traditional Vedic principles, we cannot guarantee the correctness or reliability of any prediction or analysis. Human life is complex, and many factors beyond astrological positions influence outcomes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">3. Personal Responsibility</h2>
                        <p className="text-slate-600 leading-relaxed">
                            You acknowledge that any action you take based on information from AstroPinch is at your own risk. The company and its authors are not responsible for any loss, damage, or consequence resulting from the use of our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">4. Variations in Results</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Astrological interpretations can vary between different systems and individual astrologers. Our AI-driven engine follows specific Vedic methodologies, but other practitioners might arrive at different conclusions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">5. External Links</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites or services.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
