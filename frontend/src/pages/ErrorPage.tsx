import React from 'react';

export default function ErrorPage() {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-red-100 text-red-600">
            <h1 className="text-4xl font-bold">Error</h1>
            <p className="text-lg mt-4">Something went wrong. Please try again.</p>
        </div>
    );
}
