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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">
                        📊 Detalle de Procesamiento
                    </h2>
                    <p className="text-purple-100 text-sm mt-1">
                        Información detallada de todas las hojas procesadas del archivo Excel
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="text-purple-200 text-sm font-medium">Total de Hojas</div>
                            <div className="text-white text-2xl font-bold mt-1">{sheetData.length}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="text-green-200 text-sm font-medium">Hojas de Ingresos</div>
                            <div className="text-white text-2xl font-bold mt-1">
                                {sheetData.filter(s => s.isIncome).length}
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="text-red-200 text-sm font-medium">Hojas de Costos</div>
                            <div className="text-white text-2xl font-bold mt-1">
                                {sheetData.filter(s => s.isCost).length}
                            </div>
                        </div>
                    </div>

                    {/* Detailed breakdown by month */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Desglose por Mes</h3>

                        {mesesOrden.map(mes => {
                            const sheets = dataByMonth[mes];
                            if (!sheets) return null;

                            const ingresos = sheets.filter(s => s.isIncome);
                            const costos = sheets.filter(s => s.isCost);

                            return (
                                <div key={mes} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                                    <div className="bg-white/5 px-4 py-3 border-b border-white/10">
                                        <h4 className="text-white font-semibold text-lg">{mes}</h4>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        {/* Ingresos */}
                                        {ingresos.length > 0 && (
                                            <div>
                                                <div className="text-green-300 font-medium mb-2 flex items-center gap-2">
                                                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                                    Ingresos ({ingresos.length} {ingresos.length === 1 ? 'hoja' : 'hojas'})
                                                </div>
                                                <div className="space-y-2 ml-5">
                                                    {ingresos.map((sheet, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm bg-white/5 rounded px-3 py-2">
                                                            <span className="text-purple-200 font-mono text-xs truncate max-w-md">
                                                                {sheet.sheetName}
                                                            </span>
                                                            <span className="text-green-300 font-semibold">
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
                                                <div className="text-red-300 font-medium mb-2 flex items-center gap-2">
                                                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                                    Costos ({costos.length} {costos.length === 1 ? 'hoja' : 'hojas'})
                                                </div>
                                                <div className="space-y-2 ml-5">
                                                    {costos.map((sheet, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm bg-white/5 rounded px-3 py-2">
                                                            <span className="text-purple-200 font-mono text-xs truncate max-w-md">
                                                                {sheet.sheetName}
                                                            </span>
                                                            <span className="text-red-300 font-semibold">
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
