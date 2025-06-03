// src/app/tax-refund/components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                        <span className="font-bold text-xl">J1 Summer Tax Back</span>
                    </Link>

                    {/* Menu */}
                    <div className="hidden sm:flex sm:space-x-8 items-center">
                        <Link
                            href="/tax-refund"
                            className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-700 hover:border-blue-500"
                        >
                            Home
                        </Link>
                        <Link
                            href="/tax-refund/faq"
                            className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-700 hover:border-blue-500"
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/tax-refund/about"
                            className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-700 hover:border-blue-500"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/tax-refund/partners"
                            className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-700 hover:border-blue-500"
                        >
                            Partners
                        </Link>
                        <Link
                            href="/tax-refund/contact"
                            className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-700 hover:border-blue-500"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
