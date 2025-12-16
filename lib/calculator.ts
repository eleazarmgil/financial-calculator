import { MonthlySummary, SheetData } from './types';

/**
 * Formatea un número en estilo contable latinoamericano
 * Ejemplo: 1234.56 -> "1.234,56"
 */
export function formatoMonto(valor: number): string {
    if (isNaN(valor) || valor === 0) {
        return '0,00';
    }

    return valor.toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        .replace('.', 'X')
        .replace(/\./g, ',')
        .replace('X', '.');
}

/**
 * Calcula el resumen mensual de ingresos, costos y márgenes
 */
export function calcularResumenMensual(sheetData: SheetData[]): MonthlySummary[] {
    // Agrupar por mes
    const resumenPorMes: Record<string, { ingresos: number; costos: number }> = {};

    for (const sheet of sheetData) {
        if (!sheet.month) continue;

        if (!resumenPorMes[sheet.month]) {
            resumenPorMes[sheet.month] = { ingresos: 0, costos: 0 };
        }

        if (sheet.isIncome) {
            resumenPorMes[sheet.month].ingresos += sheet.total;
        } else if (sheet.isCost) {
            resumenPorMes[sheet.month].costos += sheet.total;
        }
    }

    // Convertir a array y calcular márgenes
    const mesesOrden = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const resumen: MonthlySummary[] = [];

    for (const mes of mesesOrden) {
        if (resumenPorMes[mes]) {
            const { ingresos, costos } = resumenPorMes[mes];
            const margen = ingresos - costos;

            // Cálculo de la fórmula de margen de ganancia sobre el costo
            const margenPorcentaje = costos !== 0
                ? ((Math.abs(ingresos) - costos) / costos) * 100
                : 0;

            resumen.push({
                mes,
                ingresos,
                costos,
                margen,
                margenPorcentaje
            });
        }
    }

    return resumen;
}
