// src/app/tax-refund/components/FormFiles/AdditionalInformation.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface AdditionalInfoProps {
    values: {
        sponsor: string;
        university: string;
        universityAddress: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNext: () => void;
}

export default function AdditionalInformation({ values, onChange, onNext }: AdditionalInfoProps) {
    const [valid, setValid] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Validar que los tres campos tengan texto
        setValid(
            values.sponsor.trim() !== '' &&
            values.university.trim() !== '' &&
            values.universityAddress.trim() !== ''
        );
    }, [values]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Additional Information</h2>
            <p className="text-center text-gray-600">
                Por favor ingresa los datos de tu programa.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">
                        Nombre de tu Sponsor <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="sponsor"
                        value={values.sponsor}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                        placeholder="Ej: Cultural Exchange Inc."
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Universidad <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="university"
                        value={values.university}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                        placeholder="Ej: University of California"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Dirección de la Universidad <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="universityAddress"
                        value={values.universityAddress}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                        placeholder="Ej: 123 College Ave, Town, ST 12345"
                    />
                </div>
            </div>

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
