import * as XLSX from 'xlsx';
import { SheetData } from './types';

// Diccionario para mapear abreviaturas de meses a nombres completos
const mesesMap: Record<string, string> = {
    'ene': 'Enero',
    'feb': 'Febrero',
    'mar': 'Marzo',
    'abr': 'Abril',
    'may': 'Mayo',
    'jun': 'Junio',
    'jul': 'Julio',
    'agto': 'Agosto',
    'ago': 'Agosto',
    'sept': 'Septiembre',
    'sep': 'Septiembre',
    'oct': 'Octubre',
    'nov': 'Noviembre',
    'dic': 'Diciembre'
};

// Candidatos para la columna de importes
const importeCandidates = [
    'Importe en moneda',
    'Importe',
    'Monto',
    'Importe (moneda)',
    'Importe en Moneda'
];

/**
 * Identifica el mes de una hoja basándose en su nombre
 */
function identificarMes(nombreHoja: string): string | null {
    const nombreLower = nombreHoja.toLowerCase();

    for (const [abreviacion, nombreMes] of Object.entries(mesesMap)) {
        if (nombreLower.includes(abreviacion)) {
            return nombreMes;
        }
    }

    return null;
}

/**
 * Encuentra la columna de importes en el DataFrame
 */
function encontrarColumnaImporte(columns: string[]): string | null {
    for (const candidate of importeCandidates) {
        const found = columns.find(col =>
            col.toLowerCase() === candidate.toLowerCase()
        );
        if (found) return found;
    }
    return null;
}

/**
 * Procesa un archivo Excel y extrae los datos de ingresos y costos
 */
export function parseExcelFile(file: ArrayBuffer): SheetData[] {
    const workbook = XLSX.read(file, { type: 'array' });
    const sheetData: SheetData[] = [];

    for (const sheetName of workbook.SheetNames) {
        const mes = identificarMes(sheetName);

        if (!mes) {
            continue; // Saltar hojas sin mes identificable
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length === 0) {
            continue;
        }

        // Obtener los encabezados (primera fila)
        const headers = jsonData[0] as string[];
        const columnaImporte = encontrarColumnaImporte(headers);

        if (!columnaImporte) {
            continue; // Saltar si no hay columna de importes
        }

        const importeIndex = headers.indexOf(columnaImporte);

        // Sumar todos los valores de la columna de importes
        let total = 0;
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const valor = row[importeIndex];

            if (typeof valor === 'number') {
                total += valor;
            } else if (typeof valor === 'string') {
                const numero = parseFloat(valor.replace(/,/g, ''));
                if (!isNaN(numero)) {
                    total += numero;
                }
            }
        }

        sheetData.push({
            sheetName,
            month: mes,
            isIncome: sheetName.includes('401010'),
            isCost: sheetName.includes('501010'),
            total
        });
    }

    return sheetData;
}
