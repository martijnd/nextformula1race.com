'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="min-h-screen bg-f1-black f1-stripe flex items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-9xl font-black text-f1-red-light mb-4">500</h1>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Something went wrong
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              An unexpected error occurred. Please try again later.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-f1-red hover:bg-f1-red-light text-white font-bold rounded-lg transition-colors duration-200"
              >
                Try again
              </button>
              <Link
                href="/en"
                className="inline-flex items-center gap-2 px-6 py-3 bg-f1-gray hover:bg-f1-gray-light text-white font-bold rounded-lg transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

