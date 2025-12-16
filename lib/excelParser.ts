import * as XLSX from 'xlsx';
import { SheetData } from './types';

// Diccionario para mapear abreviaturas de meses a nombres completos
const mesesMap: Record<string, string> = {
    'enero': 'Enero',
    'ene': 'Enero',
    'febrero': 'Febrero',
    'feb': 'Febrero',
    'marzo': 'Marzo',
    'mar': 'Marzo',
    'abril': 'Abril',
    'abr': 'Abril',
    'mayo': 'Mayo',
    'may': 'Mayo',
    'junio': 'Junio',
    'jun': 'Junio',
    'julio': 'Julio',
    'jul': 'Julio',
    'agosto': 'Agosto',
    'agto': 'Agosto',
    'ago': 'Agosto',
    'septiembre': 'Septiembre',
    'sept': 'Septiembre',
    'sep': 'Septiembre',
    'octubre': 'Octubre',
    'oct': 'Octubre',
    'noviembre': 'Noviembre',
    'nov': 'Noviembre',
    'diciembre': 'Diciembre',
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
            col && typeof col === 'string' && col.toLowerCase() === candidate.toLowerCase()
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

        // Intentar encontrar la columna de importes probando diferentes filas de encabezado
        // Algunos sheets tienen headers en fila 1, otros en fila 2
        let jsonData: any[] = [];
        let columnaImporte: string | null = null;

        // Intentar primero con range: 0 (headers en fila 1)
        jsonData = XLSX.utils.sheet_to_json(worksheet, {
            defval: null,
            range: 0
        });

        if (jsonData.length > 0) {
            const firstRow = jsonData[0] as Record<string, any>;
            const columns = Object.keys(firstRow);
            columnaImporte = encontrarColumnaImporte(columns);
        }

        // Si no se encontró, intentar con range: 1 (headers en fila 2)
        if (!columnaImporte) {
            jsonData = XLSX.utils.sheet_to_json(worksheet, {
                defval: null,
                range: 1
            });

            if (jsonData.length > 0) {
                const firstRow = jsonData[0] as Record<string, any>;
                const columns = Object.keys(firstRow);
                columnaImporte = encontrarColumnaImporte(columns);
            }
        }

        if (!columnaImporte || jsonData.length === 0) {
            continue; // Saltar si no hay columna de importes
        }

        // Sumar todos los valores de la columna de importes
        let total = 0;
        for (const row of jsonData) {
            const valor = (row as Record<string, any>)[columnaImporte];

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
