import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Financial Calculator - Análisis de Ingresos y Costos",
    description: "Herramienta para analizar ingresos, costos y márgenes de ganancia desde archivos Excel",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
