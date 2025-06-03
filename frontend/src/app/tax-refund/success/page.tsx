'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-2xl shadow border border-gray-200 text-center space-y-6 max-w-lg">
                <CheckCircle size={60} className="text-green-500 mx-auto" />
                <h1 className="text-3xl font-bold text-gray-800">Payment Successful</h1>
                <p className="text-gray-600">
                    Thank you! Your tax refund process has been initiated. We’ll review your information and send updates to your email.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
