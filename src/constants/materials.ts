import { MaterialMapping } from '@/types/eaf';

export const MATERIAL_MAPPING: MaterialMapping = {
  'Clean Bales 1': ['8A/NEWSHEETS', '12A', '4A', 'RAIL'],
  'Clean Bales 2': ['12C', '12D', '4C', '8B'],
  'Tin Cans': ['Frag Tin-can Bales', 'Tin Cans Loose / Baled'],
  'Estructural': ['OA', 'OA/#1', 'DEMO.', 'Oversize'],
  'Merchant 1 & 2': [
    '# 1/2 Bales', '#2', '1ª/2ª EXP', 'Cast iron',
    'N1 & HMS1', 'N1&2', 'WIRE', 'Light Iron / Fragfeed'
  ],
  'Incinerator': ['6B'],
  'Fragmentized scrap': ['FRAGMENTIZED'],
  'Steel turnings': ['STEEL TURNINGS'],
  'Scrap Plate Iron': ['Scrap Plate Iron'],
  'Recovered Scrap': [], // Fixed price: £124.5/tn (not in supplier data)
};

export const RECOVERED_SCRAP_FIXED_PRICE = 124.5;

export const MATERIAL_COLORS: { [key: string]: string } = {
  'Clean Bales 1': 'hsl(var(--chart-1))',
  'Clean Bales 2': 'hsl(var(--chart-2))',
  'Tin Cans': 'hsl(var(--chart-3))',
  'Estructural': 'hsl(var(--chart-4))',
  'Merchant 1 & 2': 'hsl(var(--chart-5))',
  'Incinerator': 'hsl(45, 70%, 50%)',
  'Fragmentized scrap': 'hsl(180, 60%, 45%)',
  'Steel turnings': 'hsl(320, 60%, 50%)',
  'Scrap Plate Iron': 'hsl(60, 70%, 45%)',
  'Recovered Scrap': 'hsl(100, 50%, 45%)',
};
