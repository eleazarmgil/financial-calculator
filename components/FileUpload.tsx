'use client';

import React, { useCallback, useState } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
}

export default function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                onFileSelect(file);
            } else {
                alert('Por favor, selecciona un archivo Excel (.xlsx o .xls)');
            }
        }
    }, [onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    }, [onFileSelect]);

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center
          transition-all duration-300 ease-in-out
          ${isDragging
                        ? 'border-purple-300 bg-purple-500/20 scale-105'
                        : 'border-purple-300/50 bg-white/10 hover:bg-white/15'
                    }
          ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          backdrop-blur-sm
        `}
            >
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                    id="file-upload"
                />

                <div className="pointer-events-none">
                    <svg
                        className="mx-auto h-16 w-16 text-purple-200 mb-4"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    {isProcessing ? (
                        <div className="space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                            <p className="text-white font-medium">Procesando archivo...</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-xl font-semibold text-white mb-2">
                                Arrastra tu archivo Excel aquí
                            </p>
                            <p className="text-purple-200">
                                o haz clic para seleccionar
                            </p>
                            <p className="text-sm text-purple-300 mt-3">
                                Formatos soportados: .xlsx, .xls
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
