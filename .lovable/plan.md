

## Plan: Cu/P as Optimizer Constraints (Not Row Filters)

### What Changes

**Current behavior:** Cu and P spec limits are used to *remove* production data rows before analysis.
**New behavior:** Cu and P spec limits become *constraints in the optimizer*, ensuring generated scenarios produce steel within spec for the target billet grade. Only the PON min filter remains for row removal.

### Changes Overview

**1. Simplify `src/hooks/useProductionFilter.ts`**
- Remove all Cu/P spec filtering logic (keep only PON min ≤ 50 filter)
- Remove grade matching, `removedBySpec`, and `unmatchedGrades` from the filter
- Simplify the return type accordingly

**2. Update `src/pages/Index.tsx`**
- Simplify the toast message (only PON min removals reported)
- Add a `selectedGrade` state (string, e.g. "KP18") to let users pick a target billet grade
- Pass `selectedGrade` to the optimizer
- Add a grade selector dropdown in the results section

**3. Extract Cu/P coefficients per material from production data** (`src/hooks/useEAFCalculations.ts`)
- In `calculateCoefficientsFromData`, also compute average Cu and P values per material group from the production data (using the Copper and Phosphorus columns)
- Add `cuContribution` and `pContribution` to each material's coefficient

**4. Add Cu/P constraints to `calculateParetoFrontier`** (`src/hooks/useEAFCalculations.ts`)
- Accept a target grade parameter (e.g. "KP18")
- Look up `cuMax` and `pMax` from `BILLET_SPECS` for that grade
- For each candidate scenario, calculate estimated Cu and P from the weighted mix of material coefficients
- Reject (or flag) scenarios where estimated Cu or P exceeds the grade's spec limit
- Add Cu and P estimates to the `ParetoScenario` type for display

**5. Add a Grade Selector component** (`src/components/eaf/GradeSelector.tsx`)
- Dropdown listing all grades from `BILLET_SPECS` (KP04, KP05, etc.)
- Shows the selected grade's Cu max and P max limits
- Placed above the Pareto chart in the results section

**6. Update `src/types/eaf.ts`**
- Add `estimatedCu` and `estimatedP` fields to `ParetoScenario`
- Add `cuContribution` and `pContribution` to `MaterialCoefficient`
- Update `CalculationResult` if needed

**7. Update `src/components/eaf/ScenarioTable.tsx`**
- Add columns for estimated Cu and P values
- Highlight scenarios that violate the grade spec in red

### Technical Details

**Cu/P coefficient extraction** (in `calculateCoefficientsFromData`):
```text
For each material group, compute:
  avgCu = average of Copper column values where that material has > 0% in the mix
  avgP  = average of Phosphorus column values where that material has > 0% in the mix
```

**Constraint check** (in `calculateParetoFrontier`):
```text
For a candidate mix with weights w_i per material:
  estimatedCu = sum(w_i * material_i.cuContribution)
  estimatedP  = sum(w_i * material_i.pContribution)

If targetGrade is set:
  spec = BILLET_SPECS[targetGrade]
  scenario.meetsSpec = (estimatedCu <= spec.cuMax) && (estimatedP <= spec.pMax)
```

**Grade selector** renders a `<Select>` with all ~70 KP codes grouped or sorted, showing the spec limits for the selected grade.

