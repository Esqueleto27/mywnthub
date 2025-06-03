// src/app/tax-refund/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';   // <- Ruta CORRECTA: un nivel arriba, luego /components
import FormFile from './components/FormFile';
import FormAmend from './components/FormAmend';

export default function TaxRefundPage() {
    const [started, setStarted] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        service: '' as 'file' | 'amend' | '',
    });
    const stepsRef = useRef<HTMLDivElement>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const canStart =
        form.firstName.trim() !== '' &&
        form.lastName.trim() !== '' &&
        /^\S+@\S+\.\S+$/.test(form.email) &&
        (form.service === 'file' || form.service === 'amend');

    useEffect(() => {
        if (started && stepsRef.current) {
            stepsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [started]);

    return (
        <>
            <Navbar />
            <div className="bg-[#F9FAFB] text-[#1F2937] min-h-screen px-6 py-12">
                <div className="max-w-5xl mx-auto space-y-12">
                    {/* Hero + Why choose us */}
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl font-bold text-[#3B82F6]">Tax Refund</h1>
                        <p className="text-lg">
                            We help non-resident workers file or amend their U.S. taxes from
                            anywhere—fast, reliable, and fully IRS compliant.
                        </p>
                        <div className="bg-[#F3F4F6] p-6 rounded-2xl shadow">
                            <h2 className="text-2xl font-semibold mb-2">Why not TurboTax?</h2>
                            <ul className="list-disc list-inside space-y-2 text-left">
                                <li>Specialized in non-resident tax returns.</li>
                                <li>We submit your documents directly to the IRS.</li>
                                <li>Accessible from anywhere in the world.</li>
                                <li>100% accurate and IRS-compliant filing.</li>
                                <li>Trusted by hundreds of international students and workers.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Personal Information & Service Selection */}
                    <div className="bg-white p-6 rounded-2xl shadow border border-[#E5E7EB] space-y-6">
                        <h2 className="text-2xl font-bold text-center">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium mb-1">
                                    First Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">
                                    Last Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-medium mb-1">
                                    Email <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-medium mb-1">
                                    Select Service <span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="service"
                                    value={form.service}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded px-4 py-2 w-full"
                                >
                                    <option value="">-- Choose an option --</option>
                                    <option value="file">File my U.S. Non-Resident Taxes</option>
                                    <option value="amend">Amend my U.S. Taxes</option>
                                </select>
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={() => setStarted(true)}
                                disabled={!canStart}
                                className={`mt-4 px-6 py-2 rounded-lg text-white ${canStart ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {/* Steps */}
                    {started && (
                        <div ref={stepsRef} className="space-y-12">
                            {form.service === 'file' && <FormFile form={form} initialStep={2} />}
                            {form.service === 'amend' && <FormAmend form={form} initialStep={2} />}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
