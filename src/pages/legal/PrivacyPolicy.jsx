import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import SEO from '../../components/SEO';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
            <SEO
                title="Privacy Policy"
                description="Your privacy is our priority. Read our privacy policy to understand how we protect your personal and birth data."
                url="/privacy"
            />
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
                    <ShieldCheck size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-slate-500">Last Updated: February 4, 2026</p>
            </div>

            <div className="prose prose-slate max-w-none">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                            <Lock className="w-5 h-5 mr-3 text-blue-500" />
                            1. Introduction
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Welcome to AstroPinch. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                            <Eye className="w-5 h-5 mr-3 text-blue-500" />
                            2. Data We Collect
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, and date of birth.</li>
                            <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                            <li><strong>Birth Data:</strong> includes date of birth, time of birth, and place of birth (required for astrological calculations).</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                            <FileText className="w-5 h-5 mr-3 text-blue-500" />
                            3. How We Use Your Data
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>To provide astrological reports and insights based on your birth data.</li>
                            <li>To manage your account and provide customer support.</li>
                            <li>To improve our website, products/services, marketing, and customer relationships.</li>
                            <li>To comply with a legal or regulatory obligation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">4. Data Security</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">5. Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have any questions about this privacy policy or our privacy practices, please contact us at:
                            <br />
                            <a href="mailto:privacy@astropinch.com" className="text-blue-600 font-medium">privacy@astropinch.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
