import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle submitting logic here
        alert("Thank you for contacting us! We'll get back to you soon.");
    };

    return (
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Have questions about your report or need technical support? We're here to help you.
                </p>
            </div>

            <div className="grid md:grid-cols-12 gap-12">
                {/* Contact Info */}
                <div className="md:col-span-5 space-y-8">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Contact Information</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Email Us</h4>
                                    <p className="text-slate-500 text-sm mb-1">Our support team is available 24/7.</p>
                                    <a href="mailto:support@astropinch.com" className="text-blue-600 hover:underline font-medium">support@astropinch.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Call Us</h4>
                                    <p className="text-slate-500 text-sm mb-1">Mon-Fri from 9am to 6pm IST.</p>
                                    <a href="tel:+919876543210" className="text-blue-600 hover:underline font-medium">+91 98765 43210</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Office</h4>
                                    <p className="text-slate-500 text-sm">
                                        AstroPinch Tech Labs Pvt Ltd.<br />
                                        Indiranagar, Bangalore<br />
                                        Karnataka, India - 560038
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-2xl text-white">
                        <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                        <p className="text-indigo-200 mb-6">
                            Find quick answers to common questions about our reports, payments, and astrology methods.
                        </p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium transition-colors">
                            Visit Help Center
                        </button>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-7">
                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h3>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                            >
                                <option value="">Select a topic</option>
                                <option value="report">Issue with Report</option>
                                <option value="billing">Billing & Refunds</option>
                                <option value="partnership">Partnership Inquiry</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                                placeholder="How can we help you today?"
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1">
                            <Send className="w-5 h-5" />
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
