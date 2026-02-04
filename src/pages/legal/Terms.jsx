import React from 'react';
import { Scale, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import SEO from '../../components/SEO';

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
            <SEO
                title="Terms of Service"
                description="Read our terms of service to understand the rules, guidelines, and legal agreements for using the AstroPinch platform."
                url="/terms"
            />
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 mb-4">
                    <Scale size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
                <p className="text-slate-500">Last Updated: February 4, 2026</p>
            </div>

            <div className="prose prose-slate max-w-none">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                            <CheckCircle className="w-5 h-5 mr-3 text-amber-500" />
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            By accessing or using AstroPinch, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                            <HelpCircle className="w-5 h-5 mr-3 text-amber-500" />
                            2. Description of Service
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            AstroPinch provides online astrological content, reports, and insights generated through algorithms and AI. These services are provided "as is" and are intended for entertainment and personal guidance purposes only.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                            <AlertTriangle className="w-5 h-5 mr-3 text-amber-500" />
                            3. User Obligations
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            You must provide accurate and complete birth information for the services to function correctly. You are responsible for maintaining the confidentiality of your account and password.
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>You must be at least 18 years old to use this service.</li>
                            <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
                            <li>You will not attempt to hack, reverse engineer, or disrupt the service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">4. Intellectual Property</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The content, logo, and algorithms of AstroPinch are the intellectual property of the company. You may not reproduce, distribute, or create derivative works without explicit permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">5. Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed">
                            AstroPinch shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Astrological predictions are subjective and should not replace professional medical, legal, or financial advice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">6. Governing Law</h2>
                        <p className="text-slate-600 leading-relaxed">
                            These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the company is registered, without regard to its conflict of law provisions.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
