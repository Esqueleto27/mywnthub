// src/app/page.tsx

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black">
      <h1 className="text-4xl font-bold mb-6">Welcome to J1Mood</h1>
      <p className="mb-8 text-center max-w-md">
        Your ultimate platform for everything related to the J-1 visa life. Tax refunds, documents, and guidance – all in one place.
      </p>
      <Link href="/tax-refund">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          Start Tax Refund
        </button>
      </Link>
    </main>
  );
}
