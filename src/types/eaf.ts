export interface MaterialMapping {
  [material: string]: string[];
}

export interface MaterialPrice {
  pricePerTon: number;
  samples: number;
  totalTonnage: number;
  totalCost: number;
  transactions: Array<{
    description: string;
    pricePerTon: number;
    date?: string;
  }>;
  isFixed?: boolean;
}

export interface MaterialPrices {
  [material: string]: MaterialPrice;
}

export interface MaterialCoefficient {
  energyFactor: number;
  costFactor: number;
  yieldFactor: number;
  sampleSize: number;
  cuContribution: number;
  pContribution: number;
}

export interface Coefficients {
  [material: string]: MaterialCoefficient;
}

export interface Baseline {
  energy: number;
  cost: number;
  yield: number;
}

export interface CalculationResult {
  coefficients: Coefficients;
  baseline: Baseline;
  totalHeats: number;
}

export interface ScenarioMix {
  [material: string]: number;
}

export interface ParetoScenario {
  name: string;
  mix: ScenarioMix;
  energyPerTon: number;
  yield: number;
  isOnFrontier: boolean;
  estimatedCu?: number;
  estimatedP?: number;
  meetsSpec?: boolean;
}

export interface ProductionRow {
  'ENERGY_PER_TN KWH/T'?: number;
  'Energy per Ton'?: number;
  'Yield'?: number;
  'Cost per heat £/tn'?: number;
  'Cost'?: number;
  [key: string]: unknown;
}

export interface PriceRow {
  'Material Description'?: string;
  'Material'?: string;
  'Net weight'?: number;
  'NetWeight'?: number;
  'Amt.in loc.cur.'?: number;
  'Amount'?: number;
  'Entry date'?: string;
  [key: string]: unknown;
}
