'use client';

import React from 'react';

interface HeaderProps {
    title?: string;
}

export default function Header({ title = "Calculadora Financiera" }: HeaderProps) {
    return (
        <header className="mb-8 text-center">
            <div className="inline-block">
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {title}
                </h1>
                <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </div>
            <p className="mt-4 text-purple-100 text-lg max-w-2xl mx-auto">
                Analiza tus ingresos, costos y márgenes de ganancia desde archivos Excel
            </p>
        </header>
    );
}
