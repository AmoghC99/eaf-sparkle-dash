/**
 * Billet code specifications for production data filtering.
 * Only Cu (max) and P (max) are used for filtering per user requirements.
 */
export interface BilletSpec {
  pMax: number;
  cuMax: number;
}

export const BILLET_SPECS: Record<string, BilletSpec> = {
  KP04: { pMax: 0.035, cuMax: 0.35 },
  KP05: { pMax: 0.035, cuMax: 0.35 },
  KP06: { pMax: 0.04, cuMax: 0.75 },
  KP07: { pMax: 0.05, cuMax: 0.30 },
  KP08: { pMax: 0.035, cuMax: 0.55 },
  KP09: { pMax: 0.035, cuMax: 0.55 },
  KP11: { pMax: 0.03, cuMax: 0.18 },
  KP12: { pMax: 0.03, cuMax: 0.18 },
  KP13: { pMax: 0.035, cuMax: 0.35 },
  KP14: { pMax: 0.04, cuMax: 0.55 },
  KP15: { pMax: 0.035, cuMax: 0.50 },
  KP16: { pMax: 0.05, cuMax: 0.70 },
  KP17: { pMax: 0.035, cuMax: 0.35 },
  KP18: { pMax: 0.05, cuMax: 0.75 },
  KP20: { pMax: 0.03, cuMax: 0.50 },
  KP21: { pMax: 0.03, cuMax: 0.50 },
  KP22: { pMax: 0.030, cuMax: 0.50 },
  KP23: { pMax: 0.035, cuMax: 0.30 },
  KP24: { pMax: 0.035, cuMax: 0.30 },
  KP26: { pMax: 0.04, cuMax: 0.60 },
  KP27: { pMax: 0.04, cuMax: 0.55 },
  KP28: { pMax: 0.04, cuMax: 0.60 },
  KP29: { pMax: 0.04, cuMax: 0.20 },
  KP30: { pMax: 0.04, cuMax: 0.20 },
  KP31: { pMax: 0.03, cuMax: 0.30 },
  KP32: { pMax: 0.03, cuMax: 0.30 },
  KP33: { pMax: 0.030, cuMax: 0.55 },
  KP34: { pMax: 0.035, cuMax: 0.50 },
  KP35: { pMax: 0.035, cuMax: 0.50 },
  KP36: { pMax: 0.035, cuMax: 0.30 },
  KP37: { pMax: 0.05, cuMax: 0.65 },
  KP38: { pMax: 0.040, cuMax: 0.50 },
  KP39: { pMax: 0.035, cuMax: 0.30 },
  KP40: { pMax: 0.05, cuMax: 0.65 },
  KP41: { pMax: 0.040, cuMax: 0.50 },
  KP42: { pMax: 0.050, cuMax: 0.35 },
  KP44: { pMax: 0.05, cuMax: 0.60 },
  KP46: { pMax: 0.05, cuMax: 0.50 },
  KP47: { pMax: 0.05, cuMax: 0.50 },
  KP48: { pMax: 0.035, cuMax: 0.55 },
  KP50: { pMax: 0.020, cuMax: 0.20 },
  KP51: { pMax: 0.020, cuMax: 0.20 },
  KP52: { pMax: 0.040, cuMax: 0.20 },
  KP53: { pMax: 0.040, cuMax: 0.20 },
  KP54: { pMax: 0.03, cuMax: 0.30 },
  KP55: { pMax: 0.03, cuMax: 0.20 },
  KP56: { pMax: 0.030, cuMax: 0.20 },
  KP57: { pMax: 0.030, cuMax: 0.20 },
  KP58: { pMax: 0.025, cuMax: 0.20 },
  KP59: { pMax: 0.030, cuMax: 0.30 },
  KP61: { pMax: 0.040, cuMax: 0.30 },
  KP62: { pMax: 0.040, cuMax: 0.20 },
  KP64: { pMax: 0.030, cuMax: 0.20 },
  KP66: { pMax: 0.030, cuMax: 0.20 },
  KP67: { pMax: 0.040, cuMax: 0.20 },
  KP71: { pMax: 0.05, cuMax: 0.65 },
  KP72: { pMax: 0.035, cuMax: 0.30 },
  KP73: { pMax: 0.05, cuMax: 0.75 },
  KP75: { pMax: 0.04, cuMax: 0.20 },
  KP77: { pMax: 0.030, cuMax: 0.50 },
};

/** Maximum allowed PON min value */
export const PON_MIN_MAX = 50;
