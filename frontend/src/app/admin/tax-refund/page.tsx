'use client';

import { useEffect, useState } from 'react';

export default function TaxRefundConfigPage() {
    const [filePrice, setFilePrice] = useState('');
    const [amendPrice, setAmendPrice] = useState('');
    const [justFederalPrice, setJustFederalPrice] = useState('');
    const [loading, setLoading] = useState(false);

    // Cargar precios al iniciar
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/admin/tax-refund/jefe/config/?role=admin');
                if (!res.ok) throw new Error(`GET failed with status ${res.status}`);
                const data = await res.json();
                setFilePrice(data.file_price?.toString() || '');
                setAmendPrice(data.amend_price?.toString() || '');
                setJustFederalPrice(data.justfederal_price?.toString() || '');
            } catch (error) {
                console.error('Failed to load prices:', error);
            }
        };

        fetchPrices();
    }, []);

    // Guardar precios
    const handleSave = async () => {
        if (!filePrice || !amendPrice || !justFederalPrice) {
            alert('Please fill in all the fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/admin/tax-refund/jefe/config/?role=admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    file_price: parseFloat(filePrice),
                    amend_price: parseFloat(amendPrice),
                    justfederal_price: parseFloat(justFederalPrice),
                }),
            });

            if (!response.ok) throw new Error(`POST failed with status ${response.status}`);

            const data = await response.json();
            alert('Prices saved:\n' + JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(error);
            alert('Error saving prices.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="p-6 max-w-xl space-y-6">
            <h1 className="text-2xl font-bold">Tax Refund Configuration</h1>

            <div className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">File Price (USD)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={filePrice}
                        onChange={(e) => setFilePrice(e.target.value)}
                        className="w-full border rounded p-2"
                        placeholder="Enter file price"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Amend Price (USD)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amendPrice}
                        onChange={(e) => setAmendPrice(e.target.value)}
                        className="w-full border rounded p-2"
                        placeholder="Enter amend price"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Just Federal Price (USD)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={justFederalPrice}
                        onChange={(e) => setJustFederalPrice(e.target.value)}
                        className="w-full border rounded p-2"
                        placeholder="Enter just federal price"
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </main>
    );
}
