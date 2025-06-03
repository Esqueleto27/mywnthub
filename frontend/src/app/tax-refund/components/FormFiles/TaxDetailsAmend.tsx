// src/app/tax-refund/components/FormFiles/TaxDetailsAmend.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface TaxDetailsAmendProps {
    form: {
        year?: string;
        state?: string;
        entryDate?: string;
        exitDate?: string;
        filedPrevious?: string;
        previousDetails?: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onNext: () => void;
}

export default function TaxDetailsAmend({ form, onChange, onNext }: TaxDetailsAmendProps) {
    const [valid, setValid] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const basic =
            !!form.year &&
            !!form.state &&
            !!form.entryDate &&
            !!form.exitDate &&
            !!form.filedPrevious;
        const prevOK = form.filedPrevious === 'yes'
            ? !!form.previousDetails?.trim()
            : true;
        setValid(basic && prevOK);
    }, [form]);

    const yearsToCorrect = Array.from({ length: 10 }, (_, i) => (2024 - i).toString());

    const usStates = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
        "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
        "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
        "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
        "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
        "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
        "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Amend Details</h2>
            <p className="text-center text-gray-600">
                Enter the year you want to correct, your state, and DS-2019 dates.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-medium mb-1">
                        Year to Correct <span className="text-red-600">*</span>
                    </label>
                    <select
                        name="year"
                        value={form.year || ''}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                    >
                        <option value="">Select year</option>
                        {yearsToCorrect.map(yr => (
                            <option key={yr} value={yr}>{yr}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        U.S. State where you worked <span className="text-red-600">*</span>
                    </label>
                    <select
                        name="state"
                        value={form.state || ''}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                    >
                        <option value="">Select state</option>
                        {usStates.map(st => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-medium mb-1">
                        Date of Entry to the U.S. <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="date"
                        name="entryDate"
                        value={form.entryDate || ''}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Date of Departure from the U.S. <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="date"
                        name="exitDate"
                        value={form.exitDate || ''}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            <div>
                <label className="block font-medium mb-1">
                    Did you file U.S. taxes in a previous year? <span className="text-red-600">*</span>
                </label>
                <select
                    name="filedPrevious"
                    value={form.filedPrevious || ''}
                    onChange={onChange}
                    className="w-full border rounded px-4 py-2"
                >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            {form.filedPrevious === 'yes' && (
                <div>
                    <label className="block font-medium mb-1">
                        Which year and which form did you file? <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="previousDetails"
                        value={form.previousDetails || ''}
                        onChange={onChange}
                        placeholder="Example: 2022, 1040NR"
                        className="w-full border rounded px-4 py-2"
                    />
                </div>
            )}

            <div className="text-center">
                {!submitted && (
                    <button
                        onClick={() => { setSubmitted(true); onNext(); }}
                        disabled={!valid}
                        className={`px-6 py-2 rounded-lg text-white font-semibold ${valid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}
