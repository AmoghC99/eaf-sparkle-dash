import { useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  MaterialPrices, 
  Coefficients, 
  Baseline, 
  CalculationResult, 
  ParetoScenario,
  ProductionRow,
  PriceRow 
} from '@/types/eaf';
import { MATERIAL_MAPPING, RECOVERED_SCRAP_FIXED_PRICE } from '@/constants/materials';
import { BILLET_SPECS } from '@/constants/billetSpecs';

export const parseExcelFile = (file: File): Promise<unknown[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const calculateScrapPricesByMaterial = (priceData: PriceRow[]): MaterialPrices => {
  const materialPrices: MaterialPrices = {};
  
  Object.keys(MATERIAL_MAPPING).forEach(material => {
    materialPrices[material] = {
      pricePerTon: 0,
      samples: 0,
      totalTonnage: 0,
      totalCost: 0,
      transactions: []
    };
  });

  // Fixed price for Recovered Scrap
  materialPrices['Recovered Scrap'].pricePerTon = RECOVERED_SCRAP_FIXED_PRICE;
  materialPrices['Recovered Scrap'].isFixed = true;

  // Calculate from price data
  priceData.forEach(row => {
    const description = String(row['Material Description'] || row['Material'] || '');
    const netWeight = parseFloat(String(row['Net weight'] || row['NetWeight'] || 0));
    const amount = parseFloat(String(row['Amt.in loc.cur.'] || row['Amount'] || 0));

    if (netWeight > 0 && amount > 0) {
      const pricePerTon = (amount / netWeight) * 1000;

      // Find matching material
      for (const [material, descriptions] of Object.entries(MATERIAL_MAPPING)) {
        if (descriptions.some(desc => description.includes(desc) || desc === description)) {
          materialPrices[material].totalTonnage += netWeight;
          materialPrices[material].totalCost += amount;
          materialPrices[material].pricePerTon = 
            (materialPrices[material].totalCost / materialPrices[material].totalTonnage) * 1000;
          materialPrices[material].samples++;
          materialPrices[material].transactions.push({ 
            description, 
            pricePerTon, 
            date: row['Entry date'] 
          });
          break;
        }
      }
    }
  });

  return materialPrices;
};

export const calculateCoefficientsFromData = (data: ProductionRow[]): CalculationResult => {
  const materialStats: { [key: string]: { costs: number[]; energies: number[]; yields: number[]; cuValues: number[]; pValues: number[]; counts: number } } = {};
  
  Object.keys(MATERIAL_MAPPING).forEach(mat => {
    materialStats[mat] = {
      costs: [],
      energies: [],
      yields: [],
      cuValues: [],
      pValues: [],
      counts: 0
    };
  });

  // Find Cu and P columns
  const sampleRow = data[0];
  const allCols = sampleRow ? Object.keys(sampleRow) : [];
  const cuCol = allCols.find(col => {
    const lower = col.toLowerCase();
    return lower.includes('cu') && (lower.includes('max') || lower.includes('copper'));
  }) || allCols.find(col => col.toLowerCase().includes('copper'));
  const pCol = allCols.find(col => {
    const lower = col.toLowerCase();
    return (lower.includes('p (max)') || lower.includes('p(max)') || lower.includes('p max') || lower.includes('p_max') || lower.includes('phosphorus'));
  });

  console.log('[Coefficients] Cu column:', cuCol, '| P column:', pCol);

  data.forEach(row => {
    const energyPerTon = parseFloat(String(row['ENERGY_PER_TN KWH/T'] || row['Energy per Ton'] || 0));
    const yieldVal = parseFloat(String(row['Yield'] || 0));
    const costPerTon = parseFloat(String(row['Cost per heat £/tn'] || row['Cost'] || 0));
    const cuVal = cuCol ? parseFloat(String(row[cuCol] || 0)) : 0;
    const pVal = pCol ? parseFloat(String(row[pCol] || 0)) : 0;

    Object.entries(MATERIAL_MAPPING).forEach(([material]) => {
      const materialCol = Object.keys(row).find(
        col => col.includes(material) || 
        col.toLowerCase().includes(material.toLowerCase())
      );
      
      if (materialCol) {
        const percentage = parseFloat(String(row[materialCol])) || 0;
        if (percentage > 0) {
          materialStats[material].costs.push(costPerTon);
          materialStats[material].energies.push(energyPerTon);
          materialStats[material].yields.push(yieldVal);
          materialStats[material].cuValues.push(cuVal);
          materialStats[material].pValues.push(pVal);
          materialStats[material].counts += percentage;
        }
      }
    });
  });

  const merchantStats = materialStats['Merchant 1 & 2'];
  const baselineEnergy = merchantStats.energies.length > 0 
    ? merchantStats.energies.reduce((a, b) => a + b, 0) / merchantStats.energies.length 
    : 365;
  const baselineCost = merchantStats.costs.length > 0 
    ? merchantStats.costs.reduce((a, b) => a + b, 0) / merchantStats.costs.length 
    : 29.5;
  const baselineYield = merchantStats.yields.length > 0 
    ? merchantStats.yields.reduce((a, b) => a + b, 0) / merchantStats.yields.length 
    : 9.5;

  const newCoefficients: Coefficients = {};
  Object.entries(materialStats).forEach(([material, stats]) => {
    const avgEnergy = stats.energies.length > 0 
      ? stats.energies.reduce((a, b) => a + b, 0) / stats.energies.length 
      : baselineEnergy;
    const avgCost = stats.costs.length > 0 
      ? stats.costs.reduce((a, b) => a + b, 0) / stats.costs.length 
      : baselineCost;
    const avgYield = stats.yields.length > 0 
      ? stats.yields.reduce((a, b) => a + b, 0) / stats.yields.length 
      : baselineYield;

    const avgCu = stats.cuValues.length > 0
      ? stats.cuValues.reduce((a, b) => a + b, 0) / stats.cuValues.length
      : 0;
    const avgP = stats.pValues.length > 0
      ? stats.pValues.reduce((a, b) => a + b, 0) / stats.pValues.length
      : 0;

    newCoefficients[material] = {
      energyFactor: avgEnergy / baselineEnergy,
      costFactor: avgCost / baselineCost,
      yieldFactor: avgYield / baselineYield,
      sampleSize: stats.counts,
      cuContribution: avgCu,
      pContribution: avgP,
    };
  });

  return {
    coefficients: newCoefficients,
    baseline: {
      energy: baselineEnergy,
      cost: baselineCost,
      yield: baselineYield,
    },
    totalHeats: data.length
  };
};

export const calculateParetoFrontier = (
  coefficients: Coefficients, 
  baseline: Baseline, 
  targetGrade?: string
): ParetoScenario[] => {
  const candidates = [
    {
      name: 'Energy-Optimized',
      mix: {
        'Clean Bales 1': 10, 'Clean Bales 2': 10, 'Merchant 1 & 2': 40, 'Estructural': 30,
        'Tin Cans': 5, 'Incinerator': 0, 'Fragmentized scrap': 5, 'Steel turnings': 0,
        'Scrap Plate Iron': 0, 'Recovered Scrap': 0,
      }
    },
    {
      name: 'Yield-Optimized',
      mix: {
        'Clean Bales 1': 8, 'Clean Bales 2': 12, 'Merchant 1 & 2': 30, 'Estructural': 40,
        'Tin Cans': 8, 'Incinerator': 2, 'Fragmentized scrap': 0, 'Steel turnings': 0,
        'Scrap Plate Iron': 0, 'Recovered Scrap': 0,
      }
    },
    {
      name: 'Balanced',
      mix: {
        'Clean Bales 1': 9, 'Clean Bales 2': 11, 'Merchant 1 & 2': 35, 'Estructural': 35,
        'Tin Cans': 6, 'Incinerator': 1, 'Fragmentized scrap': 2, 'Steel turnings': 1,
        'Scrap Plate Iron': 0, 'Recovered Scrap': 0,
      }
    },
    {
      name: 'Current Mix',
      mix: {
        'Clean Bales 1': 6, 'Clean Bales 2': 11, 'Merchant 1 & 2': 64, 'Estructural': 45,
        'Tin Cans': 9, 'Incinerator': 0, 'Fragmentized scrap': 19, 'Steel turnings': 4,
        'Scrap Plate Iron': 4, 'Recovered Scrap': 2,
      }
    },
  ];

  // Look up grade spec if provided
  const spec = targetGrade ? BILLET_SPECS[targetGrade] : undefined;

  const evaluated: ParetoScenario[] = candidates.map(candidate => {
    const total = Object.values(candidate.mix).reduce((a, b) => a + b, 0);
    const weights: { [key: string]: number } = Object.entries(candidate.mix).reduce((acc, [mat, val]) => {
      acc[mat] = total > 0 ? val / total : 0;
      return acc;
    }, {} as { [key: string]: number });

    let energyFactor = 0;
    let yieldFactor = 0;
    let estimatedCu = 0;
    let estimatedP = 0;
    Object.entries(weights).forEach(([mat, weight]) => {
      const coeff = coefficients[mat];
      energyFactor += weight * (coeff?.energyFactor || 1);
      yieldFactor += weight * (coeff?.yieldFactor || 1);
      estimatedCu += weight * (coeff?.cuContribution || 0);
      estimatedP += weight * (coeff?.pContribution || 0);
    });

    const meetsSpec = spec
      ? (estimatedCu <= spec.cuMax && estimatedP <= spec.pMax)
      : true;

    return {
      ...candidate,
      energyPerTon: Math.round(baseline.energy * energyFactor),
      yield: parseFloat((baseline.yield * yieldFactor).toFixed(2)),
      isOnFrontier: true,
      estimatedCu: parseFloat(estimatedCu.toFixed(4)),
      estimatedP: parseFloat(estimatedP.toFixed(4)),
      meetsSpec,
    };
  });

  evaluated.sort((a, b) => a.energyPerTon - b.energyPerTon);
  return evaluated;
};

export const useScenarioCost = (
  scenario: ParetoScenario | null, 
  materialPrices: MaterialPrices | null
): number => {
  return useMemo(() => {
    if (!scenario || !materialPrices) return 0;
    
    const materials = Object.entries(scenario.mix).filter(([_, val]) => val > 0);
    const totalCost = materials.reduce((sum, [material]) => {
      return sum + (materialPrices[material]?.totalCost || 0);
    }, 0);
    const totalTonnage = materials.reduce((sum, [material]) => {
      return sum + (materialPrices[material]?.totalTonnage || 0);
    }, 0);
    return totalTonnage > 0 ? (totalCost / totalTonnage) * 1000 : 0;
  }, [scenario, materialPrices]);
};
