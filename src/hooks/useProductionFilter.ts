import { ProductionRow } from '@/types/eaf';
import { PON_MIN_MAX } from '@/constants/billetSpecs';

export interface FilterResult {
  filtered: ProductionRow[];
  totalBefore: number;
  removedByPon: number;
}

/**
 * Find a column in a row by partial match (case-insensitive).
 */
const findColumn = (row: ProductionRow, ...keywords: string[]): string | undefined => {
  return Object.keys(row).find(col => {
    const lower = col.toLowerCase();
    return keywords.some(kw => lower.includes(kw.toLowerCase()));
  });
};

/**
 * Filters production data: removes rows where PON min > 50.
 */
export const filterProductionData = (data: ProductionRow[]): FilterResult => {
  if (data.length === 0) {
    return { filtered: [], totalBefore: 0, removedByPon: 0 };
  }

  const sample = data[0];
  const ponCol = findColumn(sample, 'PON min', 'PON_min', 'PONmin', 'pon');

  console.log('[ProductionFilter] PON column:', ponCol);

  let removedByPon = 0;

  const filtered = data.filter(row => {
    if (ponCol) {
      const ponVal = parseFloat(String(row[ponCol] || 0));
      if (ponVal > PON_MIN_MAX) {
        removedByPon++;
        return false;
      }
    }
    return true;
  });

  console.log('[ProductionFilter] Total:', data.length, '| Kept:', filtered.length, '| Removed by PON:', removedByPon);

  return {
    filtered,
    totalBefore: data.length,
    removedByPon,
  };
};
