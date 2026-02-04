import React from 'react';
import { CreditCard, RefreshCw, XCircle, Clock } from 'lucide-react';

const RefundPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-4">
                    <RefreshCw size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Refund Policy</h1>
                <p className="text-slate-500">Last Updated: February 4, 2026</p>
            </div>

            <div className="prose prose-slate max-w-none">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8">
                    <section>
                        <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                            <CreditCard className="w-5 h-5 mr-3 text-emerald-500" />
                            1. Digital Services Policy
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Since AstroPinch provides digital reports and real-time AI-generated insights, all sales are generally final. Once a report is generated or a consultation service is accessed, the value is considered delivered.
                        </p>
                    </section>

                    <section>
                        <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                            <Clock className="w-5 h-5 mr-3 text-emerald-500" />
                            2. Eligibility for Refund
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Refunds may be considered only in the following exceptional circumstances:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li><strong>Technical Failure:</strong> If you paid for a report but were unable to access it due to a server-side error or technical glitch on our end.</li>
                            <li><strong>Duplicate Payment:</strong> If you were accidentally charged twice for the same service.</li>
                            <li><strong>Non-Delivery:</strong> If a scheduled personalized consultation was canceled by us and not rescheduled.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                            <XCircle className="w-5 h-5 mr-3 text-emerald-500" />
                            3. Ineligibility for Refund
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Refunds will NOT be granted for:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Dissatisfaction with the astrological predictions or insights.</li>
                            <li>Incorrect birth information provided by the user (please double-check your data before submitting).</li>
                            <li>Change of mind after the report has been generated.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">4. Refund Process</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To request a refund, please email <a href="mailto:support@astropinch.com" className="text-emerald-600 font-medium">support@astropinch.com</a> within 24 hours of the transaction. Include your transaction ID and the reason for the request. We will review your request and get back to you within 3-5 business days. Approved refunds will be processed back to the original payment method within 7-10 business days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">5. Modifications</h2>
                        <p className="text-slate-600 leading-relaxed">
                            AstroPinch reserves the right to modify this refund policy at any time. Any changes will be posted on this page.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
