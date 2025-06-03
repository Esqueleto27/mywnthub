'use client';

import { useState } from 'react';

export default function TaxRefundConfigPage() {
    const [basePrice, setBasePrice] = useState('89.99');
    const [discount, setDiscount] = useState(true);
    const [deadline, setDeadline] = useState('2025-07-10');

    const handleSave = () => {
        // Reemplazar con POST a backend
        alert('Tax Refund config saved (pending backend)');
    };

    return (
        <main className="p-6 max-w-xl space-y-6">
            <h1 className="text-2xl font-bold">Tax Refund Configuration</h1>

            <div className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Base Price (USD)</label>
                    <input
                        type="text"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Discount Active</label>
                    <input
                        type="checkbox"
                        checked={discount}
                        onChange={(e) => setDiscount(e.target.checked)}
                        className="mr-2"
                    />
                    <span>{discount ? 'Yes' : 'No'}</span>
                </div>

                <div>
                    <label className="block font-medium mb-1">Submission Deadline</label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full border rounded p-2"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                    Save Changes
                </button>
            </div>
        </main>
    );
}
