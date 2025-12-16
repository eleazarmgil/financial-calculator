'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import ResultsTable from '@/components/ResultsTable';
import { parseExcelFile } from '@/lib/excelParser';
import { calcularResumenMensual } from '@/lib/calculator';
import { MonthlySummary } from '@/lib/types';

export default function Home() {
    const [results, setResults] = useState<MonthlySummary[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (file: File) => {
        setIsProcessing(true);
        setError(null);
        setResults([]);

        try {
            // Leer el archivo como ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();

            // Parsear el Excel
            const sheetData = parseExcelFile(arrayBuffer);

            if (sheetData.length === 0) {
                throw new Error('No se encontraron datos válidos en el archivo Excel');
            }

            // Calcular el resumen mensual
            const resumen = calcularResumenMensual(sheetData);

            if (resumen.length === 0) {
                throw new Error('No se pudieron calcular los resultados. Verifica que el archivo tenga el formato correcto.');
            }

            setResults(resumen);
        } catch (err) {
            console.error('Error procesando archivo:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido al procesar el archivo');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Header />

                <FileUpload
                    onFileSelect={handleFileSelect}
                    isProcessing={isProcessing}
                />

                {error && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
                        <div className="flex items-start">
                            <svg
                                className="w-6 h-6 text-red-300 mr-3 flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="text-red-200 font-semibold mb-1">Error al procesar el archivo</h3>
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <ResultsTable data={results} />

                {results.length === 0 && !error && !isProcessing && (
                    <div className="text-center mt-12">
                        <p className="text-purple-200 text-lg">
                            📊 Sube un archivo Excel para comenzar el análisis
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
