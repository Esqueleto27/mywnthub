// src/app/tax-refund/components/FormFiles/BankInformation.tsx
'use client';

import React from 'react';

interface BankInformationProps {
    values: {
        bankName?: string;
        routingNumber?: string;
        accountNumber?: string;
        accountType?: string;
        accountOwner?: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onNext: () => void;
}

const BankInformation: React.FC<BankInformationProps> = ({ values, onChange, onNext }) => {
    const valid =
        !!values.bankName?.trim() &&
        !!values.routingNumber?.trim() &&
        !!values.accountNumber?.trim() &&
        !!values.accountType &&
        !!values.accountOwner;

    return (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Bank Details</h2>
            <p className="text-center text-gray-600 mb-4">
                Enter your U.S. bank account information for direct deposit.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">
                        Bank Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="bankName"
                        value={values.bankName || ''}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Routing Number <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="routingNumber"
                        value={values.routingNumber || ''}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Account Number <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="accountNumber"
                        value={values.accountNumber || ''}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Account Type <span className="text-red-600">*</span>
                    </label>
                    <select
                        name="accountType"
                        value={values.accountType || ''}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                    >
                        <option value="">Select Account Type</option>
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Account Owner <span className="text-red-600">*</span>
                    </label>
                    <select
                        name="accountOwner"
                        value={values.accountOwner || ''}
                        onChange={onChange}
                        className="w-full border rounded px-4 py-2"
                    >
                        <option value="">Select Owner</option>
                        <option value="self">Myself</option>
                        <option value="family">Family Member</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={onNext}
                    disabled={!valid}
                    className={`mt-4 px-6 py-2 rounded-lg text-white font-semibold ${valid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BankInformation;
