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
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        Resumen de Ganancias y Pérdidas por Mes
                    </h2>
                    <button
                        onClick={handleExport}
                        className="
              flex items-center gap-2 px-4 py-2 
              bg-blue-600 hover:bg-blue-700 
              rounded-md transition-colors duration-200
              text-white font-medium text-sm
              shadow-sm
            "
                    >
                        <svg
                            className="w-4 h-4"
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
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Mes
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Ingresos
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Costos
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Margen (%)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((row) => (
                                <tr
                                    key={row.mes}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {row.mes}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-green-700">
                                        {formatoMonto(row.ingresos)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-red-700">
                                        {formatoMonto(row.costos)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                                        <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium
                      ${row.margenPorcentaje >= 0
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
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
        </div>
    );
}
