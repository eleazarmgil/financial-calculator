'use client';

import React from 'react';

interface HeaderProps {
    title?: string;
}

export default function Header({ title = "Calculadora Financiera" }: HeaderProps) {
    return (
        <header className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {title}
                </h1>
                <p className="text-gray-600 text-base">
                    Análisis de ingresos, costos y márgenes de ganancia
                </p>
            </div>
        </header>
    );
}
