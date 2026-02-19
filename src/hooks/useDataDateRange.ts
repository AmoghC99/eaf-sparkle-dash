import { useMemo } from 'react';
import { ProductionRow } from '@/types/eaf';

/**
 * Parse a date value from Excel data - handles Excel serial numbers, ISO strings, and common formats.
 */
export const parseProductionDate = (value: unknown): Date | null => {
  if (value == null || value === '') return null;

  // Excel serial number (days since 1900-01-01, with Excel's leap year bug)
  if (typeof value === 'number') {
    // Excel serial date: day 1 = Jan 1, 1900. Excel has a bug treating 1900 as leap year.
    const excelEpoch = new Date(1899, 11, 30); // Dec 30, 1899
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    if (!isNaN(date.getTime())) return date;
  }

  const str = String(value).trim();

  // Try ISO format / standard Date parsing
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  // Try DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const parsed = new Date(parseInt(dmyMatch[3]), parseInt(dmyMatch[2]) - 1, parseInt(dmyMatch[1]));
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null;
};

/**
 * Find the date column in production data rows.
 */
export const findDateColumn = (data: ProductionRow[]): string | null => {
  if (data.length === 0) return null;
  
  const firstRow = data[0];
  const candidates = Object.keys(firstRow).filter(col => {
    const lower = col.toLowerCase();
    return lower.includes('date') || lower.includes('fecha') || lower.includes('time') || lower.includes('period');
  });

  // Try each candidate to see if it has parseable dates
  for (const col of candidates) {
    const sample = data.slice(0, 5);
    const parsed = sample.map(row => parseProductionDate(row[col])).filter(Boolean);
    if (parsed.length > 0) return col;
  }

  return candidates[0] || null;
};

export interface DateRange {
  minDate: Date | null;
  maxDate: Date | null;
}

/**
 * Calculate min/max dates from production data.
 */
export const useDateRange = (data: ProductionRow[] | null): DateRange & { dateColumn: string | null } => {
  return useMemo(() => {
    if (!data || data.length === 0) return { minDate: null, maxDate: null, dateColumn: null };

    const dateColumn = findDateColumn(data);
    if (!dateColumn) return { minDate: null, maxDate: null, dateColumn: null };

    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    data.forEach(row => {
      const date = parseProductionDate(row[dateColumn]);
      if (date) {
        if (!minDate || date < minDate) minDate = date;
        if (!maxDate || date > maxDate) maxDate = date;
      }
    });

    return { minDate, maxDate, dateColumn };
  }, [data]);
};

/**
 * Filter production data by date range.
 */
export const filterDataByDateRange = <T extends Record<string, unknown>>(
  data: T[],
  dateColumn: string | null,
  startDate: Date | null,
  endDate: Date | null
): T[] => {
  if (!dateColumn || (!startDate && !endDate)) return data;

  return data.filter(row => {
    const date = parseProductionDate(row[dateColumn]);
    if (!date) return true; // Keep rows without valid dates
    if (startDate && date < startDate) return false;
    if (endDate) {
      // Include the entire end date (end of day)
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (date > endOfDay) return false;
    }
    return true;
  });
};
