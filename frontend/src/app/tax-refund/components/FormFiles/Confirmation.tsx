// src/app/tax-refund/components/FormFiles/Confirmation.tsx
'use client';

import React, { useState, useEffect } from 'react';

const NO_STATE_TAX = new Set([
    'Alaska', 'Florida', 'Nevada', 'New Hampshire',
    'South Dakota', 'Tennessee', 'Texas', 'Washington', 'Wyoming'
]);

async function fetchConfig() {
    const res = await fetch('http://localhost:8000/api/admin/tax-refund/jefe/config/?role=admin');
    if (!res.ok) throw new Error('Config error');
    return res.json() as Promise<{
        file_price: string | number;
        amend_price: string | number;
        justfederal_price: string | number;
    }>;
}

interface ConfirmationProps {
    values: {
        firstName: string;
        lastName: string;
        email: string;
        service: 'file' | 'amend';
        year: string;
        state: string;
    };
    onFinish: () => void;
}

export default function Confirmation({ values, onFinish }: ConfirmationProps) {
    const [cfg, setCfg] = useState<{
        file_price: number;
        amend_price: number;
        justfederal_price: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchConfig()
            .then(raw => {
                // Cast a number inmediatamente
                setCfg({
                    file_price: Number(raw.file_price),
                    amend_price: Number(raw.amend_price),
                    justfederal_price: Number(raw.justfederal_price),
                });
            })
            .catch(() => setError('No se pudieron cargar los precios'));
    }, []);

    if (error) return <p className="text-red-600">{error}</p>;
    if (!cfg) return <p>Cargando precios…</p>;

    // Lógica de precio según servicio y estado
    let finalPrice: number;
    if (values.service === 'amend') {
        finalPrice = cfg.amend_price;
    } else {
        finalPrice = NO_STATE_TAX.has(values.state)
            ? cfg.justfederal_price
            : cfg.file_price;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 space-y-6">
            <h2 className="text-2xl font-bold text-center">Confirmation Details</h2>

            <ul className="list-disc list-inside space-y-1">
                <li><strong>Name:</strong> {values.firstName} {values.lastName}</li>
                <li><strong>Email:</strong> {values.email}</li>
                <li><strong>Service:</strong> {values.service === 'file' ? 'File Taxes' : 'Amend Taxes'}</li>
                <li><strong>Tax Year:</strong> {values.year}</li>
                <li><strong>State:</strong> {values.state}</li>
            </ul>

            <div className="text-center">
                <p className="text-lg font-medium">Total a Pagar:</p>
                <p className="text-3xl font-bold">${finalPrice.toFixed(2)}</p>
            </div>

            {/* Bloque de firma y términos */}
            <div className="space-y-4">
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>Acepto los términos y condiciones</span>
                </label>
                <div className="border border-gray-300 h-32">
                    <p className="text-gray-400 text-center pt-12">Firma aquí (canvas o carga de imagen)</p>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={onFinish}
                    className="mt-4 px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                    Confirm &amp; Finish
                </button>
            </div>
        </div>
    );
}
