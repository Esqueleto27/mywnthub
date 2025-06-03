// src/app/tax-refund/components/FormFiles/Address.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface Props {
    values: { street?: string; city?: string; zip?: string; };
    setValues: React.Dispatch<React.SetStateAction<any>>;
    onNext: () => void;
}

export default function Address({ values, setValues, onNext }: Props) {
    const [valid, setValid] = useState(false);
    useEffect(() => {
        setValid(!!values.street?.trim() && !!values.city?.trim() && !!values.zip?.trim());
    }, [values]);
    const hc = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(v => ({ ...v, [name]: value }));
    };
    return (
        <div className="bg-white p-6 rounded-2xl shadow space-y-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-center">Address</h2>
            <input name="street" placeholder="Street *" value={values.street || ''} onChange={hc}
                className="w-full border rounded px-4 py-2" />
            <input name="city" placeholder="City *" value={values.city || ''} onChange={hc}
                className="w-full border rounded px-4 py-2" />
            <input name="zip" placeholder="ZIP *" value={values.zip || ''} onChange={hc}
                className="w-full border rounded px-4 py-2" />
            <div className="text-center">
                <button onClick={onNext} disabled={!valid}
                    className={`px-6 py-2 rounded-lg text-white ${valid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}>Next</button>
            </div>
        </div>
    );
}
