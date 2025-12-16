'use client';

import React from 'react';
import { SheetData } from '@/lib/types';
import { formatoMonto } from '@/lib/calculator';

interface DataBreakdownProps {
    sheetData: SheetData[];
}

export default function DataBreakdown({ sheetData }: DataBreakdownProps) {
    if (sheetData.length === 0) {
        return null;
    }

    // Agrupar por mes
    const dataByMonth: Record<string, SheetData[]> = {};
    sheetData.forEach(sheet => {
        if (sheet.month) {
            if (!dataByMonth[sheet.month]) {
                dataByMonth[sheet.month] = [];
            }
            dataByMonth[sheet.month].push(sheet);
        }
    });

    const mesesOrden = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <div className="w-full max-w-5xl mx-auto mt-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        📊 Detalle de Procesamiento
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Información detallada de todas las hojas procesadas del archivo Excel
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-gray-600 text-sm font-medium">Total de Hojas</div>
                            <div className="text-gray-900 text-2xl font-bold mt-1">{sheetData.length}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="text-green-700 text-sm font-medium">Hojas de Ingresos</div>
                            <div className="text-green-900 text-2xl font-bold mt-1">
                                {sheetData.filter(s => s.isIncome).length}
                            </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <div className="text-red-700 text-sm font-medium">Hojas de Costos</div>
                            <div className="text-red-900 text-2xl font-bold mt-1">
                                {sheetData.filter(s => s.isCost).length}
                            </div>
                        </div>
                    </div>

                    {/* Detailed breakdown by month */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Desglose por Mes</h3>

                        {mesesOrden.map(mes => {
                            const sheets = dataByMonth[mes];
                            if (!sheets) return null;

                            const ingresos = sheets.filter(s => s.isIncome);
                            const costos = sheets.filter(s => s.isCost);

                            return (
                                <div key={mes} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                    <div className="bg-white px-4 py-3 border-b border-gray-200">
                                        <h4 className="text-gray-900 font-semibold text-base">{mes}</h4>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        {/* Ingresos */}
                                        {ingresos.length > 0 && (
                                            <div>
                                                <div className="text-green-700 font-medium mb-2 flex items-center gap-2 text-sm">
                                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                                    Ingresos ({ingresos.length} {ingresos.length === 1 ? 'hoja' : 'hojas'})
                                                </div>
                                                <div className="space-y-2 ml-4">
                                                    {ingresos.map((sheet, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm bg-white rounded px-3 py-2 border border-gray-200">
                                                            <span className="text-gray-600 font-mono text-xs truncate max-w-md">
                                                                {sheet.sheetName}
                                                            </span>
                                                            <span className="text-green-700 font-semibold">
                                                                {formatoMonto(sheet.total)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Costos */}
                                        {costos.length > 0 && (
                                            <div>
                                                <div className="text-red-700 font-medium mb-2 flex items-center gap-2 text-sm">
                                                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                                    Costos ({costos.length} {costos.length === 1 ? 'hoja' : 'hojas'})
                                                </div>
                                                <div className="space-y-2 ml-4">
                                                    {costos.map((sheet, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm bg-white rounded px-3 py-2 border border-gray-200">
                                                            <span className="text-gray-600 font-mono text-xs truncate max-w-md">
                                                                {sheet.sheetName}
                                                            </span>
                                                            <span className="text-red-700 font-semibold">
                                                                {formatoMonto(sheet.total)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
