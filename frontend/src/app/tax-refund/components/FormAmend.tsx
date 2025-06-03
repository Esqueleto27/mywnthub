'use client';

import React, { useState, useEffect, useRef } from 'react';
import TaxDetailsAmend from './FormFiles/TaxDetailsAmend';
import UploadDocumentsAmend from './FormFiles/UploadDocumentsAmend';
import BankInformation from './FormFiles/BankInformation';
import Address from './FormFiles/Address';
import Confirmation from './FormFiles/Confirmation';

const STATES_WITHOUT_STATE_TAX = [
    'Alaska', 'Florida', 'Nevada', 'New Hampshire',
    'South Dakota', 'Tennessee', 'Texas', 'Washington', 'Wyoming'
];

function stateRequiresTax(state: string) {
    return !STATES_WITHOUT_STATE_TAX.includes(state);
}

interface PricingData {
    amend: {
        base_price: number;
        promo_price?: number;
        promo_until?: string;
    };
    locker_fee?: number;
}

const FormAmend: React.FC<{ form: any }> = ({ form }) => {
    const [step, setStep] = useState(1);
    const [values, setValues] = useState<any>({ ...form });
    const [files, setFiles] = useState<Record<string, File[]>>({});
    const [pricing, setPricing] = useState<PricingData | null>(null);
    const [countdown, setCountdown] = useState('');
    const uploadRef = useRef<HTMLDivElement>(null);

    // cuando step=2, scrollea a upload
    useEffect(() => {
        if (step === 2) uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [step]);

    // cargo pricing
    useEffect(() => {
        fetch('/api/pricing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service: 'amend' }),
        })
            .then(r => r.json())
            .then((data: PricingData) => {
                setPricing(data);
                if (data.amend.promo_until) startCountdown(data.amend.promo_until);
            })
            .catch(() => setPricing(null));
    }, []);

    // inicia countdown de promo
    const startCountdown = (until: string) => {
        const end = new Date(until).getTime();
        const timer = setInterval(() => {
            const diff = end - Date.now();
            if (diff <= 0) { clearInterval(timer); setCountdown(''); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            setCountdown(`💡 Promo ends in ${d}d ${h}h`);
        }, 1000);
    };

    // calcula total
    const calculateTotal = () => {
        if (!pricing) return 0;
        let total = pricing.amend.base_price;
        // precio promocional si aplica
        if (
            pricing.amend.promo_price != null &&
            pricing.amend.promo_until &&
            new Date(pricing.amend.promo_until) > new Date()
        ) {
            total = pricing.amend.promo_price;
        }
        // recargo locker
        if (values.useProvidedAddress && pricing.locker_fee) {
            total += pricing.locker_fee;
        }
        // si el estado no tiene impuesto estatal
        if (!stateRequiresTax(values.state)) {
            total = pricing.amend.base_price;
        }
        return total;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target;
        setValues((prev: any) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const totalPrice = calculateTotal();

    return (
        <div className="mt-10 space-y-8">
            {pricing && (
                <div className="text-center">
                    <p className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</p>
                    {countdown && <p className="text-green-600">{countdown}</p>}
                </div>
            )}

            {step >= 1 && (
                <TaxDetailsAmend
                    form={values}
                    onChange={handleChange}
                    onNext={() => setStep(2)}
                />
            )}

            {step >= 2 && (
                <div ref={uploadRef}>
                    <UploadDocumentsAmend
                        form={values}
                        files={files}
                        setFiles={setFiles}
                        onNext={() => setStep(3)}
                    />
                </div>
            )}

            {step >= 3 && (
                <BankInformation
                    values={values}
                    setValues={setValues}
                    onNext={() => setStep(4)}
                />
            )}

            {step >= 4 && (
                <Address
                    values={values}
                    setValues={setValues}
                    onNext={() => setStep(5)}
                />
            )}

            {step >= 5 && (
                <Confirmation
                    values={values}
                    onFinish={() => setStep(6)}
                />
            )}
        </div>
    );
};

export default FormAmend;
