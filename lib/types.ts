export interface MonthlySummary {
    mes: string;
    ingresos: number;
    costos: number;
    margen: number;
    margenPorcentaje: number;
}

export interface SheetData {
    sheetName: string;
    month: string | null;
    isIncome: boolean;
    isCost: boolean;
    total: number;
}

export interface ProcessedData {
    monthlySummary: MonthlySummary[];
    rawData: SheetData[];
}
