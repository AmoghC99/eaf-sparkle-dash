import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ParetoScenario, MaterialPrices } from '@/types/eaf';
import { PoundSterling, TrendingDown, Zap, Target } from 'lucide-react';

interface CostEstimationProps {
  scenario: ParetoScenario;
  materialPrices: MaterialPrices | null;
}

export const CostEstimation: React.FC<CostEstimationProps> = ({ scenario, materialPrices }) => {
  const materialsWithCosts = Object.entries(scenario.mix)
    .filter(([_, val]) => val > 0)
    .map(([material, percentage]) => {
      const matPrice = materialPrices?.[material];
      return {
        material,
        percentage,
        pricePerTon: matPrice?.pricePerTon || 0,
        tonnage: matPrice?.totalTonnage || 0,
        totalCost: matPrice?.totalCost || 0,
        isFixed: matPrice?.isFixed || false,
        samples: matPrice?.samples || 0,
      };
    })
    .sort((a, b) => b.totalCost - a.totalCost);

  const grandTotalCost = materialsWithCosts.reduce((sum, m) => sum + m.totalCost, 0);
  const grandTotalTonnage = materialsWithCosts.reduce((sum, m) => sum + m.tonnage, 0);
  const totalCostPerTon = grandTotalTonnage > 0 ? (grandTotalCost / grandTotalTonnage) * 1000 : 0;
  const efficiency = scenario.yield / scenario.energyPerTon;

  return (
    <Card className="steel-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PoundSterling className="h-5 w-5 text-primary" />
          Cost & Performance Analysis
        </CardTitle>
        <CardDescription>
          {scenario.name} - Material costs and efficiency metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Zap className="h-4 w-4" />
              Energy/Ton
            </div>
            <p className="text-2xl font-bold text-chart-2">{scenario.energyPerTon} KWh</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <TrendingDown className="h-4 w-4" />
              Yield
            </div>
            <p className="text-2xl font-bold text-success">{scenario.yield}%</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Target className="h-4 w-4" />
              Efficiency
            </div>
            <p className="text-2xl font-bold text-primary">{(efficiency * 100).toFixed(3)}</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <PoundSterling className="h-4 w-4" />
              Loss %
            </div>
            <p className="text-2xl font-bold text-destructive">{(100 - scenario.yield).toFixed(1)}%</p>
          </div>
        </div>

        {/* Cost Breakdown */}
        {materialPrices && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PoundSterling className="h-4 w-4" />
              Material Cost Breakdown
            </h4>
            
            <div className="space-y-2">
              {materialsWithCosts.map((item) => (
                <div 
                  key={item.material}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <span className="text-foreground font-medium">{item.material}</span>
                    {item.isFixed && (
                      <span className="ml-2 text-xs text-primary">(fixed price)</span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      £{item.pricePerTon.toFixed(2)}/ton
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.tonnage > 0 ? `${(item.tonnage / 1000).toFixed(1)}k kg consumed` : 'No tonnage data'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">
                  Total Material Cost/Ton
                </span>
                <span className="text-2xl font-bold text-primary molten-glow">
                  £{totalCostPerTon.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {!materialPrices && (
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
            <p className="text-sm text-warning">
              Upload price data to see cost breakdown
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
