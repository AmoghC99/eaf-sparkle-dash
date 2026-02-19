import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DashboardHeader,
  FileUpload,
  SummaryStats,
  ParetoChart,
  ScenarioTable,
  MaterialMixChart,
  CostEstimation,
  MaterialMappingStatus,
  DateRangeSlicer,
  GradeSelector,
} from '@/components/eaf';
import {
  parseExcelFile,
  calculateCoefficientsFromData,
  calculateScrapPricesByMaterial,
  calculateParetoFrontier,
} from '@/hooks/useEAFCalculations';
import { useDateRange, filterDataByDateRange, findDateColumn } from '@/hooks/useDataDateRange';
import { filterProductionData } from '@/hooks/useProductionFilter';
import {
  Coefficients,
  MaterialPrices,
  ParetoScenario,
  ProductionRow,
  PriceRow,
} from '@/types/eaf';

const Index: React.FC = () => {
  const [productionData, setProductionData] = useState<ProductionRow[] | null>(null);
  const [priceData, setPriceData] = useState<PriceRow[] | null>(null);
  const [coefficients, setCoefficients] = useState<Coefficients | null>(null);
  const [paretoFrontier, setParetoFrontier] = useState<ParetoScenario[] | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ParetoScenario | null>(null);
  const [materialPrices, setMaterialPrices] = useState<MaterialPrices | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('KP18');

  // Date range state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Derive date range from data
  const { minDate, maxDate, dateColumn } = useDateRange(productionData);

  // Initialize date range when data loads
  useEffect(() => {
    if (minDate && maxDate) {
      setStartDate(minDate);
      setEndDate(maxDate);
    }
  }, [minDate, maxDate]);

  // Filter data by selected date range
  const filteredData = useMemo(() => {
    if (!productionData) return null;
    return filterDataByDateRange(productionData, dateColumn, startDate, endDate);
  }, [productionData, dateColumn, startDate, endDate]);

  // Filter price data by the same date range (uses "Entry date" column)
  const filteredPriceData = useMemo(() => {
    if (!priceData) return null;
    const priceDateCol = findDateColumn(priceData as unknown as ProductionRow[]);
    return filterDataByDateRange(priceData, priceDateCol, startDate, endDate);
  }, [priceData, startDate, endDate]);

  // Recalculate material prices when filtered price data changes
  useEffect(() => {
    if (!filteredPriceData || filteredPriceData.length === 0) {
      if (priceData) setMaterialPrices(null);
      return;
    }
    const prices = calculateScrapPricesByMaterial(filteredPriceData);
    setMaterialPrices(prices);
  }, [filteredPriceData, priceData]);

  // Recalculate optimization when filtered data changes
  useEffect(() => {
    if (!filteredData || filteredData.length === 0) {
      setCoefficients(null);
      setParetoFrontier(null);
      setSelectedScenario(null);
      return;
    }

    const { coefficients: calcs, baseline } = calculateCoefficientsFromData(filteredData);
    setCoefficients(calcs);

    const frontier = calculateParetoFrontier(calcs, baseline, selectedGrade);
    setParetoFrontier(frontier);

    setSelectedScenario(prev => {
      if (!prev) return null;
      return frontier.find(s => s.name === prev.name) || null;
    });
  }, [filteredData, selectedGrade]);

  const handleProductionFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const rawData = await parseExcelFile(file) as ProductionRow[];
      const { filtered, totalBefore, removedByPon } = filterProductionData(rawData);
      
      setProductionData(filtered);
      
      let message = `Production data loaded: ${filtered.length} of ${totalBefore} records`;
      if (removedByPon > 0) {
        message += ` (${removedByPon} removed by PON min > 50)`;
      }
      toast.success(message);
    } catch (error) {
      toast.error('Error parsing Excel file: ' + (error as Error).message);
    }
  }, []);

  const handlePriceFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseExcelFile(file) as PriceRow[];
      setPriceData(data);
      toast.success(`Price data loaded: ${data.length} records`);
    } catch (error) {
      toast.error('Error parsing Excel file: ' + (error as Error).message);
    }
  }, []);

  const handleReset = useCallback(() => {
    setProductionData(null);
    setPriceData(null);
    setMaterialPrices(null);
    setCoefficients(null);
    setParetoFrontier(null);
    setSelectedScenario(null);
    setStartDate(null);
    setEndDate(null);
    toast.info('Dashboard reset');
  }, []);

  const handleSelectScenario = useCallback((scenario: ParetoScenario) => {
    setSelectedScenario(scenario);
  }, []);

  const handleDateRangeReset = useCallback(() => {
    setStartDate(minDate);
    setEndDate(maxDate);
  }, [minDate, maxDate]);

  return (
    <div className="min-h-screen bg-background industrial-texture">
      <DashboardHeader hasData={!!productionData} onReset={handleReset} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!productionData ? (
          /* Upload Section */
          <div className="space-y-8">
            <Alert className="border-primary/30 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground">
                Upload your production data to begin optimization analysis. 
                Price data is optional but enables cost estimations.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                title="Step 1: Upload Production Data"
                description="Energy, yield, and cost data from production heats"
                requiredColumns={[
                  'Production Date',
                  'ENERGY_PER_TN KWH/T (energy per ton)',
                  'Yield (%)',
                  'Cost per heat £/tn',
                  'Material mix columns (one per material)',
                ]}
                onFileUpload={handleProductionFileUpload}
                isUploaded={!!productionData}
                recordCount={productionData?.length}
                variant="primary"
              />

              <FileUpload
                title="Step 2: Upload Price Data"
                description="Scrap material pricing from transactions"
                requiredColumns={[
                  'Entry date',
                  'Material Description',
                  'Net weight',
                  'Amt.in loc.cur. (amount in local currency)',
                ]}
                onFileUpload={handlePriceFileUpload}
                isUploaded={!!priceData}
                recordCount={priceData?.length}
                variant="secondary"
                optional
              />
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Date Range Slicer */}
            <DateRangeSlicer
              minDate={minDate}
              maxDate={maxDate}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={(date) => setStartDate(date ?? minDate)}
              onEndDateChange={(date) => setEndDate(date ?? maxDate)}
              onReset={handleDateRangeReset}
              totalRecords={productionData.length}
              filteredRecords={filteredData?.length ?? 0}
            />

            {/* Summary Stats */}
            <SummaryStats
              productionCount={filteredData?.length ?? 0}
              priceCount={filteredPriceData?.length ?? priceData?.length ?? null}
              isOptimized={!!paretoFrontier}
            />

            {/* Grade Selector */}
            <GradeSelector
              selectedGrade={selectedGrade}
              onGradeChange={setSelectedGrade}
            />

            {/* Pareto Chart */}
            {paretoFrontier && (
              <ParetoChart
                scenarios={paretoFrontier}
                selectedScenario={selectedScenario}
                onSelectScenario={handleSelectScenario}
              />
            )}

            {/* Scenario Table */}
            {paretoFrontier && (
              <ScenarioTable
                scenarios={paretoFrontier}
                selectedScenario={selectedScenario}
                onSelectScenario={handleSelectScenario}
                targetGrade={selectedGrade}
              />
            )}

            {/* Selected Scenario Details */}
            {selectedScenario && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MaterialMixChart scenario={selectedScenario} />
                <CostEstimation 
                  scenario={selectedScenario} 
                  materialPrices={materialPrices} 
                />
              </div>
            )}

            {/* Material Mapping Status */}
            <MaterialMappingStatus />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
