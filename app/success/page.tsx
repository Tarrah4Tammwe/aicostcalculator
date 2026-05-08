'use client';

import { Suspense } from 'react';
import Link from 'next/link';

// Separate component for useSearchParams to avoid Suspense issues
function SuccessContent() {
  const searchParams = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  
  const calculatorType = searchParams.get('type') || 'calculator';

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-green-900 mb-4">
          Calculation Complete!
        </h1>
        
        <p className="text-lg text-green-700 mb-6">
          Your {calculatorType} results have been generated successfully.
        </p>
        
        <p className="text-slate-600 mb-8">
          Check your email for your detailed results and next steps.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition"
          >
            Calculate Again
          </Link>
          
          <p className="text-sm text-slate-500">
            Questions? <a href="#" className="text-slate-900 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Root page with Suspense wrapper for useSearchParams
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
