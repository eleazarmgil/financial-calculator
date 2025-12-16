import * as XLSX from 'xlsx';
import { MonthlySummary } from './types';
import { formatoMonto } from './calculator';

/**
 * Genera y descarga un archivo Excel con el resumen mensual
 */
export function exportarExcel(resumen: MonthlySummary[]): void {
    // Preparar los datos para el Excel
    const datos = resumen.map(item => ({
        'Mes': item.mes,
        'Ingresos': formatoMonto(item.ingresos),
        'Costos': formatoMonto(item.costos),
        'Margen (%)': `${Math.round(item.margenPorcentaje)} %`
    }));

    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();

    // Convertir los datos a una hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(datos);

    // Ajustar el ancho de las columnas
    const colWidths = [
        { wch: 12 }, // Mes
        { wch: 15 }, // Ingresos
        { wch: 15 }, // Costos
        { wch: 12 }  // Margen (%)
    ];
    ws['!cols'] = colWidths;

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Resumen Mensual');

    // Generar el archivo y descargarlo
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `resumen_financiero_${fecha}.xlsx`;

    XLSX.writeFile(wb, nombreArchivo);
}
