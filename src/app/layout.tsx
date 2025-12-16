import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ["latin"]
});

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
            <body className={poppins.className}>{children}</body>
        </html>
    );
}
