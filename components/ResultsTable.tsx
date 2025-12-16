'use client';

import React from 'react';
import { MonthlySummary } from '@/lib/types';
import { formatoMonto } from '@/lib/calculator';
import { exportarExcel } from '@/lib/excelExporter';

interface ResultsTableProps {
    data: MonthlySummary[];
}

export default function ResultsTable({ data }: ResultsTableProps) {
    if (data.length === 0) {
        return null;
    }

    const handleExport = () => {
        exportarExcel(data);
    };

    return (
        <div className="w-full max-w-5xl mx-auto animate-fadeIn">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">
                        Resumen de Ganancias y Pérdidas por Mes
                    </h2>
                    <button
                        onClick={handleExport}
                        className="
              flex items-center gap-2 px-4 py-2 
              bg-white/20 hover:bg-white/30 
              rounded-lg transition-all duration-200
              text-white font-medium
              border border-white/30
              hover:scale-105 active:scale-95
            "
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        Descargar Excel
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-100 uppercase tracking-wider">
                                    Mes
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-purple-100 uppercase tracking-wider">
                                    Ingresos
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-purple-100 uppercase tracking-wider">
                                    Costos
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-purple-100 uppercase tracking-wider">
                                    Margen (%)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {data.map((row, index) => (
                                <tr
                                    key={row.mes}
                                    className="hover:bg-white/5 transition-colors duration-150"
                                    style={{
                                        animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                                    }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        {row.mes}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-green-300">
                                        {formatoMonto(row.ingresos)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-red-300">
                                        {formatoMonto(row.costos)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                                        <span className={`
                      inline-flex items-center px-3 py-1 rounded-full
                      ${row.margenPorcentaje >= 0
                                                ? 'bg-green-500/20 text-green-300'
                                                : 'bg-red-500/20 text-red-300'
                                            }
                    `}>
                                            {Math.round(row.margenPorcentaje)} %
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateX(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    .animate-fadeIn {
                        animation: fadeIn 0.5s ease-out;
                    }
                `
            }} />
        </div>
    );
}
