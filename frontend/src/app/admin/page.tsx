'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHomePage() {
    const router = useRouter();
    const [role, setRole] = useState<'admin' | 'employee' | null>(null);

    // 🔄 Simulación temporal del rol (más adelante esto vendrá del backend)
    useEffect(() => {
        // Aquí irá la llamada real al backend: /api/admin/users/me
        const queryParam = new URLSearchParams(window.location.search).get('role');
        if (queryParam === 'admin') setRole('admin');
        else setRole('employee'); // por defecto
    }, []);

    if (role === null) {
        return <p className="p-6">Loading...</p>;
    }

    return (
        <main className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Welcome to the Admin Panel</h1>
            <p className="text-gray-700">You are logged in as: <strong>{role}</strong></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <a
                    href="/admin/tax-refund"
                    className="border rounded-xl p-6 shadow hover:shadow-lg transition"
                >
                    <h2 className="text-xl font-semibold">Tax Refund</h2>
                    <p className="text-gray-500">Manage tax refund submissions</p>
                </a>

                {role === 'admin' && (
                    <a
                        href="/admin/agencies"
                        className="border rounded-xl p-6 shadow hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold">Agencies</h2>
                        <p className="text-gray-500">Manage partner agencies</p>
                    </a>
                )}
            </div>
        </main>
    );
}
